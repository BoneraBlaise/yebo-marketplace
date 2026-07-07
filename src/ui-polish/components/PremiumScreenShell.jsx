import React from "react";
import classNames from "classnames";
import { polishClasses } from "../polishClasses";

/**
 * Legacy page wrapper — Phase 8B.1 premium screen shell.
 * Presentation-only: consistent spacing, typography rhythm, and surface hierarchy.
 */
export const PremiumScreenShell = ({
  children,
  className,
  as: Component = "div",
  fullBleed = false,
  ...props
}) => (
  <Component
    className={classNames(
      "yebone-premium-screen",
      polishClasses.themeTransition,
      !fullBleed && polishClasses.page,
      className
    )}
    {...props}
  >
    {children}
  </Component>
);

export default PremiumScreenShell;
