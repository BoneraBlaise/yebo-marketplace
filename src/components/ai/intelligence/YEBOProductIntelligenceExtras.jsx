import React from "react";
import { PRODUCT_INTELLIGENCE_EXTRAS } from "../../../ai/intelligence/yipMockData";
import AICard from "../primitives/AICard";
import { HiOutlineSparkles } from "react-icons/hi";

const YEBOProductIntelligenceExtras = ({ category }) => {
  const data = PRODUCT_INTELLIGENCE_EXTRAS;

  return (
    <div className="space-y-4 yebone-fade-up">
      <AICard glass>
        <p className="text-sm font-semibold text-yebone-primary flex items-center gap-1 mb-2">
          <HiOutlineSparkles size={16} /> Things to consider before buying
        </p>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {data.considerations.map((c) => (
            <li key={c}>• {c}</li>
          ))}
        </ul>
      </AICard>

      <div className="grid sm:grid-cols-2 gap-3">
        <AICard padding="sm">
          <p className="text-xs font-semibold text-emerald-600 mb-2">Pros</p>
          <ul className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1">
            {data.pros.map((p) => (
              <li key={p}>+ {p}</li>
            ))}
          </ul>
        </AICard>
        <AICard padding="sm">
          <p className="text-xs font-semibold text-amber-600 mb-2">Cons</p>
          <ul className="text-[11px] text-gray-600 dark:text-gray-400 space-y-1">
            {data.cons.map((c) => (
              <li key={c}>− {c}</li>
            ))}
          </ul>
        </AICard>
      </div>

      <AICard padding="sm" glass>
        <p className="text-xs font-semibold text-yebone-primary mb-1">Buying confidence</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{data.confidenceExplanation}</p>
      </AICard>

      <AICard padding="sm">
        <p className="text-xs font-semibold dark:text-white mb-1">Customers with similar interests bought</p>
        <p className="text-[11px] text-gray-500">{data.similarInterests}</p>
        {category && (
          <p className="text-[10px] text-gray-400 mt-2">Category context: {category}</p>
        )}
      </AICard>
    </div>
  );
};

export default YEBOProductIntelligenceExtras;
