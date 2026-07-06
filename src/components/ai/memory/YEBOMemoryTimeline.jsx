import React from "react";
import {
  HiOutlineEye,
  HiOutlineSearch,
  HiOutlineSwitchHorizontal,
  HiOutlineOfficeBuilding,
  HiOutlineChat,
} from "react-icons/hi";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { MOCK_SHOPPING_TIMELINE } from "../../../ai/memory/yebMemoryMockData";
import AICard from "../primitives/AICard";

const ICONS = {
  eye: HiOutlineEye,
  search: HiOutlineSearch,
  compare: HiOutlineSwitchHorizontal,
  store: HiOutlineOfficeBuilding,
  chat: HiOutlineChat,
};

/** Shopping timeline visualization */
const YEBOMemoryTimeline = ({ className }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const snap = yeboMemory?.getSnapshot?.();
  const timeline = snap?.visualization?.timeline || MOCK_SHOPPING_TIMELINE;

  return (
    <AICard className={className} padding="sm">
      <p className="font-semibold text-sm dark:text-white mb-3">Shopping timeline</p>
      <ol className="space-y-3">
        {timeline.map((entry, i) => {
          const Icon = ICONS[entry.icon] || HiOutlineEye;
          return (
            <li key={entry.id} className="flex items-start gap-3">
              <div className="relative flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-yebone-primary/10 flex items-center justify-center shrink-0">
                  <Icon className="text-yebone-primary" size={12} />
                </div>
                {i < timeline.length - 1 && (
                  <div className="w-px h-full min-h-[12px] bg-gray-200 dark:bg-gray-700 mt-1" />
                )}
              </div>
              <div className="pb-1 min-w-0">
                <p className="text-xs font-medium dark:text-white">{entry.label}</p>
                <p className="text-[10px] text-gray-500">{entry.time}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </AICard>
  );
};

export default YEBOMemoryTimeline;
