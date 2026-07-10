import React, { memo } from "react";
import classNames from "classnames";
import MarketplaceCardGrid from "./MarketplaceCardGrid";

const ProductSkeleton = memo(({ compact = false }) => (
  <div
    className={classNames(
      "mpc-skeleton-card",
      compact ? "w-full" : "w-[260px] sm:w-[280px] shrink-0"
    )}
  >
    <div className="aspect-[4/5] home-skeleton" />
    <div className="p-3 sm:p-4 space-y-2">
      <div className="h-3 w-1/3 home-skeleton rounded" />
      <div className="h-4 w-full home-skeleton rounded" />
      <div className="h-4 w-4/5 home-skeleton rounded" />
      <div className="flex justify-between pt-1">
        <div className="h-5 w-20 home-skeleton rounded" />
        <div className="h-4 w-12 home-skeleton rounded" />
      </div>
    </div>
  </div>
));

ProductSkeleton.displayName = "ProductSkeleton";

const VendorSkeleton = memo(() => (
  <div className="mpc-skeleton-card h-full">
    <div className="mpc-skeleton-vendor">
      <div className="mpc-skeleton-vendor__row">
        <div className="mpc-skeleton-vendor__logo home-skeleton" />
        <div className="mpc-skeleton-vendor__lines">
          <div className="h-3.5 w-4/5 home-skeleton rounded" />
          <div className="h-3 w-1/2 home-skeleton rounded" />
        </div>
      </div>
      <div className="h-3 w-2/3 home-skeleton rounded" />
      <div className="flex gap-1.5 mt-auto">
        <div className="w-10 h-10 home-skeleton rounded-md" />
        <div className="w-10 h-10 home-skeleton rounded-md" />
        <div className="w-10 h-10 home-skeleton rounded-md" />
      </div>
      <div className="h-9 w-full home-skeleton rounded-full mt-1" />
    </div>
  </div>
));

VendorSkeleton.displayName = "VendorSkeleton";

const MarketplaceCardSkeleton = memo(({
  count = 4,
  variant = "product",
  compact = false,
  layout = "rail",
  className = "",
}) => {
  const items = Array.from({ length: count });

  if (variant === "vendor") {
    if (layout === "grid") {
      return (
        <MarketplaceCardGrid className={className}>
          {items.map((_, i) => (
            <VendorSkeleton key={i} />
          ))}
        </MarketplaceCardGrid>
      );
    }

    return (
      <div className={classNames("mpc-swipe lg:hidden", className)}>
        <div className="mpc-swipe__page">
          <div className="mpc-grid mpc-grid--page">
            {items.slice(0, 4).map((_, i) => (
              <VendorSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <MarketplaceCardGrid className={className}>
        {items.map((_, i) => (
          <ProductSkeleton key={i} compact={compact} />
        ))}
      </MarketplaceCardGrid>
    );
  }

  return (
    <div className={classNames("mpc-rail mpc-rail--carousel hide-scrollbar overflow-hidden", className)}>
      {items.map((_, i) => (
        <div key={i} className="mpc-rail__item">
          <ProductSkeleton compact={compact} />
        </div>
      ))}
    </div>
  );
});

MarketplaceCardSkeleton.displayName = "MarketplaceCardSkeleton";

export default MarketplaceCardSkeleton;
