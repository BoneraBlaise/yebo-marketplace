import React from "react";
import {
  HiOutlineSparkles,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineTag,
  HiOutlineLightBulb,
} from "react-icons/hi";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import { CUSTOMER_AI_INSIGHTS } from "../data/aiPlaceholders";

const ICONS = {
  sparkles: HiOutlineSparkles,
  chart: HiOutlineChartBar,
  wallet: HiOutlineCurrencyDollar,
  tag: HiOutlineTag,
  lightbulb: HiOutlineLightBulb,
};

const CustomerAIInsights = () => (
  <AISection
    id="customer-ai"
    title="AI insights"
    subtitle="Personalized shopping intelligence — ready for future AI backend."
    compact
    contained={false}
    className="py-0"
    badge="Your AI"
  >
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {CUSTOMER_AI_INSIGHTS.map(({ id, title, value, icon }) => {
        const Icon = ICONS[icon] || HiOutlineSparkles;
        return <AIInsightCard key={id} title={title} value={value} icon={Icon} />;
      })}
    </div>
  </AISection>
);

export default CustomerAIInsights;
