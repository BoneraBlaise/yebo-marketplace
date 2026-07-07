import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createThemeEngine, THEME_MODE } from "./ThemeEngine";

const EnterpriseThemeContext = createContext(null);

export const EnterpriseThemeProvider = ({ children, defaultMode = THEME_MODE.SYSTEM }) => {
  const engine = useMemo(() => createThemeEngine({ defaultMode }), [defaultMode]);
  const [state, setState] = useState(() => engine.getMode());

  useEffect(() => {
    const saved = typeof localStorage !== "undefined" ? localStorage.getItem("yebone-theme-mode") : null;
    engine.apply(saved || defaultMode);
    setState(engine.getMode());

    const unsub = engine.subscribe(setState);

    let mediaCleanup = () => {};
    if (typeof window !== "undefined") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onSystemChange = () => {
        if (engine.mode === THEME_MODE.SYSTEM) {
          engine.apply(THEME_MODE.SYSTEM);
          setState(engine.getMode());
        }
      };
      mq.addEventListener("change", onSystemChange);
      mediaCleanup = () => mq.removeEventListener("change", onSystemChange);
    }

    return () => {
      unsub();
      mediaCleanup();
    };
  }, [engine, defaultMode]);

  const value = useMemo(
    () => ({
      ...state,
      setMode: (mode) => {
        engine.setMode(mode);
        setState(engine.getMode());
      },
      toggle: () => {
        const next = state.resolvedMode === THEME_MODE.DARK ? THEME_MODE.LIGHT : THEME_MODE.DARK;
        engine.setMode(next);
        setState(engine.getMode());
      },
      engine,
    }),
    [engine, state]
  );

  return <EnterpriseThemeContext.Provider value={value}>{children}</EnterpriseThemeContext.Provider>;
};

export const useEnterpriseTheme = () => useContext(EnterpriseThemeContext);

export default EnterpriseThemeProvider;
