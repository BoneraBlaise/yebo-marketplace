import React from "react";
import { VENDOR_SHOPPING_INSIGHTS } from "../../../ai/intelligence/yipMockData";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import { HiOutlineTrendingUp, HiOutlineSearch, HiOutlineCube } from "react-icons/hi";

const ICONS = {
  "trending-searches": HiOutlineSearch,
  compare: HiOutlineTrendingUp,
  bundled: HiOutlineCube,
  interests: HiOutlineTrendingUp,
  restock: HiOutlineCube,
};

const YEBOVendorShoppingInsights = () => (
  <section id="vendor-yebo" className="scroll-mt-24 yebone-fade-up">
    <AISection
      title="YEBO business insights"
      subtitle="Trending searches, bundles, and restock opportunities — mock via YIP."
      compact
      contained={false}
      className="py-0"
      badge="Seller YEBO"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
        {VENDOR_SHOPPING_INSIGHTS.map(({ id, title, value, metric }) => {
          const Icon = ICONS[id] || HiOutlineTrendingUp;
          return <AIInsightCard key={id} title={title} value={value} metric={metric} icon={Icon} />;
        })}
      </div>
    </AISection>
  </section>
);

export default YEBOVendorShoppingInsights;
