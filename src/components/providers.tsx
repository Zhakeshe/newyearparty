"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { StudentProvider } from "./student-provider";
import { AuthProvider } from "./auth-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthProvider>
        <StudentProvider>{children}</StudentProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
