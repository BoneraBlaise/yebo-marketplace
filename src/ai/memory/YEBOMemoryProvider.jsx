import React, { useEffect, useMemo, useRef } from "react";
import { YEBOMemoryContext } from "./YEBOMemoryContext";
import { createYEBOMemoryEngine } from "./YEBOMemoryEngine";
import { createYEBOShoppingContext } from "./YEBOShoppingContext";

/**
 * YEBO Memory Provider — wraps children with session memory architecture.
 * Seeds mock data on mount (presentation only).
 */
export const YEBOMemoryProvider = ({ children, seedMock = true, persistSession = false }) => {
  const engineRef = useRef(null);
  const shoppingRef = useRef(null);

  if (!engineRef.current) {
    engineRef.current = createYEBOMemoryEngine({ persistSession });
    shoppingRef.current = createYEBOShoppingContext(engineRef.current);
  }

  useEffect(() => {
    if (seedMock) engineRef.current.seedMockSession();
  }, [seedMock]);

  const value = useMemo(
    () => ({
      engine: engineRef.current,
      memory: engineRef.current,
      shoppingContext: shoppingRef.current,
      getSnapshot: () => engineRef.current.getSnapshot(),
      getWelcomeMessage: () => engineRef.current.getWelcomeMessage(),
      setActiveScope: (scope, data) => shoppingRef.current.activate(scope, data),
      activateShoppingContext: (scope, data) => shoppingRef.current.activate(scope, data),
    }),
    []
  );

  return <YEBOMemoryContext.Provider value={value}>{children}</YEBOMemoryContext.Provider>;
};

export default YEBOMemoryProvider;
