"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/useTheme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
      aria-label="Toggle light/dark mode"
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 bg-white/80 text-slate-600 shadow-sm transition-colors hover:border-sky-400 hover:text-sky-600 dark:border-slate-700/60 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-sky-500/50 dark:hover:text-sky-300"
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </motion.button>
  );
}
