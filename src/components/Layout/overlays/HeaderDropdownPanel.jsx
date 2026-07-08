import React, { memo } from "react";
import classNames from "classnames";

const HeaderDropdownPanel = memo(({
  children,
  className = "",
  ariaLabel = "Menu",
  role = "listbox",
}) => (
  <div
    className={classNames("yebone-header-dropdown", className)}
    role={role}
    aria-label={ariaLabel}
  >
    {children}
  </div>
));

HeaderDropdownPanel.displayName = "HeaderDropdownPanel";

export default HeaderDropdownPanel;
