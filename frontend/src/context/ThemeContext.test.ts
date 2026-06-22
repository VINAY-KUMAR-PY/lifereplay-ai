import { describe, expect, it, vi } from "vitest";
import { persistTheme, resolveInitialTheme } from "./ThemeContext";

describe("theme persistence", () => {
  it("prefers a saved theme over the operating-system preference", () => {
    expect(resolveInitialTheme("dark", false)).toBe("dark");
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme(null, true)).toBe("dark");
  });

  it("applies dark mode to the root and persists the selection", () => {
    const classes = new Set<string>();
    const root = {
      classList: {
        toggle: (name: string, force?: boolean) => {
          if (force) classes.add(name); else classes.delete(name);
          return Boolean(force);
        }
      },
      style: { colorScheme: "" }
    } as unknown as HTMLElement;
    const storage = { setItem: vi.fn() };

    persistTheme("dark", root, storage);

    expect(classes.has("dark")).toBe(true);
    expect(root.style.colorScheme).toBe("dark");
    expect(storage.setItem).toHaveBeenCalledWith("lifereplay-theme", "dark");
  });
});
