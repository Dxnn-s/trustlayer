import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Pattern {
  type: string;
  keywords: Record<string, string[]>;
  description: Record<string, string>;
  severity: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text, language = "en" } = body as { text: string; language?: string };

  const filePath = path.join(process.cwd(), "data", "patterns.json");
  const patterns: Pattern[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const normalized = text.toLowerCase();

  const flagged = patterns.filter((pattern) => {
    const keywords: string[] = pattern.keywords[language] ?? pattern.keywords["en"] ?? [];
    const matches = keywords.filter((kw) => normalized.includes(kw.toLowerCase()));
    return matches.length >= 2;
  });

  const riskScore = Math.min(flagged.length, 3);
  const level = riskScore === 0 ? "safe" : riskScore === 1 ? "caution" : "block";

  return NextResponse.json({
    riskScore,
    level,
    flags: flagged.map((p) => ({
      type: p.type,
      description: p.description[language] ?? p.description["en"],
      severity: p.severity,
    })),
  });
}
