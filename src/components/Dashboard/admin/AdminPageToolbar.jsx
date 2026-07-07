import React from "react";
import { HiOutlineSearch, HiOutlineFilter } from "react-icons/hi";

const AdminPageToolbar = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search…",
  filters,
  actions,
  searchLabel = "Search records",
}) => (
  <div className="yebone-premium-toolbar admin-toolbar" role="search">
    {onSearchChange && (
      <div className="yebone-premium-search flex-1">
        <HiOutlineSearch size={18} aria-hidden="true" />
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchLabel}
          className="admin-search-input yebone-surface"
        />
      </div>
    )}
    <div className="flex flex-wrap items-center gap-2">
      {filters}
      {filters && (
        <span className="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400 px-2" aria-hidden="true">
          <HiOutlineFilter size={14} /> Filters
        </span>
      )}
      {actions}
    </div>
  </div>
);

export default AdminPageToolbar;
