import React from "react";
import {
  HiOutlineTrendingUp,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineChartBar,
  HiOutlineClock,
} from "react-icons/hi";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import { VENDOR_AI_INSIGHTS } from "../data/aiPlaceholders";

const ICONS = {
  trending: HiOutlineTrendingUp,
  restock: HiOutlineCube,
  pricing: HiOutlineCurrencyDollar,
  demand: HiOutlineChartBar,
  selling: HiOutlineClock,
};

const VendorAIInsights = () => (
  <section id="vendor-ai" className="scroll-mt-24 yebone-fade-up">
    <AISection
      title="AI business insights"
      subtitle="Trending products, restock tips, and demand predictions — presentation only."
      compact
      contained={false}
      className="py-0"
      badge="Seller AI"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 lg:gap-4">
        {VENDOR_AI_INSIGHTS.map(({ id, title, value, metric }) => {
          const Icon = ICONS[id] || HiOutlineTrendingUp;
          return (
            <AIInsightCard key={id} title={title} value={value} metric={metric} icon={Icon} />
          );
        })}
      </div>
    </AISection>
  </section>
);

export default VendorAIInsights;
