import React from "react";
import { useSelector } from "react-redux";
import { HiOutlineSparkles } from "react-icons/hi";
import { Container, SectionTitle, Badge } from "../ui";
import AIInsightCard from "../ai/primitives/AIInsightCard";
import AIVirtualTryOn from "../ai/sections/AIVirtualTryOn";
import YEBOProductIntelligenceExtras from "../ai/intelligence/YEBOProductIntelligenceExtras";
import YEBOProactiveBanner from "../ai/intelligence/YEBOProactiveBanner";
import { YEBOCrossPageContinuity, YEBOSmartReminders } from "../ai/memory";
import { PROACTIVE_SUGGESTIONS } from "../../ai/intelligence/yipMockData";
import HomeProductCard from "../Home/HomeProductCard";
import { PRODUCT_AI_SECTIONS } from "../ai/data/aiPlaceholders";

const AI_INSIGHTS = [
  { label: "Recommended Size", value: "Best fit for this category", icon: "✓" },
  { label: "Recommended Color", value: "Matches trending palettes", icon: "✓" },
  { label: "Matching Outfit", value: "Pairs with accessories", icon: "✓" },
  { label: "Similar Style", value: "Curated alternatives", icon: "✓" },
];

const AI_METRICS = [
  { label: "Match Score", value: "94%", highlight: true },
  { label: "Region Popularity", value: "High in East Africa" },
  { label: "Trend", value: "Rising" },
  { label: "Confidence", value: "87%" },
];

const ProductAIRail = ({ title, products }) => {
  if (!products?.length) return null;
  return (
    <div className="mb-8">
      <p className="font-Poppins font-semibold text-sm lg:text-base mb-3 dark:text-white">{title}</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {products.slice(0, 4).map((product) => (
          <div key={product._id} className="flex justify-center">
            <HomeProductCard data={product} compact />
          </div>
        ))}
      </div>
    </div>
  );
};

const ProductAISections = ({ category }) => {
  const { allProducts } = useSelector((state) => state.products);
  const pool = allProducts || [];
  const similar = pool.slice(0, PRODUCT_AI_SECTIONS.similar.count);
  const alternatives = pool.slice(4, 4 + PRODUCT_AI_SECTIONS.alternatives.count);
  const boughtTogether = pool.slice(8, 8 + PRODUCT_AI_SECTIONS.boughtTogether.count);
  const accessories = pool.slice(12, 12 + PRODUCT_AI_SECTIONS.accessories.count);

  return (
    <>
      <section className="pdp-section bg-gradient-to-b from-yebone-light-gray/50 to-transparent dark:from-gray-900/30">
        <Container>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="gold">AI Powered</Badge>
            <span className="text-xs font-semibold text-yebone-primary uppercase tracking-wider flex items-center gap-1">
              <HiOutlineSparkles size={14} />
              YEBO
            </span>
          </div>
          <SectionTitle
            title="YEBO Shopping Intelligence"
            subtitle="Why YEBO recommends this product — mock intelligence powered by YIP."
            align="left"
          />

          <YEBOProactiveBanner suggestions={PROACTIVE_SUGGESTIONS} className="mb-5" />
          <YEBOCrossPageContinuity className="mb-4" limit={2} />
          <YEBOSmartReminders compact className="mb-5" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-5">
            {AI_INSIGHTS.map((item) => (
              <div
                key={item.label}
                className="yebone-card-lift yebone-glass rounded-2xl border border-gray-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/90 p-4 lg:p-5"
              >
                <span className="text-yebone-gold text-base font-bold">{item.icon}</span>
                <p className="font-Poppins font-semibold text-xs lg:text-sm mt-2 dark:text-white leading-snug">
                  {item.label}
                </p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4 lg:gap-5 mb-8">
            <div className="lg:col-span-2 yebone-surface rounded-3xl p-6 lg:p-8">
              <p className="text-sm font-semibold text-yebone-primary mb-2 flex items-center gap-1">
                <HiOutlineSparkles size={16} /> Why YEBO recommends this
              </p>
              <p className="font-Poppins text-lg font-semibold dark:text-white mb-3">
                Strong recommendation for {category || "marketplace"} shoppers
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                {category
                  ? `YEBO surfaces this ${category} item based on seller trust, competitive pricing, and buyer satisfaction patterns across Africa.`
                  : "YEBO surfaces this item based on seller trust, competitive pricing, and buyer satisfaction patterns."}
              </p>
              <AIInsightCard
                title="Confidence explanation"
                value="87% match based on category trends, price competitiveness, and regional popularity."
                subtitle="Full AI scoring connects when backend is ready."
                confidence={87}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {AI_METRICS.map(({ label, value, highlight }) => (
                <div
                  key={label}
                  className={`rounded-2xl p-4 border text-center lg:text-left ${
                    highlight
                      ? "bg-gradient-to-br from-yebone-primary to-yebone-primary-dark text-white border-transparent shadow-lg"
                      : "yebone-glass border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80"
                  }`}
                >
                  <p className={`text-[10px] uppercase tracking-wider mb-1 ${highlight ? "text-white/70" : "text-gray-500"}`}>
                    {label}
                  </p>
                  <p className={`font-Poppins font-bold text-lg ${highlight ? "text-yebone-gold" : "dark:text-white"}`}>
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <ProductAIRail title={PRODUCT_AI_SECTIONS.similar.title} products={similar} />
          <ProductAIRail title="Better alternatives" products={alternatives} />
          <ProductAIRail title={PRODUCT_AI_SECTIONS.boughtTogether.title} products={boughtTogether} />
          <ProductAIRail title={PRODUCT_AI_SECTIONS.accessories.title} products={accessories} />

          <YEBOProductIntelligenceExtras category={category} />
        </Container>
      </section>

      <Container>
        <AIVirtualTryOn compact />
      </Container>
    </>
  );
};

export default ProductAISections;
