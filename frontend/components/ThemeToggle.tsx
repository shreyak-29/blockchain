"use client";

import { useTheme } from "@/lib/hooks";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="rounded-lg border border-white/20 bg-white/15 px-2.5 py-2 text-lg font-bold text-white transition-all duration-200 hover:border-white/30 hover:bg-white/25 active:scale-90 sm:px-3 sm:text-xl"
      aria-label="Toggle theme"
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
