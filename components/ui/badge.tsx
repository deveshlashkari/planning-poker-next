import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline" | "success";
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors";
    const styles =
      variant === "outline"
        ? "border-slate-300 bg-transparent text-slate-600 dark:border-slate-700 dark:text-slate-300"
        : variant === "success"
        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
        : "border-sky-400/40 bg-sky-500/15 text-sky-700 dark:text-sky-300";

    return (
      <div ref={ref} className={cn(base, styles, className)} {...props} />
    );
  }
);

Badge.displayName = "Badge";
