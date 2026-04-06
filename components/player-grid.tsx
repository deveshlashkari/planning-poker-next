"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import type { Session, Player } from "@/app/api/sessions/store";
import { cn } from "@/lib/utils";

type PlayerGridProps = {
  session: Session;
  currentPlayerId?: string;
  centerContent?: ReactNode;
};

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

type SizeConfig = {
  card: string;
  cardText: string;
  avatar: string;
  avatarText: string;
  nameText: string;
  nameMax: string;
  gap: string;
};

function getSizeConfig(count: number): SizeConfig {
  if (count <= 4)
    return {
      card: "h-20 w-14",
      cardText: "text-sm",
      avatar: "h-9 w-9",
      avatarText: "text-[11px]",
      nameText: "text-[11px]",
      nameMax: "max-w-[80px]",
      gap: "gap-4",
    };
  if (count <= 8)
    return {
      card: "h-16 w-11",
      cardText: "text-xs",
      avatar: "h-8 w-8",
      avatarText: "text-[10px]",
      nameText: "text-[10px]",
      nameMax: "max-w-[68px]",
      gap: "gap-3",
    };
  if (count <= 12)
    return {
      card: "h-13 w-9",
      cardText: "text-[11px]",
      avatar: "h-7 w-7",
      avatarText: "text-[9px]",
      nameText: "text-[9px]",
      nameMax: "max-w-[56px]",
      gap: "gap-2.5",
    };
  return {
    card: "h-11 w-8",
    cardText: "text-[10px]",
    avatar: "h-6 w-6",
    avatarText: "text-[8px]",
    nameText: "text-[8px]",
    nameMax: "max-w-[48px]",
    gap: "gap-2",
  };
}

type PlayerCardProps = {
  player: Player;
  index: number;
  isYou: boolean;
  revealed: boolean;
  sizes: SizeConfig;
  rowAlign: "end" | "start";
};

function PlayerCard({ player, index, isYou, revealed, sizes, rowAlign }: PlayerCardProps) {
  const hasVoted = player.vote != null;

  return (
    <motion.div
      key={player.id}
      layout
      initial={{ opacity: 0, y: rowAlign === "end" ? -14 : 14, scale: 0.88 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.88 }}
      transition={{ duration: 0.3, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "flex flex-col items-center",
        sizes.gap,
        rowAlign === "end" ? "justify-end" : "justify-start"
      )}
    >
      {/* Playing card */}
      <motion.div
        className={cn(
          "flex items-center justify-center rounded-lg border-2 font-bold shadow-md transition-colors",
          sizes.card,
          sizes.cardText,
          !revealed
            ? hasVoted
              ? "border-sky-400/90 bg-sky-500/80 text-white dark:text-sky-950"
              : "border-slate-300 bg-white/80 text-slate-400 dark:border-slate-700/60 dark:bg-slate-800/70 dark:text-slate-500"
            : "border-sky-400 bg-sky-500 text-white shadow-[0_6px_22px_rgba(14,165,233,0.35)] dark:text-slate-950 dark:shadow-[0_6px_22px_rgba(56,189,248,0.45)]"
        )}
        animate={
          hasVoted && !revealed
            ? { scale: [1, 1.08, 1], transition: { duration: 0.28 } }
            : {}
        }
      >
        <AnimatePresence mode="wait">
          {revealed ? (
            <motion.span
              key="revealed"
              initial={{ opacity: 0, scale: 0.5, rotateX: -80 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="tabular-nums"
            >
              {player.vote ?? "—"}
            </motion.span>
          ) : (
            <motion.span
              key="hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Avatar */}
      <div
        className={cn(
          "flex items-center justify-center rounded-full border font-bold shadow",
          sizes.avatar,
          sizes.avatarText,
          "border-slate-300 bg-slate-700 text-white dark:border-slate-600/50 dark:bg-slate-200 dark:text-slate-900",
          isYou && "border-sky-400/80 ring-2 ring-sky-500/30"
        )}
      >
        {initials(player.name)}
      </div>

      {/* Name */}
      <div className="text-center">
        <p
          className={cn(
            "truncate font-semibold leading-none text-slate-800 dark:text-slate-100",
            sizes.nameText,
            sizes.nameMax
          )}
        >
          {player.name}
        </p>
        {isYou && (
          <p className="mt-0.5 text-[8px] font-medium uppercase tracking-widest text-sky-500 dark:text-sky-400">
            You
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function PlayerGrid({
  session,
  currentPlayerId,
  centerContent,
}: PlayerGridProps) {
  const { players, revealed } = session;
  const count = players.length;
  const sizes = getSizeConfig(count);

  const topCount = Math.ceil(count / 2);
  const topPlayers = players.slice(0, topCount);
  const bottomPlayers = players.slice(topCount);

  return (
    <div className="flex flex-1 flex-col" style={{ minHeight: "240px" }}>
      {/* Top row */}
      <div className="flex flex-1 flex-wrap items-end justify-center gap-x-4 gap-y-2 px-4 pb-3">
        <AnimatePresence>
          {topPlayers.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={i}
              isYou={player.id === currentPlayerId}
              revealed={revealed}
              sizes={sizes}
              rowAlign="end"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Center */}
      <motion.div
        className="shrink-0 flex items-center justify-center px-4 py-2"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex w-full max-w-xs flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white/80 px-5 py-4 shadow-[0_12px_50px_rgba(148,163,184,0.2)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/80 dark:shadow-[0_12px_50px_rgba(2,6,23,0.9)]">
          {centerContent}
        </div>
      </motion.div>

      {/* Bottom row */}
      <div className="flex flex-1 flex-wrap items-start justify-center gap-x-4 gap-y-2 px-4 pt-3">
        <AnimatePresence>
          {bottomPlayers.map((player, i) => (
            <PlayerCard
              key={player.id}
              player={player}
              index={topCount + i}
              isYou={player.id === currentPlayerId}
              revealed={revealed}
              sizes={sizes}
              rowAlign="start"
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
