import React from "react";
import { HiOutlineLightBulb } from "react-icons/hi";

const YEBOProactiveBanner = ({ suggestions = [], onAction, className }) => {
  if (!suggestions.length) return null;
  const tip = suggestions[0];

  return (
    <div
      className={`yebone-glass rounded-xl border border-yebone-gold/25 p-3 yebone-fade-up ${className || ""}`}
      role="status"
    >
      <div className="flex items-start gap-2">
        <HiOutlineLightBulb className="text-yebone-gold shrink-0 mt-0.5" size={18} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold dark:text-white">{tip.message}</p>
          {tip.action && (
            <button
              type="button"
              onClick={() => onAction?.(tip)}
              className="text-[11px] font-semibold text-yebone-primary hover:underline mt-1"
            >
              {tip.action} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default YEBOProactiveBanner;
