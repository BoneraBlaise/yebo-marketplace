import React, { memo } from "react";
import classNames from "classnames";

const MarketplaceCardSlot = memo(({ children, className = "" }) => (
  <div className={classNames("mpc-card-slot", className)}>{children}</div>
));

MarketplaceCardSlot.displayName = "MarketplaceCardSlot";

export default MarketplaceCardSlot;
