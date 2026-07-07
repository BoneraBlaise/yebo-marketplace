import React, { memo, useMemo } from "react";
import classNames from "classnames";
import { chunkArray, MARKETPLACE_SWIPE_PAGE_SIZE } from "./constants";
import MarketplaceCardGrid from "./MarketplaceCardGrid";

/**
 * Mobile: horizontal swipe pages (2×2 grid per page).
 * Tablet+: falls back to responsive MarketplaceCardGrid.
 */
const MarketplaceCardSwipe = memo(({
  children,
  pageSize = MARKETPLACE_SWIPE_PAGE_SIZE,
  className = "",
  gridClassName = "",
  desktopFrom = "lg",
}) => {
  const items = useMemo(
    () => React.Children.toArray(children).filter(Boolean),
    [children]
  );

  const pages = useMemo(() => chunkArray(items, pageSize), [items, pageSize]);

  const desktopGridClass =
    desktopFrom === "md" ? "hidden md:grid" : "hidden lg:grid";

  return (
    <>
      <div
        className={classNames("mpc-swipe hide-scrollbar lg:hidden", className)}
        aria-label="Swipe to browse"
      >
        {pages.map((page, pageIndex) => (
          <div key={`page-${pageIndex}`} className="mpc-swipe__page">
            <div className="mpc-grid mpc-grid--page">
              {page.map((item, itemIndex) => (
                <div key={item.key ?? `item-${pageIndex}-${itemIndex}`} className="mpc-card-slot">
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <MarketplaceCardGrid className={classNames(desktopGridClass, gridClassName)}>
        {items}
      </MarketplaceCardGrid>
    </>
  );
});

MarketplaceCardSwipe.displayName = "MarketplaceCardSwipe";

export default MarketplaceCardSwipe;
