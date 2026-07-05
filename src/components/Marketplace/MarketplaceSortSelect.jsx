import React from "react";
import { HiOutlineAdjustmentsHorizontal } from "react-icons/hi2";

const MarketplaceSortSelect = ({
  value,
  onChange,
  options = [],
  placeholder = "Sort by",
  className = "",
}) => (
  <div className={`relative inline-flex items-center gap-2 ${className}`}>
    <HiOutlineAdjustmentsHorizontal
      className="hidden sm:block text-yebone-primary shrink-0"
      size={18}
      aria-hidden="true"
    />
    <select
      value={value}
      onChange={onChange}
      className="marketplace-sort-select dark:text-gray-200"
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

export default MarketplaceSortSelect;
