import React, { useMemo } from "react";
import Cookies from "js-cookie";
import ProductCard from "../ProductCard";
import ProductCardSkeleton from "../../Home/ProductCardSkeleton";
import { MarketplaceCardRail } from "../cards";
import { buildCategoryCollections } from "./categoryLandingUtils";
import "./categoryLanding.css";

const CategoryFeaturedCollections = ({
  products = [],
  allProducts = [],
  matchTitles = [],
  isLoading = false,
}) => {
  const collections = useMemo(() => buildCategoryCollections(products, 10), [products]);

  const recentlyViewed = useMemo(() => {
    try {
      const viewed = JSON.parse(Cookies.get("recentlyViewed") || "[]");
      if (!Array.isArray(viewed) || !viewed.length) return [];
      const pool = allProducts.length ? allProducts : products;
      return viewed
        .map((item) => pool.find((p) => p._id === item._id))
        .filter(Boolean)
        .filter((product) => {
          if (!matchTitles?.length) return true;
          const category = product?.category?.toLowerCase();
          return matchTitles.some((title) => title.toLowerCase() === category);
        })
        .slice(0, 10);
    } catch {
      return [];
    }
  }, [allProducts, products, matchTitles]);

  if (isLoading) {
    return (
      <div className="cat-landing-collections">
        <ProductCardSkeleton count={4} />
      </div>
    );
  }

  if (!collections.length && !recentlyViewed.length) return null;

  return (
    <div className="cat-landing-collections">
      {collections.map((collection) => (
        <section key={collection.id} aria-label={collection.label}>
          <div className="cat-landing-collection__head">
            <h2 className="cat-landing-collection__title">{collection.label}</h2>
          </div>
          <MarketplaceCardRail>
            {collection.products.map((product) => (
              <ProductCard key={`${collection.id}-${product._id}`} data={product} />
            ))}
          </MarketplaceCardRail>
        </section>
      ))}

      {recentlyViewed.length > 0 && (
        <section aria-label="Recently viewed">
          <div className="cat-landing-collection__head">
            <h2 className="cat-landing-collection__title">Recently Viewed</h2>
          </div>
          <MarketplaceCardRail>
            {recentlyViewed.map((product) => (
              <ProductCard key={`recent-${product._id}`} data={product} />
            ))}
          </MarketplaceCardRail>
        </section>
      )}
    </div>
  );
};

export default CategoryFeaturedCollections;
