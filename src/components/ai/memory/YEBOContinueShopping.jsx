import React from "react";
import { HiOutlineArrowRight, HiOutlineShoppingBag } from "react-icons/hi";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import AICard from "../primitives/AICard";

/** Continue shopping card from session memory */
const YEBOContinueShopping = ({ className }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const snap = yeboMemory?.getSnapshot?.();
  const goal = snap?.session?.shoppingGoal;
  const recent = snap?.search?.recent?.[0];

  if (!goal && !recent) return null;

  return (
    <AICard className={className} glass padding="sm">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-yebone-gold/15 flex items-center justify-center shrink-0">
          <HiOutlineShoppingBag className="text-yebone-gold" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-sm dark:text-white">Continue shopping</p>
          <p className="text-xs text-gray-500 mt-1">
            {goal?.label || `Resume "${recent}"`}
          </p>
          {goal?.progress != null && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div
                  className="h-full bg-yebone-primary rounded-full transition-all"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
              <span className="text-[10px] font-semibold text-yebone-primary">{goal.progress}%</span>
            </div>
          )}
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-yebone-primary mt-2">
            Continue <HiOutlineArrowRight size={12} />
          </span>
        </div>
      </div>
    </AICard>
  );
};

export default YEBOContinueShopping;
