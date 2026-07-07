import React from "react";
import { ThemeToggle } from "../../design-system/navigation/ThemeToggle";
import { polishClasses } from "../polishClasses";
import { logPolishDiagnostics } from "../diagnostics/PolishDiagnostics";

/** Fixed theme control for customer surfaces — Phase 8I */
export const FloatingThemeToggle = ({ className = "" }) => {
  logPolishDiagnostics("theme", { component: "FloatingThemeToggle" });
  return (
    <div
      className={`fixed bottom-20 lg:bottom-6 right-4 z-[1200] ${polishClasses.themeTransition} ${className}`}
      role="region"
      aria-label="Theme settings"
    >
      <ThemeToggle />
    </div>
  );
};

/** Inline theme control for workspace headers — Phase 8I */
export const HeaderThemeToggle = ({ className = "" }) => (
  <ThemeToggle className={className} />
);

export default { FloatingThemeToggle, HeaderThemeToggle };
