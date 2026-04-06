import { NextResponse } from "next/server";
import { createSession } from "./store";

export async function POST(req: Request) {
  let name: string | undefined;
  try {
    const body = await req.json();
    if (typeof body?.name === "string") name = body.name.trim();
  } catch {
    // body is optional
  }

  const session = await createSession(name);
  return NextResponse.json({ id: session.id, session });
}
