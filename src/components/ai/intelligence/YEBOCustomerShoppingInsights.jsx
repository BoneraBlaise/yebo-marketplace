import React from "react";
import { CUSTOMER_SHOPPING_INSIGHTS } from "../../../ai/intelligence/yipMockData";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import { HiOutlineSparkles, HiOutlineChartBar, HiOutlineCurrencyDollar, HiOutlineTag, HiOutlineEye } from "react-icons/hi";

const ICONS = {
  categories: HiOutlineTag,
  habits: HiOutlineChartBar,
  spending: HiOutlineCurrencyDollar,
  viewed: HiOutlineEye,
  explored: HiOutlineEye,
  recs: HiOutlineSparkles,
};

const YEBOCustomerShoppingInsights = () => (
  <AISection
    id="customer-yebo"
    title="YEBO shopping insights"
    subtitle="Habits, spending, and recommendations — session placeholders via YIP."
    compact
    contained={false}
    className="py-0"
    badge="Your YEBO"
  >
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {CUSTOMER_SHOPPING_INSIGHTS.map(({ id, title, value }) => {
        const Icon = ICONS[id] || HiOutlineSparkles;
        return <AIInsightCard key={id} title={title} value={value} icon={Icon} />;
      })}
    </div>
  </AISection>
);

export default YEBOCustomerShoppingInsights;
