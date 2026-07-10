import React, { useMemo } from "react";
import HomeProductCard from "../../Home/HomeProductCard";
import ProductCardSkeleton from "../../Home/ProductCardSkeleton";
import { MarketplaceCardRail } from "../cards";
import {
  buildCategoryCollections,
  getVerifiedSellerProducts,
} from "./categoryLandingUtils";
import "./categoryLanding.css";

const CategoryFeaturedCollections = ({ products = [], isLoading = false }) => {
  const collections = useMemo(() => buildCategoryCollections(products), [products]);
  const verifiedProducts = useMemo(() => getVerifiedSellerProducts(products), [products]);

  if (isLoading) {
    return (
      <div className="cat-landing-collections">
        <ProductCardSkeleton count={4} />
      </div>
    );
  }

  if (!collections.length && !verifiedProducts.length) return null;

  return (
    <div className="cat-landing-collections">
      {collections.map((collection) => (
        <section key={collection.id} aria-label={collection.label}>
          <div className="cat-landing-collection__head">
            <h2 className="cat-landing-collection__title">{collection.label}</h2>
            <span className="cat-landing-collection__count">
              {collection.products.length} items
            </span>
          </div>
          <MarketplaceCardRail>
            {collection.products.map((product) => (
              <HomeProductCard key={`${collection.id}-${product._id}`} data={product} compact fluid />
            ))}
          </MarketplaceCardRail>
        </section>
      ))}

      {verifiedProducts.length > 0 && (
        <section aria-label="Verified Sellers">
          <div className="cat-landing-collection__head">
            <h2 className="cat-landing-collection__title">Verified Sellers</h2>
            <span className="cat-landing-collection__count">
              {verifiedProducts.length} items
            </span>
          </div>
          <MarketplaceCardRail>
            {verifiedProducts.map((product) => (
              <HomeProductCard key={`verified-${product._id}`} data={product} compact fluid />
            ))}
          </MarketplaceCardRail>
        </section>
      )}
    </div>
  );
};

export default CategoryFeaturedCollections;
