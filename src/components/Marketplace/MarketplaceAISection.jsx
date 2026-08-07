import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles, HiOutlineLocationMarker, HiOutlineTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { SectionTitle } from "../ui";
import ProductCard from "./ProductCard";
import { MarketplaceCardGrid, MarketplaceCardSlot } from "./cards";
import { filterShowcaseCatalog, deprioritizeDemoCatalog } from "../../utils/catalogQuality";

const MarketplaceAISection = ({ searchTerm }) => {
  const { allProducts } = useSelector((state) => state.products);

  const recentlyViewed = (() => {
    try {
      return JSON.parse(Cookies.get("recentlyViewed") || "[]");
    } catch {
      return [];
    }
  })();

  const curated = filterShowcaseCatalog(allProducts || [], { limit: 8, minResults: 4 });
  const trending = curated.slice(0, 4);
  const nearby = curated.slice(4, 8);

  const suggestions = searchTerm
    ? [`${searchTerm} deals`, `${searchTerm} near me`, `best ${searchTerm}`]
    : ["Electronics deals", "Fashion picks", "Home essentials"];

  return (
    <section className="mt-12 lg:mt-16 space-y-10 yebone-fade-up" aria-label="Personalized marketplace suggestions">
      <div className="marketplace-ai-card">
        <div className="flex items-start gap-3">
          <HiOutlineSparkles className="text-yebone-gold shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-semibold text-yebone-primary dark:text-yebone-gold text-sm">
              Personalized for you
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Recommendations based on your browsing and popular picks across Yebone.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((tip) => (
                <Link
                  key={tip}
                  to={`/search?q=${encodeURIComponent(tip)}`}
                  className="px-3 py-1 rounded-full text-xs bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-yebone-primary/40 transition-colors"
                >
                  {tip}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div>
          <SectionTitle title="Recently viewed" subtitle="Pick up where you left off" />
          <MarketplaceCardGrid className="mt-4">
            {deprioritizeDemoCatalog(recentlyViewed)
              .slice(0, 4)
              .map((item) => {
                const product = (allProducts || []).find((p) => p._id === item._id) || item;
                return (
                  <MarketplaceCardSlot key={item._id}>
                    <ProductCard data={product} />
                  </MarketplaceCardSlot>
                );
              })}
          </MarketplaceCardGrid>
        </div>
      )}

      {trending.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineTrendingUp className="text-yebone-primary" size={22} />
            <SectionTitle title="Trending products" subtitle="Popular across Yebone right now" align="left" className="mb-0" />
          </div>
          <MarketplaceCardGrid className="mt-4">
            {trending.map((product) => (
              <MarketplaceCardSlot key={product._id}>
                <ProductCard data={product} />
              </MarketplaceCardSlot>
            ))}
          </MarketplaceCardGrid>
        </div>
      )}

      {nearby.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <HiOutlineLocationMarker className="text-yebone-primary" size={22} />
            <SectionTitle title="Popular nearby" subtitle="Discover sellers in your region" align="left" className="mb-0" />
          </div>
          <MarketplaceCardGrid className="mt-4">
            {nearby.map((product) => (
              <MarketplaceCardSlot key={product._id}>
                <ProductCard data={product} />
              </MarketplaceCardSlot>
            ))}
          </MarketplaceCardGrid>
        </div>
      )}

      <div className="text-center sm:text-left">
        <Link to="/products" className="text-sm font-semibold text-yebone-primary hover:underline">
          Explore all products →
        </Link>
      </div>
    </section>
  );
};

export default MarketplaceAISection;
