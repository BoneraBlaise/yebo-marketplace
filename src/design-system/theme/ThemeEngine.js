import { cssVariables } from "../tokens";
import { logDesignSystemDiagnostics } from "../diagnostics/DesignSystemDiagnostics";

export const THEME_MODE = { LIGHT: "light", DARK: "dark", SYSTEM: "system" };

/** Enterprise Theme Engine — Phase 8G */
export class ThemeEngine {
  constructor({ defaultMode = THEME_MODE.SYSTEM } = {}) {
    this.mode = defaultMode;
    this.resolvedMode = THEME_MODE.LIGHT;
    this.listeners = new Set();
  }

  resolveMode(mode = this.mode) {
    if (mode === THEME_MODE.SYSTEM && typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? THEME_MODE.DARK : THEME_MODE.LIGHT;
    }
    return mode === THEME_MODE.DARK ? THEME_MODE.DARK : THEME_MODE.LIGHT;
  }

  apply(mode = this.mode) {
    this.mode = mode;
    this.resolvedMode = this.resolveMode(mode);
    if (typeof document === "undefined") return this.resolvedMode;

    const root = document.documentElement;
    root.classList.toggle("dark", this.resolvedMode === THEME_MODE.DARK);
    root.dataset.theme = this.resolvedMode;
    root.dataset.themeMode = mode;

    Object.entries(cssVariables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });

    if (this.resolvedMode === THEME_MODE.DARK) {
      root.style.setProperty("--yebone-bg", "#1f1f1f");
      root.style.setProperty("--yebone-fg", "#f3f4f6");
    }

    logDesignSystemDiagnostics("theme", { mode, resolved: this.resolvedMode });
    this.listeners.forEach((fn) => fn({ mode, resolvedMode: this.resolvedMode }));
    return this.resolvedMode;
  }

  setMode(mode) {
    if (typeof localStorage !== "undefined") localStorage.setItem("yebone-theme-mode", mode);
    return this.apply(mode);
  }

  getMode() {
    return { mode: this.mode, resolvedMode: this.resolvedMode };
  }

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }
}

export const createThemeEngine = (options) => new ThemeEngine(options);

export default ThemeEngine;
