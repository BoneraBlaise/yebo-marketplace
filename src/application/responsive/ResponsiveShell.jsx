import React from "react";
import { useBreakpoint } from "../../design-system/responsive/useBreakpoint";
import { ResponsiveLayout } from "../../design-system/layouts";

/** Responsive application shell wrapper — Phase 8H.1 */
export const ResponsiveShell = ({ children, className = "" }) => {
  const breakpoint = useBreakpoint();
  return (
    <ResponsiveLayout className={className} data-breakpoint={breakpoint}>
      {children}
    </ResponsiveLayout>
  );
};

export default ResponsiveShell;
