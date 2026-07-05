import React from "react";

const MarketplaceActiveFilters = ({ filters = [], onRemove, onClearAll }) => (
  <div className="w-full py-3 border-b border-gray-100 dark:border-gray-800">
    <div className="flex flex-wrap gap-2 items-center">
      {filters.length > 0 ? (
        <>
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-1">Active filters</span>
          {filters.map((filter, index) => (
            <span key={`${filter.type}-${index}`} className="marketplace-filter-chip">
              {filter.label}
              <button
                type="button"
                onClick={() => onRemove(filter.type, filter.value)}
                aria-label={`Remove ${filter.label}`}
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 font-medium ml-1"
          >
            Clear all
          </button>
        </>
      ) : (
        <span className="text-sm text-gray-500 dark:text-gray-400">No active filters</span>
      )}
    </div>
  </div>
);

export default MarketplaceActiveFilters;
