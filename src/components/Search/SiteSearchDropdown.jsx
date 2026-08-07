import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSearch, HiOutlineTrendingUp } from "react-icons/hi";
import { resolveProductDisplayImage } from "../../utils/catalogQuality";
import "./global-marketplace-search.css";

const TYPE_LABELS = {
  product: "Product",
  flashsale: "Flash Sale",
  bid: "Auction",
  property_listing: "Property",
  property_curated: "Property",
  event: "Event",
};

const resolveHref = (item, searchTerm) => {
  switch (item.type) {
    case "property_listing":
      return `/property-mobility/listing/${item._id || item.listingId}`;
    case "property_curated":
      return `/property-mobility?q=${encodeURIComponent(item.query || item.name || searchTerm)}`;
    case "event":
      return `/product/${item._id}?isEvent=true`;
    case "flashsale":
    case "bid":
    default:
      return `/product/${item._id}`;
  }
};

const resolveThumb = (item) => {
  if (item.type === "product" || item.type === "flashsale" || item.type === "bid") {
    return resolveProductDisplayImage(item, "thumb");
  }
  return item.images?.[0]?.url || item.photos?.[0] || item.banner?.url;
};

const resolveMeta = (item) => {
  if (item.type === "property_listing" || item.type === "property_curated") {
    if (item.kind === "vehicle") return "Vehicle";
    if (item.category) return String(item.category).replace(/_/g, " ");
    return "Property";
  }
  if (item.type === "event") return item.location || "Event";
  return item.shop?.name || item.category;
};

const resolveEmoji = (item) => {
  if (item.type === "event") return "🎟️";
  if (item.type === "property_listing" || item.type === "property_curated") return "🏠";
  if (item.type === "bid") return "🔨";
  if (item.type === "flashsale") return "⚡";
  return "🛍️";
};

const SiteSearchDropdown = ({
  searchTerm = "",
  searchData = [],
  recentSearches = [],
  trendingSearches = [],
  showDiscovery = false,
  isLoading = false,
  activeIndex = -1,
  onSelect,
  onQuerySelect,
  setSearchData,
  className = "",
}) => {
  const hasSuggestions = searchData?.length > 0;
  const showPanel = showDiscovery || hasSuggestions || isLoading;
  const trimmed = searchTerm?.trim();
  const showEmptyDiscovery =
    showDiscovery && !trimmed && !recentSearches.length && !trendingSearches.length;

  if (!showPanel) return null;

  let rowIndex = 0;

  return (
    <div className={`home-search-suggest ${className}`.trim()} role="listbox" aria-label="Search suggestions">
      <div className="home-search-suggest__scroll">
        {isLoading ? (
          <div className="home-search-suggest__loading" aria-busy="true">
            <span className="home-search-suggest__spinner" aria-hidden="true" />
            Searching marketplace…
          </div>
        ) : null}

        {showDiscovery && !trimmed ? (
          <>
            {recentSearches.length > 0 ? (
              <>
                <div className="home-search-suggest__section-label">Recent searches</div>
                <div className="home-search-suggest__chip-row">
                  {recentSearches.map((query) => (
                    <button
                      key={`recent-${query}`}
                      type="button"
                      className="home-search-suggest__chip"
                      onClick={() => onQuerySelect?.(query)}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {trendingSearches.length > 0 ? (
              <>
                <div className="home-search-suggest__section-label">
                  <HiOutlineTrendingUp size={14} aria-hidden="true" /> Trending on Yebone
                </div>
                <div className="home-search-suggest__chip-row">
                  {trendingSearches.map((query) => (
                    <button
                      key={`trend-${query}`}
                      type="button"
                      className="home-search-suggest__chip home-search-suggest__chip--trending"
                      onClick={() => onQuerySelect?.(query)}
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {showEmptyDiscovery ? (
              <div className="home-search-suggest__empty">
                <HiOutlineSearch size={22} aria-hidden="true" />
                <p>Search products, property, vehicles, and events across Africa.</p>
              </div>
            ) : null}
          </>
        ) : null}

        {hasSuggestions ? (
          <>
            <div className="home-search-suggest__section-label">Top matches</div>
            {searchData.slice(0, 8).map((item) => {
              const currentIndex = rowIndex++;
              const isActive = currentIndex === activeIndex;
              const href = resolveHref(item, searchTerm);
              const thumb = resolveThumb(item);
              const meta = resolveMeta(item);
              const typeLabel = TYPE_LABELS[item.type] || "Product";

              return (
                <Link
                  key={`${item.type || "product"}-${item._id || item.name}-${currentIndex}`}
                  to={href}
                  onClick={() => {
                    onSelect?.(item);
                    setSearchData?.(null);
                  }}
                  className={`home-search-suggest__row${isActive ? " is-active" : ""}`}
                  role="option"
                  aria-selected={isActive}
                >
                  <span className="home-search-suggest__thumb">
                    {thumb ? (
                      <img src={thumb} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <span aria-hidden="true">{resolveEmoji(item)}</span>
                    )}
                  </span>
                  <span className="home-search-suggest__body">
                    <span className="home-search-suggest__title">
                      {item.name || item.title}
                      <span className="home-search-suggest__type-badge">{typeLabel}</span>
                    </span>
                    {meta ? <span className="home-search-suggest__meta">{meta}</span> : null}
                  </span>
                </Link>
              );
            })}
          </>
        ) : null}

        {trimmed && !isLoading && !hasSuggestions ? (
          <div className="home-search-suggest__no-results">
            <p>No instant matches for &ldquo;{trimmed}&rdquo;</p>
            <span>Press Enter to search the full marketplace</span>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SiteSearchDropdown;
