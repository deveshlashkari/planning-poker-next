/**
 * sessions.ts — client-side service layer
 *
 * All network calls to the planning-poker API routes live here.
 * Components never call `fetch` directly; they import from this file.
 * This makes every operation easy to find, test, and swap out.
 */

import type { Player, Session } from "@/app/api/sessions/store";

// ─── Types ────────────────────────────────────────────────────────────────────

export type CreateSessionResult = { id: string; session: Session };
export type JoinSessionResult = { player: Player; sessionId: string };
export type ActionResult = { session: Session };

// ─── Session management ───────────────────────────────────────────────────────

/**
 * Create a new session. Returns the new session ID and full session object.
 * Called by the home page when the host clicks "Host a planning session".
 */
export async function createSession(
  name?: string
): Promise<CreateSessionResult> {
  const res = await fetch("/api/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: name?.trim() || undefined }),
  });
  if (!res.ok) throw new Error("Failed to create session");
  return res.json() as Promise<CreateSessionResult>;
}

// ─── Player actions ───────────────────────────────────────────────────────────

/**
 * Join an existing session by entering a display name.
 * Returns the new Player object and the session ID.
 */
export async function joinSession(
  sessionId: string,
  name: string
): Promise<JoinSessionResult> {
  const res = await fetch(`/api/sessions/${sessionId}/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to join session");
  return res.json() as Promise<JoinSessionResult>;
}

/**
 * Submit a Fibonacci card vote for a player.
 * `value` must be one of the session's deck values (e.g. "1", "3", "8").
 */
export async function castVote(
  sessionId: string,
  playerId: string,
  value: string
): Promise<ActionResult> {
  const res = await fetch(`/api/sessions/${sessionId}/vote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerId, value }),
  });
  if (!res.ok) throw new Error("Failed to cast vote");
  return res.json() as Promise<ActionResult>;
}

// ─── Host controls ────────────────────────────────────────────────────────────

/**
 * Flip all cards face-up so everyone can see the votes.
 * Only the host should call this.
 */
export async function revealCards(sessionId: string): Promise<ActionResult> {
  const res = await fetch(`/api/sessions/${sessionId}/control`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reveal" }),
  });
  if (!res.ok) throw new Error("Failed to reveal cards");
  return res.json() as Promise<ActionResult>;
}

/**
 * Clear all votes and start a fresh round.
 * Only the host should call this.
 */
export async function resetRound(sessionId: string): Promise<ActionResult> {
  const res = await fetch(`/api/sessions/${sessionId}/control`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reset" }),
  });
  if (!res.ok) throw new Error("Failed to reset round");
  return res.json() as Promise<ActionResult>;
}

/**
 * Permanently delete the session from Firestore.
 * Only the host should call this.
 */
export async function closeSession(sessionId: string): Promise<void> {
  const res = await fetch(`/api/sessions/${sessionId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to close session");
}
