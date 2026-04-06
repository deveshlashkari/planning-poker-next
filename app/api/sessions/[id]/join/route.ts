import { NextResponse } from "next/server";
import { getSession, joinSession } from "../../../sessions/store";

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
  const name = (body?.name as string | undefined)?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const result = await joinSession(id, name);
  if (!result) {
    return NextResponse.json({ error: "Unable to join session" }, { status: 400 });
  }

  return NextResponse.json({ player: result.player, sessionId: id });
}
