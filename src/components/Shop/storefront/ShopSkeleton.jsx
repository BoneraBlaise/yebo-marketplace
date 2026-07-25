import React from "react";
import "./shopStorefront.css";

export const ShopSkeleton = () => (
  <div className="shop-main" aria-busy="true" aria-label="Loading shop">
    <div className="shop-skeleton shop-skeleton-cover" />
    <div className="px-6">
      <div className="shop-skeleton shop-skeleton-avatar" />
      <div className="mt-6 space-y-2 max-w-md">
        <div className="shop-skeleton h-7 w-56" />
        <div className="shop-skeleton h-4 w-full" />
        <div className="shop-skeleton h-4 w-2/3" />
      </div>
      <div className="shop-skeleton h-10 w-full max-w-lg mt-6" />
    </div>
    <div className="shop-social-stats">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="shop-skeleton shop-skeleton-stat" />
      ))}
    </div>
    <div className="shop-skeleton h-10 w-full" />
    <div className="shop-product-grid">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="shop-skeleton shop-skeleton-product" />
      ))}
    </div>
  </div>
);

export default ShopSkeleton;
