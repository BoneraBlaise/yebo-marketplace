import React from "react";
import { RiEqualizerLine } from "react-icons/ri";

const MarketplaceMobileFilterButton = ({ open, onToggle, label = "Filters" }) => (
  <div className="block lg:hidden w-full px-4 pb-4">
    <button
      type="button"
      onClick={onToggle}
      className="marketplace-mobile-filter-btn yebone-btn-lift"
      aria-expanded={open}
      aria-controls="marketplace-mobile-filters"
    >
      <RiEqualizerLine size={18} />
      {label}
    </button>
  </div>
);

export default MarketplaceMobileFilterButton;
