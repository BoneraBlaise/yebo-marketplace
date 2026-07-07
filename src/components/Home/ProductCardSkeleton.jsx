import React from "react";
import { MarketplaceCardSkeleton } from "../Marketplace/cards";

const ProductCardSkeleton = ({ count = 4, compact = false, layout = "rail" }) => (
  <MarketplaceCardSkeleton count={count} compact={compact} layout={layout} variant="product" />
);

export default ProductCardSkeleton;
