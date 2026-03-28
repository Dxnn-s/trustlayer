import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

interface Agent {
  id: string;
  name: string;
  phone: string;
  region: string;
  kebele?: string;
  trust_score: number;
  verified: boolean;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { phone, agentCode } = body as { phone?: string; agentCode?: string };

  const filePath = path.join(process.cwd(), "data", "agents.json");
  const agents: Agent[] = JSON.parse(fs.readFileSync(filePath, "utf-8"));

  const agent = agents.find(
    (a) =>
      (phone && a.phone === phone) || (agentCode && a.id === agentCode)
  );

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
