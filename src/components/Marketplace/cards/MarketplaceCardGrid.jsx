import React, { memo } from "react";
import classNames from "classnames";

const MarketplaceCardGrid = memo(({ children, className = "", as: Tag = "div", ...props }) => (
  <Tag className={classNames("mpc-grid mpc-fade-in", className)} {...props}>
    {children}
  </Tag>
));

MarketplaceCardGrid.displayName = "MarketplaceCardGrid";

export default MarketplaceCardGrid;
