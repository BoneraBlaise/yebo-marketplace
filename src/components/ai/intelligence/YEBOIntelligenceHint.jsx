import React from "react";
import { HiOutlineChartBar } from "react-icons/hi";
import { useRankedRecommendations, useIntelligenceRecommendationReason } from "../../../ai/hooks/useIntelligence";
import AICard from "../primitives/AICard";

/** Ranked intelligence output for existing surfaces — no UI redesign */
const YEBOIntelligenceHint = ({ scope = "homepage", className, compact = false }) => {
  const ranked = useRankedRecommendations(scope);
  const top = ranked[0];
  const reasonDetail = useIntelligenceRecommendationReason(top?.id);

  if (!top) return null;

  const why = reasonDetail?.explainability?.whyThis || reasonDetail?.reason;

  if (compact) {
    return (
      <p className={`text-[11px] text-gray-500 ${className || ""}`}>
        <span className="font-semibold text-yebone-gold">Intelligence:</span> #{top.rank} {top.title}
        {why && <span className="block mt-0.5 italic">{why}</span>}
      </p>
    );
  }

  return (
    <AICard className={className} padding="sm">
      <div className="flex items-start gap-2">
        <HiOutlineChartBar className="text-yebone-primary shrink-0 mt-0.5" size={16} />
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-yebone-gold mb-1">
            Ranked intelligence · #{top.rank}
          </p>
          <p className="text-xs font-semibold dark:text-white">{top.title}</p>
          {why && <p className="text-[10px] text-gray-500 mt-1 italic">{why}</p>}
          <div className="flex gap-3 mt-2 text-[10px]">
            <span className="text-yebone-primary font-semibold">Score {top.score}%</span>
            <span className="text-gray-500">Confidence {top.confidence}%</span>
          </div>
        </div>
      </div>
    </AICard>
  );
};

export default YEBOIntelligenceHint;
