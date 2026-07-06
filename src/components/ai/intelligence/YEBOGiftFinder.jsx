import React from "react";
import { GIFT_CATEGORIES } from "../../../ai/intelligence/yipMockData";
import AICard from "../primitives/AICard";
import AILoading from "../primitives/AILoading";

const formatPrice = (n) => (n ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const YEBOGiftFinder = ({ onSelect, results, loading }) => (
  <div className="space-y-3 yebone-fade-up">
    <p className="text-xs font-semibold text-yebone-primary">YEBO Gift Finder</p>
    <div className="flex flex-wrap gap-2">
      {GIFT_CATEGORIES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className="ai-prompt-chip text-[11px]"
          onClick={() => onSelect?.(id)}
        >
          {label}
        </button>
      ))}
    </div>

    {loading && <AILoading label="Finding gifts..." variant="dots" />}

    {results && !loading && (
      <AICard padding="sm" glass>
        <p className="font-semibold text-sm dark:text-white mb-1">{results.category}</p>
        <p className="text-[11px] text-gray-500 mb-3">{results.message}</p>
        <div className="space-y-2">
          {results.picks?.map((pick) => (
            <div key={pick.name} className="flex justify-between text-xs">
              <span className="dark:text-gray-200">{pick.name}</span>
              <span className="font-semibold text-yebone-primary">
                RWF {formatPrice(pick.price)} · {pick.confidence}%
              </span>
            </div>
          ))}
        </div>
      </AICard>
    )}
  </div>
);

export default YEBOGiftFinder;
