import { useEffect, useState } from "react";
import { createResponsiveEngine } from "./ResponsiveEngine";

const engine = createResponsiveEngine();

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() =>
    typeof window !== "undefined" ? engine.getBreakpoint(window.innerWidth) : "desktop"
  );

  useEffect(() => {
    const onResize = () => setBreakpoint(engine.getBreakpoint(window.innerWidth));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return breakpoint;
};

export default useBreakpoint;
