import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

interface Pattern {
  type: string;
  keywords: Record<string, string[]>;
  description: Record<string, string>;
  severity: string;
}

// ── Keyword fallback (used when no API key is set) ──────────────────────────

function keywordAnalysis(
  text: string,
  language: string,
  patterns: Pattern[]
) {
  const normalized = text.toLowerCase();
  const flagged = patterns.filter((p) => {
    const kws: string[] = p.keywords[language] ?? p.keywords["en"] ?? [];
    return kws.filter((kw) => normalized.includes(kw.toLowerCase())).length >= 2;
  });
  const riskScore = Math.min(flagged.length, 3);
  const level =
    riskScore === 0 ? "safe" : riskScore === 1 ? "caution" : "block";
  return {
    riskScore,
    level,
    flags: flagged.map((p) => ({
      type: p.type,
      description: p.description[language] ?? p.description["en"],
      severity: p.severity,
    })),
    method: "keyword",
  };
}

// ── Claude AI analysis ───────────────────────────────────────────────────────

const ScamAnalysisSchema = z.object({
  riskScore: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe(
      "0 = safe, 1 = mild concern, 2 = likely scam, 3 = definite scam/block"
    ),
  level: z
    .enum(["safe", "caution", "block"])
    .describe("Action recommendation for the user"),
  summary: z
    .string()
    .describe(
      "One sentence plain-language assessment shown to the user"
    ),
  flags: z
    .array(
      z.object({
        type: z.string().describe("Short category label, e.g. PAT-001"),
        description: z
          .string()
          .describe("User-facing explanation of this specific flag"),
        severity: z.enum(["low", "medium", "high"]),
      })
    )
    .describe("Specific red flags found in the message"),
});

const SCAM_SYSTEM_PROMPT = `You are a fraud analyst for TrustLayer, a mobile money fraud prevention platform in Ethiopia (Telebirr/Ethio Telecom). You analyze SMS messages and chat texts to detect scam patterns targeting mobile money users.

Known scam patterns to watch for:
- PAT-001 Urgency: extreme time pressure, "your account expires now", threats
- PAT-002 Credential theft: asking for PIN, OTP, password, secret code
- PAT-003 Impersonation: claiming to be bank, Telebirr, government, official agent
- PAT-004 Stranger contact: unsolicited contact from unknown parties
- PAT-005 Account threats: account suspended/blocked/frozen/deactivated warnings
- PAT-006 Prize scams: lottery wins, unexpected rewards, inheritance offers
- PAT-007 Payment requests: send money now, transfer fees, advance fee fraud
- PAT-008 USSD/code prompts: asking user to dial codes, press star, activate

Evaluate the message holistically — not just keyword matching. Consider:
- Context and intent of the full message
- Combination of tactics (urgency + credential request = very high risk)
- Legitimate messages from real banks/telecoms never ask for PINs or OTPs
- Messages in Amharic (Ethiopic script) or Oromo should be analyzed with the same rigor

riskScore scale: 0=safe, 1=suspicious but could be legitimate, 2=likely scam, 3=definite scam`;

async function claudeAnalysis(text: string, language: string) {
  const client = new Anthropic();

  const langLabel =
    language === "am"
      ? "Amharic"
      : language === "om"
      ? "Oromo"
      : "English";

  const response = await client.messages.parse({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 512,
    system: SCAM_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Analyze this message (language: ${langLabel}):\n\n"${text}"`,
      },
    ],
    output_config: {
      format: zodOutputFormat(ScamAnalysisSchema),
    },
  });

  const result = response.parsed_output!;
  return { ...result, method: "ai" };
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, language = "en" } = body as {
    text: string;
    language?: string;
  };

  if (!text?.trim()) {
    return NextResponse.json(
      { error: "Provide a message text to analyze." },
      { status: 400 }
    );
  }

  const filePath = path.join(process.cwd(), "data", "patterns.json");
  const patterns: Pattern[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  // Use Claude if API key is configured, otherwise fall back to keywords
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const result = await claudeAnalysis(text, language);
      return NextResponse.json(result);
    } catch (error) {
      if (error instanceof Anthropic.APIError) {
        console.error("Anthropic API error, falling back to keyword analysis:", error.message);
        // Fall through to keyword analysis
      } else {
        throw error;
      }
    }
  }

  return NextResponse.json(keywordAnalysis(text, language, patterns));
}
