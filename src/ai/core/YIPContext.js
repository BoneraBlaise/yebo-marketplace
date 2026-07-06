import { createContext, useContext } from "react";

/** YIP React context — isolated from YIPProvider to prevent circular init */
export const YIPContext = createContext(null);

export const useYIP = () => {
  const ctx = useContext(YIPContext);
  if (!ctx) throw new Error("useYIP must be used within YIPProvider");
  return ctx;
};

export const useYIPOptional = () => useContext(YIPContext);

export default YIPContext;
