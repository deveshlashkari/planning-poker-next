import { NextResponse } from "next/server";
import { getSession, setVote } from "../../../sessions/store";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: Request, { params }: Params) {
  const { id } = await params;

  const existing = await getSession(id);
  if (!existing) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const playerId = body?.playerId as string | undefined;
  const value = body?.value as string | undefined;

  if (!playerId || typeof value !== "string") {
    return NextResponse.json(
      { error: "playerId and value are required" },
      { status: 400 }
    );
  }

  const session = await setVote(id, playerId, value);
  if (!session) {
    return NextResponse.json({ error: "Unable to register vote" }, { status: 400 });
  }

  return NextResponse.json({ session });
}
