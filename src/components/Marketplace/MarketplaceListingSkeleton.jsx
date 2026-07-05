import React from "react";

const MarketplaceListingSkeleton = ({ count = 8 }) => (
  <div className="marketplace-product-grid w-full">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900"
      >
        <div className="aspect-[4/5] yebone-skeleton" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-1/3 yebone-skeleton rounded" />
          <div className="h-4 w-full yebone-skeleton rounded" />
          <div className="h-4 w-4/5 yebone-skeleton rounded" />
          <div className="flex justify-between pt-2">
            <div className="h-5 w-20 yebone-skeleton rounded" />
            <div className="h-4 w-12 yebone-skeleton rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default MarketplaceListingSkeleton;
