"use client";

/**
 * useSession — real-time Firestore subscription hook
 *
 * Subscribes to a Firestore session document via `onSnapshot`.
 * The component always has the freshest session state pushed to it
 * the instant any player votes, joins, or the host reveals cards.
 * No polling or manual refetching required.
 */

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Session } from "@/app/api/sessions/store";

type UseSessionReturn = {
  /** Latest session state from Firestore, or null while loading / not found. */
  session: Session | null;
  /** True only during the initial fetch before the first snapshot arrives. */
  loading: boolean;
  /** Set when Firestore returns an error (permissions, network, etc.). */
  error: string | null;
};

export function useSession(sessionId: string | undefined): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    // Reset state whenever the session ID changes
    setLoading(true);
    setError(null);

    const unsubscribe = onSnapshot(
      doc(db, "sessions", sessionId),
      (snap) => {
        if (snap.exists()) {
          setSession(snap.data() as Session);
        } else {
          setSession(null);
        }
        setLoading(false);
      },
      (err) => {
        console.error("[useSession] Firestore error:", err);
        setError("Could not connect to the session. Check your connection.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, [sessionId]);

  return { session, loading, error };
}
