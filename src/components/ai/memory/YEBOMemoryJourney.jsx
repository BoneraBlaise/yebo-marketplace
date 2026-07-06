import React from "react";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { MOCK_SHOPPING_JOURNEY } from "../../../ai/memory/yebMemoryMockData";
import AICard from "../primitives/AICard";
import classNames from "classnames";

/** Shopping journey step visualization */
const YEBOMemoryJourney = ({ className }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const snap = yeboMemory?.getSnapshot?.();
  const journey = snap?.dashboards?.customer?.journey || MOCK_SHOPPING_JOURNEY;

  return (
    <AICard className={className} padding="sm">
      <p className="font-semibold text-sm dark:text-white mb-4">Shopping journey</p>
      <div className="space-y-3">
        {journey.map((step) => (
          <div key={step.step} className="flex items-start gap-3">
            <div
              className={classNames(
                "w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0",
                step.status === "complete" && "bg-yebone-primary text-white",
                step.status === "active" && "bg-yebone-gold/20 text-yebone-gold ring-2 ring-yebone-gold/40",
                step.status === "upcoming" && "bg-gray-100 dark:bg-gray-800 text-gray-400"
              )}
            >
              {step.step}
            </div>
            <div>
              <p className="text-xs font-semibold dark:text-white">{step.title}</p>
              <p className="text-[11px] text-gray-500">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </AICard>
  );
};

export default YEBOMemoryJourney;
