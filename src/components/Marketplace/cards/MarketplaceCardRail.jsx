import React, { memo } from "react";
import classNames from "classnames";

const MarketplaceCardRail = memo(({ children, className = "", itemClassName = "" }) => (
  <div className={classNames("mpc-rail hide-scrollbar mpc-fade-in", className)}>
    {React.Children.map(children, (child, index) =>
      child ? (
        <div key={child.key ?? index} className={classNames("mpc-rail__item", itemClassName)}>
          {child}
        </div>
      ) : null
    )}
  </div>
));

MarketplaceCardRail.displayName = "MarketplaceCardRail";

export default MarketplaceCardRail;
