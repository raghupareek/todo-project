import { create } from "zustand";
import { persist } from "zustand/middleware";

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

export const useThemeStore = create()(
  persist(
    (set) => ({
      theme: "system",
      resolvedTheme: "light",

      setTheme: (theme) =>
        set(() => ({
          theme,
          resolvedTheme: theme === "system" ? getSystemTheme() : theme,
        })),

      syncSystemTheme: () =>
        set((state) => {
          if (state.theme !== "system") return {};
          return { resolvedTheme: getSystemTheme() };
        }),
    }),
    {
      name: "theme-storage",
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);
