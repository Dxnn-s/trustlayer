import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Agent {
  id: string;
  name: string;
  phone: string;
  email?: string;
  region: string;
  kebele?: string;
  trust_score: number;
  verified: boolean;
}

// Ethiopian phone: +251 followed by exactly 9 digits, first digit 9
const PHONE_REGEX = /^\+2519\d{8}$/;
// Standard email format
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validatePhone(phone: string): string | null {
  const stripped = phone.replace(/[\s\-]/g, "");
  if (!PHONE_REGEX.test(stripped)) {
    return "Invalid Ethiopian phone number. Must be +251 followed by 9 digits starting with 9.";
  }
  return null;
}

function validateEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(trimmed)) {
    return "Invalid email address format.";
  }
  return null;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, email, agentCode } = body as {
    phone?: string;
    email?: string;
    agentCode?: string;
  };

  // Require at least one lookup field
  if (!phone && !email && !agentCode) {
    return NextResponse.json(
      { error: "Provide a phone number, email address, or agent code." },
      { status: 400 }
    );
  }

  // Validate whichever field was provided
  if (phone) {
    const err = validatePhone(phone);
    if (err) {
      return NextResponse.json({ error: err, field: "phone" }, { status: 422 });
    }
  }

  if (email) {
    const err = validateEmail(email);
    if (err) {
      return NextResponse.json({ error: err, field: "email" }, { status: 422 });
    }
  }

  const filePath = path.join(process.cwd(), "data", "agents.json");
  const agents: Agent[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const normalizedEmail = email?.trim().toLowerCase();

  const agent = agents.find((a) => {
    if (phone && a.phone === phone) return true;
    if (normalizedEmail && a.email?.toLowerCase() === normalizedEmail) return true;
    if (agentCode && a.id === agentCode) return true;
    return false;
  });

  if (!agent) {
    return NextResponse.json({
      found: false,
      badge: "red",
      message: "Not in verified agent registry",
    });
  }

  if (agent.verified) {
    return NextResponse.json({
      found: true,
      badge: "green",
      agent: {
        id: agent.id,
        name: agent.name,
        region: agent.region,
        kebele: agent.kebele,
        trust_score: agent.trust_score,
      },
    });
  }

  return NextResponse.json({
    found: true,
    badge: "yellow",
    agent: {
      id: agent.id,
      name: agent.name,
      region: agent.region,
      trust_score: agent.trust_score,
    },
    warning: "Low trust score",
  });
}
