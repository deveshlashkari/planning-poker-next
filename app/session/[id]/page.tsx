'use client';

import { Suspense, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { LinkIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Deck } from "@/components/deck";
import { PlayerGrid } from "@/components/player-grid";
import { SessionActions } from "@/components/session-actions";
import { useSession } from "@/hooks/useSession";
import { useIdentity } from "@/hooks/useIdentity";
import { joinSession, castVote } from "@/services/sessions";

// Wrap in Suspense because useSearchParams() requires it in Next.js App Router
export default function SessionPage() {
  return (
    <Suspense
      fallback={
        <main className="flex flex-1 items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Loader2 className="h-5 w-5 animate-spin text-sky-500 dark:text-sky-400" />
            <span>Loading session…</span>
          </div>
        </main>
      }
    >
      <SessionPageInner />
    </Suspense>
  );
}

function SessionPageInner() {
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const router = useRouter();
  const searchParams = useSearchParams();

  // ── Real-time session data from Firestore ──────────────────────────────────
  const { session, loading, error } = useSession(id);

  // ── Persistent browser identity ────────────────────────────────────────────
  const { identity, saveIdentity } = useIdentity(id);

  // ── Local UI state ─────────────────────────────────────────────────────────
  const [joining, setJoining] = useState(false);
  const [nameInput, setNameInput] = useState("");
  const [copyLabel, setCopyLabel] = useState<"Copy link" | "Copied!">("Copy link");

  // Host flag: comes from localStorage after joining, or from the URL on first load
  const isHost = useMemo(() => {
    if (identity?.isHost) return true;
    const flag = searchParams.get("host");
    return flag === "1" || flag === "true";
  }, [identity, searchParams]);

  // The current user's Player record inside the live session
  const currentPlayer = useMemo(
    () => session?.players.find((p) => p.id === identity?.playerId),
    [session, identity]
  );

  // ── Handlers ───────────────────────────────────────────────────────────────

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    if (!id || !nameInput.trim()) return;
    setJoining(true);
    try {
      const { player, sessionId } = await joinSession(id, nameInput.trim());
      saveIdentity({ sessionId, playerId: player.id, name: player.name, isHost });
      setNameInput("");
      // Strip ?host=1 — host status lives in localStorage, not the URL
      router.replace(`/session/${id}`);
    } catch {
      // joinSession throws on network/API errors
    } finally {
      setJoining(false);
    }
  }

  async function handleVote(value: string) {
    if (!id || !identity) return;
    await castVote(id, identity.playerId, value);
  }

  function handleCopyLink() {
    if (typeof window === "undefined") return;
    // Always copy the clean URL — never include ?host=1
    const cleanUrl = `${window.location.origin}/session/${id}`;
    navigator.clipboard
      .writeText(cleanUrl)
      .then(() => {
        setCopyLabel("Copied!");
        setTimeout(() => setCopyLabel("Copy link"), 1600);
      })
      .catch(() => {});
  }

  // ── Render: loading ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin text-sky-500 dark:text-sky-400" />
          <span>Preparing your planning session…</span>
        </div>
      </main>
    );
  }

  // ── Render: error / session not found ─────────────────────────────────────
  if (error || !session) {
    return (
      <main className="flex flex-1 items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center text-sm text-slate-500 dark:text-slate-400">
          <p className="text-base font-semibold text-slate-800 dark:text-slate-200">Session not found</p>
          <p>{error ?? "This session may have expired or the link is invalid."}</p>
          <Button variant="outline" size="sm" onClick={() => router.push("/")}>
            Go home
          </Button>
        </div>
      </main>
    );
  }

  // ── Render: join screen (no identity yet) ─────────────────────────────────
  if (!identity) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">

        {/* Session name + copy link */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex flex-col items-center gap-2 text-center"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-400">
            You&apos;re invited to
          </span>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 sm:text-3xl">
            {session.name}
          </h1>
          <button
            type="button"
            onClick={handleCopyLink}
            className="mt-2 flex items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-300"
          >
            <LinkIcon className="h-4 w-4" />
            {copyLabel}
          </button>
        </motion.div>

        {/* Join card */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-8 shadow-[0_20px_60px_rgba(148,163,184,0.2)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-[0_20px_60px_rgba(2,6,23,0.8)]">
            <h2 className="mb-1 text-lg font-semibold text-slate-900 dark:text-slate-50">
              Join this session
            </h2>
            <p className="mb-7 text-sm text-slate-500 dark:text-slate-400">
              Enter your name — no account needed.
            </p>

            <form className="flex flex-col gap-4" onSubmit={handleJoin}>
              <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Your name
                <Input
                  id="name"
                  autoComplete="off"
                  required
                  maxLength={32}
                  placeholder="Visible on your card"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="h-12 rounded-xl border-slate-700/80 bg-slate-900/70 px-4 text-base placeholder:text-slate-500 focus-visible:ring-sky-500/40"
                />
              </label>

              <motion.button
                type="submit"
                disabled={joining}
                whileHover={!joining ? { scale: 1.02, y: -1 } : undefined}
                whileTap={!joining ? { scale: 0.97 } : undefined}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-500 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/25 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {joining ? "Joining…" : "Join session"}
              </motion.button>
            </form>
          </div>
        </motion.div>

      </main>
    );
  }

  // ── Render: session room ───────────────────────────────────────────────────
  return (
    <main className="flex flex-1 flex-col gap-2">

      {/* Top bar */}
      <div className="flex shrink-0 items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-slate-900 dark:text-slate-50 sm:text-base">
            {session.name}
          </h1>
          <p className="text-[11px] text-slate-500 dark:text-slate-500">
            Voting as{" "}
            <span className="font-semibold text-slate-700 dark:text-slate-300">{identity.name}</span>
            {isHost && (
              <span className="ml-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-300">
                Host
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyLink}
          className="flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white/80 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:bg-sky-500/10 dark:hover:text-sky-300 sm:px-4 sm:py-2"
        >
          <LinkIcon className="h-4 w-4" />
          <span className="hidden sm:inline">{copyLabel}</span>
        </button>
      </div>

      {/* Player table — grows to fill available vertical space */}
      <PlayerGrid
        session={session}
        currentPlayerId={identity.playerId}
        centerContent={
          <SessionActions
            sessionId={id}
            session={session}
            isHost={isHost}
            compact
            onClose={() => router.replace("/")}
          />
        }
      />

      {/* Deck — sticky to the bottom of the viewport so it's always reachable
          on small screens / when devtools is open. Negative margins bleed the
          background to the full container width, matching the layout padding. */}
      <div className="deck-sticky sticky bottom-0 -mx-4 shrink-0 border-t border-slate-200/80 bg-slate-50/95 px-4 pt-2 backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/95 sm:-mx-6 sm:px-6">
        <Deck
          selected={currentPlayer?.vote}
          disabled={session.revealed}
          onSelect={handleVote}
        />
      </div>

    </main>
  );
}
