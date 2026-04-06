import { adminDb } from "@/lib/firebase-admin";

export type Player = {
  id: string;
  name: string;
  vote?: string;
  joinedAt: number;
};

export type Session = {
  id: string;
  createdAt: number;
  name: string;
  players: Player[];
  revealed: boolean;
  deck: string[];
};

const FIB_DECK = ["0", "1", "2", "3", "5", "8", "13", "20", "40", "100", "?"];

function sessionRef(id: string) {
  return adminDb.collection("sessions").doc(id);
}

export async function createSession(name?: string): Promise<Session> {
  const id = crypto.randomUUID();
  const session: Session = {
    id,
    createdAt: Date.now(),
    name: name?.trim().slice(0, 80) || "Untitled session",
    players: [],
    revealed: false,
    deck: FIB_DECK,
  };
  await sessionRef(id).set(session);
  return session;
}

export async function getSession(id: string): Promise<Session | undefined> {
  const snap = await sessionRef(id).get();
  if (!snap.exists) return undefined;
  return snap.data() as Session;
}

export async function joinSession(
  id: string,
  name: string
): Promise<{ player: Player; alreadyExists: boolean } | undefined> {
  const ref = sessionRef(id);

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return undefined;

    const session = snap.data() as Session;
    const existing = session.players.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (existing) return { player: existing, alreadyExists: true };

    const player: Player = {
      id: crypto.randomUUID(),
      name: name.trim().slice(0, 32),
      joinedAt: Date.now(),
    };
    tx.update(ref, { players: [...session.players, player] });
    return { player, alreadyExists: false };
  });
}

export async function setVote(
  sessionId: string,
  playerId: string,
  value: string
): Promise<Session | undefined> {
  const ref = sessionRef(sessionId);

  return adminDb.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) return undefined;

    const session = snap.data() as Session;
    if (!session.deck.includes(value)) return session;

    const players = session.players.map((p) =>
      p.id === playerId ? { ...p, vote: value } : p
    );
    tx.update(ref, { players });
    return { ...session, players };
  });
}

export async function revealVotes(sessionId: string): Promise<Session | undefined> {
  const ref = sessionRef(sessionId);
  const snap = await ref.get();
  if (!snap.exists) return undefined;
  await ref.update({ revealed: true });
  return { ...(snap.data() as Session), revealed: true };
}

export async function resetRound(sessionId: string): Promise<Session | undefined> {
  const ref = sessionRef(sessionId);
  const snap = await ref.get();
  if (!snap.exists) return undefined;

  const session = snap.data() as Session;
  // Strip votes from every player
  const players = session.players.map(({ vote: _v, ...rest }) => rest) as Player[];
  await ref.update({ revealed: false, players });
  return { ...session, revealed: false, players };
}

export async function deleteSession(sessionId: string): Promise<boolean> {
  const ref = sessionRef(sessionId);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}
