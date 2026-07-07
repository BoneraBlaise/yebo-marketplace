import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles, HiOutlineLocationMarker, HiOutlineTrendingUp } from "react-icons/hi";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { SectionTitle } from "../ui";
import HomeProductCard from "../Home/HomeProductCard";
import { MarketplaceCardGrid, MarketplaceCardSlot } from "./cards";

const MarketplaceAISection = ({ searchTerm }) => {
  const { allProducts } = useSelector((state) => state.products);

  const recentlyViewed = (() => {
    try {
      return JSON.parse(Cookies.get("recentlyViewed") || "[]");
    } catch {
      return [];
    }
  })();

  const trending = (allProducts || []).slice(0, 4);
  const nearby = (allProducts || []).slice(4, 8);
  const sellers = [
    { name: "Verified sellers near you", confidence: 92, tag: "Popular nearby" },
    { name: "Top-rated this week", confidence: 88, tag: "Trending" },
    { name: "Based on your browsing", confidence: 76, tag: "AI suggestion" },
  ];

  const suggestions = searchTerm
    ? [`${searchTerm} deals`, `${searchTerm} wholesale`, `best ${searchTerm}`]
    : ["Electronics deals", "Fashion picks", "Home essentials"];

  return (
    <section className="mt-12 lg:mt-16 space-y-10 yebone-fade-up" aria-label="AI marketplace suggestions">
      <div className="marketplace-ai-card">
        <div className="flex items-start gap-3">
          <HiOutlineSparkles className="text-yebone-gold shrink-0 mt-0.5" size={22} />
          <div>
            <p className="font-semibold text-yebone-primary dark:text-yebone-gold text-sm">
              YEBO — presentation preview
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Smart recommendations powered by your browsing. Full AI backend coming soon.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {suggestions.map((tip) => (
                <span
                  key={tip}
                  className="px-3 py-1 rounded-full text-xs bg-white/70 dark:bg-white/5 border border-gray-200/80 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <div>
          <SectionTitle title="Recently viewed" subtitle="Pick up where you left off" />
          <MarketplaceCardGrid className="mt-4">
            {recentlyViewed.slice(0, 4).map((item) => {
              const product = (allProducts || []).find((p) => p._id === item._id) || item;
              return (
                <MarketplaceCardSlot key={item._id}>
                  <HomeProductCard data={product} compact fluid />
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
                <HomeProductCard data={product} compact fluid />
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
                <HomeProductCard data={product} compact fluid />
              </MarketplaceCardSlot>
            ))}
          </MarketplaceCardGrid>
        </div>
      )}

      <div>
        <SectionTitle title="Recommended sellers" subtitle="Trust indicators & AI confidence" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sellers.map((seller) => (
            <div
              key={seller.tag}
              className="yebone-surface rounded-2xl p-4 yebone-card-lift"
            >
              <span className="text-[10px] uppercase tracking-wide font-semibold text-yebone-primary">
                {seller.tag}
              </span>
              <p className="font-medium mt-1 dark:text-white">{seller.name}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-yebone-primary"
                    style={{ width: `${seller.confidence}%` }}
                  />
                </div>
                <span className="text-xs font-semibold text-yebone-primary">
                  {seller.confidence}%
                </span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          <Link to="/products" className="text-yebone-primary hover:underline">
            Explore all sellers
          </Link>
          {" · "}Placeholder data — no AI backend connected.
        </p>
      </div>
    </section>
  );
};

export default MarketplaceAISection;
