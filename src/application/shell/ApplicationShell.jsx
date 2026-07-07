import React from "react";
import { DesignSystemProvider } from "../../design-system/DesignSystemProvider";
import { THEME_MODE } from "../../design-system/theme/ThemeEngine";
import { StateHostProvider } from "../hosts/StateHostProvider";
import { GlobalHosts } from "../hosts/GlobalHosts";
import { ResponsiveShell } from "../responsive/ResponsiveShell";
import { SkipLink } from "../accessibility/SkipLink";
import { RoutingShell } from "../routing/RoutingShell";
import { useApplicationBootstrap } from "./ApplicationBootstrap";
import { logShellDiagnostics } from "../diagnostics/ShellDiagnostics";
import { prefersReducedMotion } from "../../design-system/accessibility";

/** Root application shell — Phase 8H.1 */
export const ApplicationShell = ({
  children,
  themeMode = THEME_MODE.SYSTEM,
  brand = {},
  routingScope = null,
  className = "",
}) => {
  useApplicationBootstrap({ themeMode, brand });

  React.useEffect(() => {
    logShellDiagnostics("shell", {
      action: "mount",
      reducedMotion: prefersReducedMotion(),
    });
  }, []);

  return (
    <DesignSystemProvider themeMode={themeMode} brand={brand}>
      <StateHostProvider>
        <ResponsiveShell className={className}>
          <SkipLink targetId="main-content" />
          <div id="application-shell" data-shell="yebo" className="min-h-screen flex flex-col">
            <RoutingShell scope={routingScope}>
              {children}
            </RoutingShell>
          </div>
          <GlobalHosts />
        </ResponsiveShell>
      </StateHostProvider>
    </DesignSystemProvider>
  );
};

export default ApplicationShell;
