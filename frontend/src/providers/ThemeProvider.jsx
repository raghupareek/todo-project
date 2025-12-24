import { useEffect } from "react";
import { useThemeStore } from "../stores/themeStore";

export default function ThemeProvider({ children }) {
  const resolvedTheme = useThemeStore((s) => s.resolvedTheme);
  const syncSystemTheme = useThemeStore((s) => s.syncSystemTheme);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    resolvedTheme === "dark"
      ? root.classList.add("dark")
      : root.classList.remove("dark");
  }, [resolvedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", syncSystemTheme);
    return () => mediaQuery.removeEventListener("change", syncSystemTheme);
  }, [syncSystemTheme]);

  return children;
}
