'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const CARD_VALUES = ['0', '1', '2', '3', '5', '8', '13', '20', '40', '100', '?'];

type DeckProps = {
  selected?: string;
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export function Deck({ selected, disabled, onSelect }: DeckProps) {
  return (
    <div className="flex w-full flex-wrap items-end justify-center gap-2 py-1 sm:gap-3">
      {CARD_VALUES.map((value, index) => {
        const isActive = selected === value;
        return (
          <motion.button
            key={value}
            type="button"
            disabled={disabled}
            initial={{ y: 20, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{
              duration: 0.35,
              delay: index * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={!disabled ? { y: -8, scale: 1.06 } : undefined}
            whileTap={!disabled ? { scale: 0.94, y: 0 } : undefined}
            className={cn(
              'flex h-14 w-9 items-center justify-center rounded-xl border text-sm font-semibold shadow-lg backdrop-blur-sm transition-colors',
              'sm:h-20 sm:w-13 sm:rounded-2xl sm:text-xl',
              'border-slate-300 bg-white/90 text-slate-700 hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600',
              'dark:border-slate-700/80 dark:bg-slate-900/90 dark:text-slate-100 dark:hover:border-sky-400/80 dark:hover:bg-slate-800 dark:hover:text-sky-200',
              isActive &&
                'border-sky-500 bg-sky-500 text-white shadow-[0_8px_24px_rgba(14,165,233,0.35)] hover:border-sky-400 hover:bg-sky-400 dark:text-slate-950 dark:shadow-[0_8px_24px_rgba(56,189,248,0.4)]',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            onClick={() => onSelect(value)}
          >
            <span>{value}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
