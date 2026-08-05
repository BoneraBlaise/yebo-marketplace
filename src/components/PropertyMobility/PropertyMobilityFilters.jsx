import React from "react";
import { HiOutlineSearch, HiOutlineLocationMarker } from "react-icons/hi";
import { PROPERTY_CATEGORIES, MOBILITY_CATEGORIES } from "./propertyMobilityHelpers";
import "./property-mobility-ui.css";

const PropertyMobilityFilters = ({
  filters,
  onChange,
  onSubmit,
  onReset,
  categoryOptions,
}) => {
  const set = (key, value) => onChange({ ...filters, [key]: value });

  return (
    <section className="pm-filters" aria-label="Search and filter listings">
      <form className="pm-filters__bar" onSubmit={onSubmit}>
        <label className="pm-filters__field pm-filters__field--grow">
          <HiOutlineSearch className="pm-filters__icon" aria-hidden="true" />
          <input
            type="search"
            className="pm-filters__input"
            placeholder="Search apartments, cars, land…"
            value={filters.q}
            onChange={(e) => set("q", e.target.value)}
            aria-label="Search listings"
          />
        </label>
        <label className="pm-filters__field">
          <HiOutlineLocationMarker className="pm-filters__icon" aria-hidden="true" />
          <input
            type="text"
            className="pm-filters__input"
            placeholder="Location"
            value={filters.location}
            onChange={(e) => set("location", e.target.value)}
            aria-label="Location"
          />
        </label>
        <select
          className="pm-filters__select"
          value={filters.listingType}
          onChange={(e) => set("listingType", e.target.value)}
          aria-label="Listing type"
        >
          <option value="">All types</option>
          <option value="property">Property</option>
          <option value="vehicle">Mobility</option>
        </select>
        <button type="submit" className="pm-filters__submit">
          Search
        </button>
      </form>

      <div className="pm-filters__chips" role="group" aria-label="Categories">
        {categoryOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`pm-filters__chip${filters.category === item.value ? " is-active" : ""}`}
            onClick={() => set("category", filters.category === item.value ? "" : item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="pm-filters__toggles">
        <label className="pm-filters__toggle">
          <input
            type="checkbox"
            checked={filters.verifiedOnly}
            onChange={(e) => set("verifiedOnly", e.target.checked)}
          />
          <span>Verified only</span>
        </label>
        <label className="pm-filters__toggle">
          <input
            type="checkbox"
            checked={filters.featuredOnly}
            onChange={(e) => set("featuredOnly", e.target.checked)}
          />
          <span>Featured only</span>
        </label>
        {onReset ? (
          <button type="button" className="pm-filters__reset-link" onClick={onReset}>
            Reset all
          </button>
        ) : null}
      </div>
    </section>
  );
};

export const DEFAULT_PM_FILTERS = {
  listingType: "",
  category: "",
  verifiedOnly: false,
  featuredOnly: false,
  minPrice: "",
  maxPrice: "",
  location: "",
  q: "",
};

export { PROPERTY_CATEGORIES, MOBILITY_CATEGORIES };

export default PropertyMobilityFilters;
