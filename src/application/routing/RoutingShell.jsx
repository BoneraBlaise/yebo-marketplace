import React from "react";
import { logShellDiagnostics } from "../diagnostics/ShellDiagnostics";

/** Routing infrastructure shell — no page implementation — Phase 8H.1 */
export const RoutingShell = ({ children, scope = null }) => {
  logShellDiagnostics("route", { action: "mount", scope });
  return (
    <div data-routing-shell="true" data-scope={scope || "all"} className="min-h-full">
      {children}
    </div>
  );
};

export const RouteOutlet = ({ children }) => (
  <main id="route-outlet" role="main" tabIndex={-1} className="outline-none">
    {children}
  </main>
);

export const LazyRouteFallback = () => (
  <div className="flex items-center justify-center p-12" role="status" aria-label="Loading route">
    <div className="w-8 h-8 border-2 border-yebone-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default RoutingShell;
