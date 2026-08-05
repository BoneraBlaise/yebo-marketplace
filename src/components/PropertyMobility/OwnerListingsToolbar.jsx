import React from "react";
import {
  HiOutlineSearch,
  HiOutlineViewGrid,
  HiOutlineViewList,
} from "react-icons/hi";
import { LISTING_CATEGORIES } from "./propertyMobilityHelpers";
import "./property-mobility-ui.css";

const STATUS_OPTIONS = [
  { value: "", label: "All statuses" },
  { value: "pending_review", label: "Pending Review" },
  { value: "published", label: "Live" },
  { value: "rejected", label: "Rejected" },
  { value: "paused", label: "Paused" },
  { value: "draft", label: "Draft" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "price_asc", label: "Price: low to high" },
  { value: "price_desc", label: "Price: high to low" },
  { value: "title", label: "Title A–Z" },
];

const OwnerListingsToolbar = ({
  query,
  category,
  status,
  sort,
  viewMode,
  onQueryChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onViewModeChange,
  onCreate,
  resultCount,
}) => (
  <section className="pm-owner-toolbar pm-owner-toolbar--sticky" aria-label="Filter your listings">
    <div className="pm-owner-toolbar__head">
      <div>
        <h2 className="pm-owner-toolbar__title">My Listings</h2>
        <p className="pm-owner-toolbar__subtitle">
          {typeof resultCount === "number"
            ? `${resultCount} listing${resultCount === 1 ? "" : "s"}`
            : "Search and manage your property & vehicle listings."}
        </p>
      </div>
      <button type="button" className="pm-owner-toolbar__create" onClick={onCreate}>
        Create Listing
      </button>
    </div>

    <div className="pm-owner-toolbar__filters">
      <label className="pm-owner-toolbar__search">
        <HiOutlineSearch aria-hidden="true" />
        <input
          type="search"
          placeholder="Search..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search my listings"
        />
      </label>
      <select
        className="pm-owner-toolbar__select"
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {LISTING_CATEGORIES.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <select
        className="pm-owner-toolbar__select"
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        aria-label="Filter by status"
      >
        {STATUS_OPTIONS.map((item) => (
          <option key={item.value || "all"} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <select
        className="pm-owner-toolbar__select"
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        aria-label="Sort listings"
      >
        {SORT_OPTIONS.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <div className="pm-owner-toolbar__view-toggle" role="group" aria-label="View mode">
        <button
          type="button"
          className={viewMode === "grid" ? "is-active" : ""}
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          onClick={() => onViewModeChange("grid")}
        >
          <HiOutlineViewGrid size={18} />
        </button>
        <button
          type="button"
          className={viewMode === "list" ? "is-active" : ""}
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          onClick={() => onViewModeChange("list")}
        >
          <HiOutlineViewList size={18} />
        </button>
      </div>
    </div>
  </section>
);

export default OwnerListingsToolbar;
