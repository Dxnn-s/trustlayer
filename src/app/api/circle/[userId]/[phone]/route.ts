import { NextRequest, NextResponse } from "next/server";
import { getCircle, setCircle } from "@/lib/circleStore";

interface Params {
  params: { userId: string; phone: string };
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const contacts = getCircle(params.userId);
  const updated = contacts.filter((c) => c.phone !== params.phone);
  setCircle(params.userId, updated);

  return NextResponse.json({ success: true, contacts: updated });
}
