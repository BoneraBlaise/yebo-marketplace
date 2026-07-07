import React from "react";
import { focusRingClass } from "../../design-system/accessibility";

export const SkipLink = ({ targetId = "main-content" }) => (
  <a
    href={`#${targetId}`}
    className={`sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[2000] focus:px-4 focus:py-2 focus:bg-yebone-primary focus:text-white focus:rounded-lg ${focusRingClass}`}
  >
    Skip to main content
  </a>
);

export default SkipLink;
