import { NextRequest, NextResponse } from "next/server";
import { getCircle, setCircle } from "@/lib/circleStore";

interface Params {
  params: { userId: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const contacts = getCircle(params.userId);
  return NextResponse.json({ contacts });
}

export async function POST(request: NextRequest, { params }: Params) {
  const { phone, name } = await request.json();
  const contacts = getCircle(params.userId);

  if (contacts.length >= 10) {
    return NextResponse.json(
      { error: "Circle is full (max 10)" },
      { status: 400 }
    );
  }

  if (contacts.some((c) => c.phone === phone)) {
    return NextResponse.json({ error: "Already in circle" }, { status: 400 });
  }

  const updated = [...contacts, { phone, name }];
  setCircle(params.userId, updated);

  return NextResponse.json({ success: true, contacts: updated });
}
