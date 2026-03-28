import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

const client = new Anthropic();

const ValidationResultSchema = z.object({
  valid: z.boolean().describe("Whether the input is a plausible real value"),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .describe("Confidence in the assessment, 0 (low) to 1 (high)"),
  riskLevel: z
    .enum(["low", "medium", "high"])
    .describe("Fraud/spoofing risk level"),
  reason: z
    .string()
    .describe("Short, user-facing explanation of the assessment"),
  riskFlags: z
    .array(z.string())
    .describe("Specific issues found, empty if none"),
});

type ValidationResult = z.infer<typeof ValidationResultSchema>;

const PHONE_PROMPT = `You are a phone number fraud analyst for an Ethiopian mobile money platform (Telebirr/Ethio Telecom).

Analyze the Ethiopian phone number: {INPUT}

Consider these signals:
- Valid Ethio Telecom prefixes: 91x, 92x, 93x, 94x (for legacy CDMA: 111, 116, etc.)
- Valid Safaricom Ethiopia prefixes: 70x, 71x, 72x, 73x, 74x, 75x, 76x, 77x, 78x, 79x
- Suspicious patterns: all same digit (e.g. 911111111), sequential runs (e.g. 912345678), known scam ranges (+251999xxxxxx used by fraudsters in test data)
- The number must be exactly 9 digits after +251

Report: Is this number plausibly real and low-risk? Provide a confidence score, risk level, and any flags.`;

const EMAIL_PROMPT = `You are an email fraud analyst for a digital identity platform.

Analyze this email address: {INPUT}

Consider these signals:
- Typosquatting: gmial.com, yahooo.com, outlok.com, hotmal.com, gmal.com, etc.
- Known disposable/temporary email domains: mailinator.com, guerrillamail.com, 10minutemail.com, trashmail.com, yopmail.com, throwam.com, sharklasers.com, etc.
- Suspicious patterns: random strings of characters before @, excessive dots or plus signs used evasively
- Legitimate Ethiopian-context domains: ethionet.et, tba.et, gov.et, edu.et, common global providers (gmail, yahoo, outlook, hotmail, protonmail)
- The local part (before @) should look like a real name or reasonable identifier, not a random hash

Report: Is this email address plausibly real and low-risk? Provide a confidence score, risk level, and any flags.`;

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, email } = body as { phone?: string; email?: string };

  if (!phone && !email) {
    return NextResponse.json(
      { error: "Provide phone or email to validate." },
      { status: 400 }
    );
  }

  const input = phone ?? email!;
  const prompt = phone
    ? PHONE_PROMPT.replace("{INPUT}", input)
    : EMAIL_PROMPT.replace("{INPUT}", input);

  try {
    const response = await client.messages.parse({
      // Haiku 4.5: fastest model, ideal for real-time form validation
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      messages: [{ role: "user", content: prompt }],
      output_config: {
        format: zodOutputFormat(ValidationResultSchema),
      },
    });

    const result: ValidationResult = response.parsed_output!;

    return NextResponse.json({
      ...result,
      inputType: phone ? "phone" : "email",
    });
  } catch (error) {
    if (error instanceof Anthropic.APIError) {
      console.error("Anthropic API error:", error.status, error.message);
      return NextResponse.json(
        { error: "Validation service unavailable.", code: error.status },
        { status: 502 }
      );
    }
    throw error;
  }
}
