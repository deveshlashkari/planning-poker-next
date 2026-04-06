'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { StarBackground } from "@/components/star-background";
import { createSession } from "@/services/sessions";

export default function HomePage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [sessionName, setSessionName] = useState("");

  async function handleCreateSession(e: React.FormEvent) {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    try {
      const { id } = await createSession(sessionName || undefined);
      router.push(`/session/${id}?host=1`);
    } catch {
      setCreating(false);
    }
  }

  return (
    <main className="relative flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <StarBackground />

      {/* Content sits above the fixed star layer */}
      <div className="relative z-10 flex flex-col items-center text-center">

        {/* Badge */}
        <motion.span
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-sky-600 dark:text-sky-300"
        >
          <Sparkles className="h-3 w-3" />
          Real-time planning poker
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-balance text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-50 sm:text-5xl md:text-6xl"
        >
          Estimate stories together,
          <span className="bg-linear-to-r from-sky-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent dark:from-sky-400 dark:via-cyan-300 dark:to-emerald-300">
            {" "}in seconds.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 max-w-xl text-balance text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base"
        >
          Start a room, share the link, and let your team vote using Fibonacci cards.
          No sign-up, just fast, focused sprint planning.
        </motion.p>

        {/* Form */}
        <motion.form
          onSubmit={handleCreateSession}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.26, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex w-full max-w-lg flex-col items-stretch gap-4"
        >
          <label className="flex flex-col items-start gap-2 text-left text-sm font-semibold text-slate-700 dark:text-slate-200">
            Session name
            <input
              type="text"
              maxLength={80}
              placeholder="e.g. Sprint 24 – Backend"
              className="w-full rounded-2xl border border-slate-300 bg-white/80 px-5 py-4 text-base text-slate-900 shadow-sm placeholder:text-slate-400 transition-colors focus-visible:border-sky-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 dark:border-slate-700/80 dark:bg-slate-900/70 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus-visible:ring-offset-slate-950"
              value={sessionName}
              onChange={(e) => setSessionName(e.target.value)}
            />
          </label>

          <motion.button
            type="submit"
            disabled={creating}
            whileHover={!creating ? { scale: 1.02, y: -2 } : undefined}
            whileTap={!creating ? { scale: 0.97 } : undefined}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex w-full items-center justify-center gap-2.5 rounded-2xl bg-sky-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-sky-500/30 transition-colors hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {creating ? (
              <span>Creating session…</span>
            ) : (
              <>
                <span>Host a planning session</span>
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </motion.button>
        </motion.form>

      </div>

      {/* Footer — pinned to the bottom of the viewport on every screen size */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="fixed bottom-4 left-0 right-0 z-10 flex items-center justify-center gap-1.5 text-md text-slate-500 dark:text-slate-500"
      >
        Made with
        <motion.span
          animate={{ scale: [1, 1.4, 1] }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2, ease: "easeInOut" }}
          className="text-rose-500"
        >
          ❤️
        </motion.span>
        by Cursor using Claude Sonnet 4.6 — for the mankind
      </motion.p>
    </main>
  );
}
