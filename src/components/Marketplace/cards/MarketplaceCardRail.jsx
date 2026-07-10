import React, { memo, useRef } from "react";
import classNames from "classnames";
import useHorizontalCarousel from "./useHorizontalCarousel";

const MarketplaceCardRail = memo(({
  children,
  className = "",
  itemClassName = "",
  "aria-label": ariaLabel = "Product carousel",
}) => {
  const railRef = useRef(null);
  useHorizontalCarousel(railRef);

  return (
    <div
      ref={railRef}
      className={classNames("mpc-rail mpc-rail--carousel hide-scrollbar mpc-fade-in", className)}
      role="list"
      aria-label={ariaLabel}
    >
      {React.Children.map(children, (child, index) =>
        child ? (
          <div
            key={child.key ?? index}
            role="listitem"
            className={classNames("mpc-rail__item", itemClassName)}
          >
            {child}
          </div>
        ) : null
      )}
    </div>
  );
});

MarketplaceCardRail.displayName = "MarketplaceCardRail";

export default MarketplaceCardRail;
