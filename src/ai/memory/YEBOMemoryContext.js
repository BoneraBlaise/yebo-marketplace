import { createContext, useContext } from "react";

/** React context for YEBO memory engine — consumed via useYEBOMemory. */
export const YEBOMemoryContext = createContext(null);

export const useYEBOMemory = () => {
  const ctx = useContext(YEBOMemoryContext);
  if (!ctx) throw new Error("useYEBOMemory must be used within YEBOMemoryProvider");
  return ctx;
};

export const useYEBOMemoryOptional = () => useContext(YEBOMemoryContext);

export default YEBOMemoryContext;
