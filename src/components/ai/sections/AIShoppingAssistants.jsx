import React from "react";
import {
  HiOutlineCurrencyDollar,
  HiOutlineGift,
  HiOutlineScale,
  HiOutlineColorSwatch,
  HiOutlineStar,
  HiOutlineTrendingUp,
} from "react-icons/hi";
import AISection from "../primitives/AISection";
import AICard from "../primitives/AICard";
import { SHOPPING_ASSISTANTS } from "../data/aiPlaceholders";

const ICONS = {
  budget: HiOutlineCurrencyDollar,
  gift: HiOutlineGift,
  size: HiOutlineScale,
  style: HiOutlineColorSwatch,
  best: HiOutlineStar,
  trending: HiOutlineTrendingUp,
};

const AIShoppingAssistants = ({ compact = false, contained = false }) => (
  <AISection
    title="Shopping Assistant"
    subtitle="Reusable AI helper cards — presentation placeholders ready for future integration."
    compact={compact}
    contained={!contained}
    className={contained ? "py-0" : undefined}
    badge="Assistant"
  >
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
      {SHOPPING_ASSISTANTS.map(({ id, title, description, tag }) => {
        const Icon = ICONS[id] || HiOutlineStar;
        return (
          <AICard key={id} padding="sm" className="home-surface-card cursor-default">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yebone-primary to-yebone-primary-dark flex items-center justify-center">
                <Icon className="text-white" size={20} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-yebone-primary">
                {tag}
              </span>
            </div>
            <h3 className="font-Poppins font-semibold text-sm dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
          </AICard>
        );
      })}
    </div>
  </AISection>
);

export default AIShoppingAssistants;
