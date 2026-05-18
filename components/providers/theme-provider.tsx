"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";

export function SiteThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      forcedTheme="light"
      enableSystem={false}
      disableTransitionOnChange
      {...props}
    >
      {children}
    </ThemeProvider>
  );
}
