import { NextResponse } from "next/server";
import { getSession, revealVotes, resetRound } from "../../../sessions/store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;

  const session = await getSession(id);
  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const action = body?.action as "reveal" | "reset" | undefined;
  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  let updated = session;
  if (action === "reveal") {
    updated = (await revealVotes(id)) ?? session;
  } else if (action === "reset") {
    updated = (await resetRound(id)) ?? session;
  }

  return NextResponse.json({ session: updated });
}
