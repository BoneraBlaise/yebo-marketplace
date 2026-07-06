import React from "react";
import {
  HiOutlineBell,
  HiOutlineEye,
  HiOutlineSwitchHorizontal,
  HiOutlineTag,
  HiOutlineTrendingDown,
  HiOutlineExclamation,
} from "react-icons/hi";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { MOCK_SMART_REMINDERS } from "../../../ai/memory/yebMemoryMockData";
import AICard from "../primitives/AICard";

const ICONS = {
  continue: HiOutlineBell,
  viewed: HiOutlineEye,
  compare: HiOutlineSwitchHorizontal,
  available: HiOutlineTag,
  price: HiOutlineTrendingDown,
  stock: HiOutlineExclamation,
};

/** Smart reminder cards — session placeholders */
const YEBOSmartReminders = ({ limit = 3, compact = false, className }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const snap = yeboMemory?.getSnapshot?.();
  const reminders = snap?.shopping?.reminders?.length
    ? snap.shopping.reminders
    : MOCK_SMART_REMINDERS;

  const items = reminders.slice(0, limit);
  if (!items.length) return null;

  if (compact) {
    const tip = items[0];
    const Icon = ICONS[tip.type] || HiOutlineBell;
    return (
      <AICard className={className} padding="sm">
        <div className="flex items-start gap-2">
          <Icon className="text-yebone-gold shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-xs font-semibold dark:text-white">{tip.title}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{tip.message}</p>
          </div>
        </div>
      </AICard>
    );
  }

  return (
    <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-3 ${className || ""}`}>
      {items.map((item) => {
        const Icon = ICONS[item.type] || HiOutlineBell;
        return (
          <AICard key={item.id} padding="sm" className="yebone-fade-up">
            <div className="flex items-start gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-yebone-primary/10 flex items-center justify-center shrink-0">
                <Icon className="text-yebone-primary" size={14} />
              </div>
              <p className="text-xs font-semibold dark:text-white">{item.title}</p>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{item.message}</p>
            {item.action && (
              <button type="button" className="text-[11px] font-semibold text-yebone-primary mt-2 hover:underline">
                {item.action} →
              </button>
            )}
          </AICard>
        );
      })}
    </div>
  );
};

export default YEBOSmartReminders;
