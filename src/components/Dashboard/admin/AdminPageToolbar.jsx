import React from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";

const AdminPageToolbar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  actions,
}) => (
  <div className="admin-toolbar flex flex-col sm:flex-row gap-3 mb-6">
    {onSearchChange && (
      <div className="relative flex-1 max-w-md">
        <HiOutlineSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="admin-search-input w-full pl-10 pr-4 py-2.5 rounded-xl yebone-surface text-sm dark:text-white"
        />
      </div>
    )}
    <div className="flex flex-wrap items-center gap-2">
      {filters}
      {filters && (
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400 px-2">
          <HiOutlineFilter size={14} /> Filters
        </span>
      )}
      {actions}
    </div>
  </div>
);

export default AdminPageToolbar;
