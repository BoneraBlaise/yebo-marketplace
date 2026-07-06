import React from "react";
import YEBOMemoryTimeline from "./YEBOMemoryTimeline";
import YEBOMemoryJourney from "./YEBOMemoryJourney";
import YEBOPreferenceCards from "./YEBOPreferenceCards";
import YEBOShoppingHistory from "./YEBOShoppingHistory";
import { MOCK_SAVED_INTERESTS } from "../../../ai/memory/yebMemoryMockData";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import AIInsightCard from "../primitives/AIInsightCard";
import { HiOutlineSparkles } from "react-icons/hi";

/** Composable memory visualization cards */
const YEBOMemoryCards = ({ variant = "full", className }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const interests = yeboMemory?.getSnapshot?.()?.recommendations?.interests || MOCK_SAVED_INTERESTS;

  if (variant === "compact") {
    return (
      <div className={`grid sm:grid-cols-2 gap-3 ${className || ""}`}>
        <YEBOMemoryTimeline />
        <YEBOSmartRemindersCompact interests={interests} />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      <div className="grid lg:grid-cols-2 gap-4">
        <YEBOMemoryTimeline />
        <YEBOMemoryJourney />
      </div>
      <YEBOPreferenceCards />
      <div className="grid sm:grid-cols-3 gap-3">
        {interests.map((item) => (
          <AIInsightCard
            key={item.id}
            title="Saved interest"
            value={item.label}
            icon={HiOutlineSparkles}
            confidence={item.confidence}
          />
        ))}
      </div>
      <YEBOShoppingHistory />
    </div>
  );
};

const YEBOSmartRemindersCompact = ({ interests }) => (
  <div className="yebone-surface rounded-xl p-4">
    <p className="font-semibold text-sm dark:text-white mb-3">Saved interests</p>
    <ul className="space-y-2">
      {interests.slice(0, 3).map((i) => (
        <li key={i.id} className="text-xs dark:text-gray-200 flex justify-between">
          <span>{i.label}</span>
          <span className="text-yebone-primary font-semibold">{i.confidence}%</span>
        </li>
      ))}
    </ul>
  </div>
);

export default YEBOMemoryCards;
