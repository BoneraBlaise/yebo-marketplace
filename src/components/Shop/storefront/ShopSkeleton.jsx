import React from "react";
import "./shopStorefront.css";

export const ShopSkeleton = () => (
  <div className="shop-storefront space-y-6" aria-busy="true" aria-label="Loading shop">
    <div className="shop-skeleton shop-skeleton-hero" />
    <div className="flex items-end gap-4 px-4 -mt-12">
      <div className="shop-skeleton shop-skeleton-avatar" />
      <div className="flex-1 space-y-2 pb-2">
        <div className="shop-skeleton h-6 w-48" />
        <div className="shop-skeleton h-4 w-32" />
      </div>
    </div>
    <div className="shop-stats px-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="shop-skeleton shop-skeleton-card" />
      ))}
    </div>
    <div className="shop-product-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="shop-skeleton shop-skeleton-product" />
      ))}
    </div>
  </div>
);

export default ShopSkeleton;
