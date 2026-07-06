import React from "react";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { MOCK_RECOMMENDATION_HISTORY } from "../../../ai/memory/yebMemoryMockData";
import AICard from "../primitives/AICard";

/** Recommendation & browsing history cards */
const YEBOShoppingHistory = ({ className }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const snap = yeboMemory?.getSnapshot?.();
  const viewed = snap?.recentlyViewed?.slice(0, 4) || snap?.session?.visitedProducts?.slice(0, 4) || [];
  const recs = snap?.recommendations?.history || MOCK_RECOMMENDATION_HISTORY;

  return (
    <div className={`grid lg:grid-cols-2 gap-4 ${className || ""}`}>
      <AICard padding="sm">
        <p className="font-semibold text-sm dark:text-white mb-3">Recently viewed</p>
        <ul className="space-y-2">
          {viewed.map((p) => (
            <li key={p.id} className="text-xs dark:text-gray-200 flex justify-between gap-2">
              <span className="truncate">{p.name}</span>
              {p.price && (
                <span className="text-gray-500 shrink-0 tabular-nums">
                  RWF {p.price?.toLocaleString?.()}
                </span>
              )}
            </li>
          ))}
        </ul>
      </AICard>
      <AICard padding="sm">
        <p className="font-semibold text-sm dark:text-white mb-3">Recommendation history</p>
        <ul className="space-y-2">
          {recs.map((r) => (
            <li key={r.id} className="text-xs">
              <span className="font-medium dark:text-white">{r.product}</span>
              <span className="text-gray-500 block text-[11px]">{r.reason}</span>
            </li>
          ))}
        </ul>
      </AICard>
    </div>
  );
};

export default YEBOShoppingHistory;
