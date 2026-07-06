import React from "react";
import { SHOPPING_INSIGHT_TYPES } from "../../../ai/intelligence/yipMockData";
import AIInsightCard from "../primitives/AIInsightCard";
import { HiOutlineTrendingUp } from "react-icons/hi";

const YEBOShoppingInsightCards = ({ insights = SHOPPING_INSIGHT_TYPES, compact = false }) => (
  <div className={`grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 ${compact ? "" : "yebone-fade-up"}`}>
    {(insights || SHOPPING_INSIGHT_TYPES).map(({ id, title, value, tag }) => (
      <AIInsightCard
        key={id}
        title={title}
        value={value}
        metric={tag}
        icon={HiOutlineTrendingUp}
      />
    ))}
  </div>
);

export default YEBOShoppingInsightCards;
