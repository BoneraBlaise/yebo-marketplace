import React from "react";
import { HiOutlineTag, HiOutlineColorSwatch, HiOutlineCurrencyDollar } from "react-icons/hi";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import AIInsightCard from "../primitives/AIInsightCard";

/** Preference cards from YEBO memory */
const YEBOPreferenceCards = ({ className }) => {
  const yeboMemory = useYEBOMemoryOptional();
  const prefs = yeboMemory?.getSnapshot?.()?.preferences || {};

  const cards = [
    {
      title: "Favorite categories",
      value: (prefs.favoriteCategories || []).slice(0, 3).join(", ") || "—",
      icon: HiOutlineTag,
    },
    {
      title: "Favorite brands",
      value: (prefs.favoriteBrands || []).slice(0, 3).join(", ") || "—",
      icon: HiOutlineColorSwatch,
    },
    {
      title: "Budget range",
      value: prefs.budgetRange
        ? `${prefs.budgetRange.min?.toLocaleString()} – ${prefs.budgetRange.max?.toLocaleString()} ${prefs.budgetRange.currency || "RWF"}`
        : "—",
      icon: HiOutlineCurrencyDollar,
    },
  ];

  return (
    <div className={`grid sm:grid-cols-3 gap-3 ${className || ""}`}>
      {cards.map((c) => (
        <AIInsightCard key={c.title} title={c.title} value={c.value} icon={c.icon} />
      ))}
    </div>
  );
};

export default YEBOPreferenceCards;
