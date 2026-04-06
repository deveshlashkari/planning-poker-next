import type { ReactNode } from "react";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Planning Poker Online",
  description: "Modern, fast planning poker for agile teams.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full dark">
      <SpeedInsights />
      <head>
        {/* Runs synchronously before paint to prevent flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="h-full overflow-y-auto bg-linear-to-br from-slate-50 via-sky-50/30 to-slate-100 text-slate-900 antialiased transition-colors duration-300 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-50">
        <div className="mx-auto flex min-h-full max-w-6xl flex-col px-4 py-4 sm:px-6 sm:py-5">
          {/* Theme toggle — fixed top-right on every screen */}
          <div className="fixed right-4 top-4 z-50 sm:right-6">
            <ThemeToggle />
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}
