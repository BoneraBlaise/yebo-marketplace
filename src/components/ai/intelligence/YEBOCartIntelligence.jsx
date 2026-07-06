import React from "react";
import { CART_INTELLIGENCE_EXTRAS } from "../../../ai/intelligence/yipMockData";
import AICard from "../primitives/AICard";
import { HiOutlineSparkles } from "react-icons/hi";

const YEBOCartIntelligence = ({ compact = true }) => (
  <div className={compact ? "px-4 pb-2" : "mb-6"} aria-label="YEBO cart intelligence">
    <div className="flex items-center gap-2 mb-3">
      <HiOutlineSparkles className="text-yebone-gold shrink-0" size={16} />
      <p className="text-xs font-semibold text-yebone-primary">YEBO cart intelligence</p>
      <span className="text-[10px] text-gray-400 ml-auto">Preview</span>
    </div>
    <div className="space-y-2">
      {CART_INTELLIGENCE_EXTRAS.map(({ id, title, description, savings }) => (
        <AICard key={id} padding="sm" className="!p-3 cursor-default" hover>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold dark:text-white">{title}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{description}</p>
            </div>
            {savings && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-full shrink-0">
                −{savings}
              </span>
            )}
          </div>
        </AICard>
      ))}
    </div>
  </div>
);

export default YEBOCartIntelligence;
