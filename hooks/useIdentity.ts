"use client";

/**
 * useIdentity — localStorage identity management hook
 *
 * Persists and retrieves who the current browser user is inside a session
 * (their player ID, display name, and whether they are the host).
 * This is scoped per session — switching to a different session ID
 * returns null until the user joins that session.
 */

import { useState } from "react";

const STORAGE_KEY = "planning-poker-identity";

export type Identity = {
  sessionId: string;
  playerId: string;
  name: string;
  isHost: boolean;
};

function readIdentity(sessionId: string): Identity | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Identity;
    // Only return if it belongs to the same session
    return parsed.sessionId === sessionId ? parsed : null;
  } catch {
    return null;
  }
}

function writeIdentity(identity: Identity): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}

type UseIdentityReturn = {
  /** The current user's identity, or null if they haven't joined yet. */
  identity: Identity | null;
  /**
   * Save the identity after the user successfully joins.
   * Persists to localStorage and updates component state.
   */
  saveIdentity: (identity: Identity) => void;
  /** Clear identity (e.g. on leave). */
  clearIdentity: () => void;
};

export function useIdentity(sessionId: string | undefined): UseIdentityReturn {
  const [identity, setIdentity] = useState<Identity | null>(() =>
    sessionId ? readIdentity(sessionId) : null
  );

  function saveIdentity(next: Identity) {
    writeIdentity(next);
    setIdentity(next);
  }

  function clearIdentity() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setIdentity(null);
  }

  return { identity, saveIdentity, clearIdentity };
}
