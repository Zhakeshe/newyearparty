"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { StudentProvider } from "./student-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <StudentProvider>{children}</StudentProvider>
    </ThemeProvider>
  );
}
