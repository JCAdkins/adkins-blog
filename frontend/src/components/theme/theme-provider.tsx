"use client";

import {
  ThemeProvider as NextThemesProvider,
  ThemeProviderProps,
} from "next-themes";

interface ExtendedThemeProviderProps extends ThemeProviderProps {
  children: any;
}

export function ThemeProvider({
  children,
  ...props
}: ExtendedThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
