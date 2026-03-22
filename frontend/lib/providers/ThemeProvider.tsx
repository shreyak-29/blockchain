"use client";

import { ReactNode } from "react";

/**
 * ThemeProvider
 * Wrapper component for theme management
 * Theme initialization is handled by inline script in root layout.tsx
 * This prevents SSR hydration mismatches and theme flashing
 */
export default function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
