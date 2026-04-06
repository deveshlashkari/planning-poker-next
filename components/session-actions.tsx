"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Session } from "@/app/api/sessions/store";
import { revealCards, resetRound, closeSession } from "@/services/sessions";

type SessionActionsProps = {
  sessionId: string;
  session: Session;
  isHost: boolean;
  compact?: boolean;
  onClose?: () => void;
};

export function SessionActions({
  sessionId,
  session,
  isHost,
  compact = false,
  onClose,
}: SessionActionsProps) {
  const [pending, setPending] = useState(false);
  const [confirmClose, setConfirmClose] = useState(false);

  const participants = session.players.length;
  const votes = session.players.filter((p) => p.vote != null).length;

  async function handleReveal() {
    if (pending) return;
    setPending(true);
    try { await revealCards(sessionId); } finally { setPending(false); }
  }

  async function handleReset() {
    if (pending) return;
    setPending(true);
    try { await resetRound(sessionId); } finally { setPending(false); }
  }

  async function handleClose() {
    if (pending) return;
    setPending(true);
    try {
      await closeSession(sessionId);
      onClose?.();
    } finally {
      setPending(false);
      setConfirmClose(false);
    }
  }

  if (compact) {
    return (
      <motion.div
        className="flex w-full flex-col items-center justify-center gap-4"
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        {isHost ? (
          <>
            <div className="flex flex-col items-center gap-1 text-center">
              <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
                Host controls
              </div>
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                {session.revealed ? "Cards are revealed" : "Reveal when ready"}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                variant="subtle"
                size="sm"
                disabled={pending || session.revealed}
                onClick={handleReveal}
              >
                Reveal cards
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={handleReset}
              >
                New round
              </Button>
            </div>

            <div className="w-full border-t border-slate-200 pt-3 dark:border-slate-800/60">
              <AnimatePresence mode="wait">
                {confirmClose ? (
                  <motion.div
                    key="confirm"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      This will delete the session for everyone.
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-rose-400/60 bg-rose-50 text-rose-600 hover:bg-rose-100 hover:text-rose-700 dark:border-rose-500/60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 dark:hover:text-rose-200"
                        disabled={pending}
                        onClick={handleClose}
                      >
                        {pending ? "Closing…" : "Yes, close it"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={pending}
                        onClick={() => setConfirmClose(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="idle"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="flex justify-center"
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                      disabled={pending}
                      onClick={() => setConfirmClose(true)}
                    >
                      Close session
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Badge>Waiting for host</Badge>
            {session.revealed ? (
              <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                Cards revealed
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {votes}/{participants} voted
              </div>
            )}
          </div>
        )}
      </motion.div>
    );
  }

  // Full status bar (non-compact)
  return (
    <motion.div
      className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white/80 p-3 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between dark:border-slate-800/90 dark:bg-slate-950/80 dark:shadow-inner dark:shadow-slate-950/80"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-3">
        <Badge className="hidden sm:inline-flex">Live session</Badge>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
          <span>{participants} {participants === 1 ? "participant" : "participants"}</span>
          <span className="text-slate-300 dark:text-slate-600">•</span>
          <span>{votes}/{participants} voted</span>
          {session.revealed && (
            <>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-emerald-600 dark:text-emerald-300">Cards revealed</span>
            </>
          )}
        </div>
      </div>

      {isHost && (
        <div className="flex flex-wrap items-center gap-2">
          <Button type="button" variant="subtle" size="sm" disabled={pending || session.revealed} onClick={handleReveal}>
            Reveal cards
          </Button>
          <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={handleReset}>
            New round
          </Button>

          <AnimatePresence mode="wait">
            {confirmClose ? (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1.5"
              >
                <span className="text-xs text-slate-500 dark:text-slate-400">Sure?</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-rose-400/60 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-500/60 dark:bg-rose-500/10 dark:text-rose-300 dark:hover:bg-rose-500/20 dark:hover:text-rose-200"
                  disabled={pending}
                  onClick={handleClose}
                >
                  {pending ? "Closing…" : "Yes, close"}
                </Button>
                <Button type="button" variant="ghost" size="sm" disabled={pending} onClick={() => setConfirmClose(false)}>
                  Cancel
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
                  disabled={pending}
                  onClick={() => setConfirmClose(true)}
                >
                  Close session
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
