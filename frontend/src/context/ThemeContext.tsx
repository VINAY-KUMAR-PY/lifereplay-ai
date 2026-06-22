import { createContext, ReactNode, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | null>(null);

export function resolveInitialTheme(saved: string | null, prefersDark: boolean): Theme {
  if (saved === "light" || saved === "dark") return saved;
  return prefersDark ? "dark" : "light";
}

function initialTheme(): Theme {
  return resolveInitialTheme(
    window.localStorage.getItem("lifereplay-theme"),
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

export function persistTheme(theme: Theme, root: HTMLElement, storage: Pick<Storage, "setItem">) {
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  storage.setItem("lifereplay-theme", theme);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(initialTheme);
  useEffect(() => {
    persistTheme(theme, document.documentElement, window.localStorage);
  }, [theme]);
  return <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((value) => value === "dark" ? "light" : "dark") }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used inside ThemeProvider");
  return context;
}
