import React from "react";

const ProductCardSkeleton = ({ count = 4, compact = false }) => (
  <div
    className={`flex gap-4 lg:gap-6 overflow-hidden ${
      compact ? "" : "pb-2"
    }`}
  >
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        className={`shrink-0 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 ${
          compact ? "w-[160px] sm:w-[200px]" : "w-[260px] sm:w-[280px]"
        }`}
      >
        <div className="aspect-[4/5] home-skeleton" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-1/3 home-skeleton rounded" />
          <div className="h-4 w-full home-skeleton rounded" />
          <div className="h-4 w-4/5 home-skeleton rounded" />
          <div className="flex justify-between pt-2">
            <div className="h-5 w-20 home-skeleton rounded" />
            <div className="h-4 w-12 home-skeleton rounded" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ProductCardSkeleton;
