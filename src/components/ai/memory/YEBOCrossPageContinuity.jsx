import React from "react";
import { HiOutlineLightBulb } from "react-icons/hi";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { MOCK_CROSS_PAGE_MESSAGES } from "../../../ai/memory/yebMemoryMockData";

/** Cross-page continuity messages from session memory */
const YEBOCrossPageContinuity = ({ limit = 2, className, onAction }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const snap = yeboMemory?.getSnapshot?.();
  const messages =
    snap?.visualization?.crossPage?.length > 0
      ? snap.visualization.crossPage
      : MOCK_CROSS_PAGE_MESSAGES;

  const items = messages.slice(0, limit);
  if (!items.length) return null;

  return (
    <div className={`space-y-2 ${className || ""}`}>
      {items.map((msg) => (
        <div
          key={msg.id}
          className="yebone-glass rounded-lg border border-gray-100 dark:border-gray-800 px-3 py-2.5 flex items-start gap-2 yebone-fade-up"
        >
          <HiOutlineLightBulb className="text-yebone-gold shrink-0 mt-0.5" size={14} />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] dark:text-gray-200">{msg.message}</p>
            {msg.action && (
              <button
                type="button"
                onClick={() => onAction?.(msg)}
                className="text-[10px] font-semibold text-yebone-primary hover:underline mt-1"
              >
                {msg.action} →
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default YEBOCrossPageContinuity;
