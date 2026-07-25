import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  PropertyMobilityStatusBanner,
} from "../components/PropertyMobility/propertyMobilityUi";
import {
  MOBILITY_CATEGORIES,
  PROPERTY_CATEGORIES,
  formatCategory,
  formatPrice,
  resolvePropertyMobilityErrorMessage,
} from "../components/PropertyMobility/propertyMobilityHelpers";
import {
  fetchPropertyMobilityAvailability,
  searchPropertyListings,
  submitPropertyOffer,
  submitPropertyReport,
} from "../services/propertyMobilityService";
import {
  isPropertyFavorite,
  togglePropertyFavorite,
} from "../utils/propertyMobilityFavorites";

const parseFiltersFromParams = (params) => ({
  listingType: params.get("listingType") || "",
  category: params.get("category") || "",
  verifiedOnly: params.get("verifiedOnly") === "true",
  featuredOnly: params.get("featuredOnly") === "true",
  minPrice: params.get("minPrice") || "",
  maxPrice: params.get("maxPrice") || "",
  location: params.get("location") || "",
  q: params.get("q") || "",
});

const PublicPropertyMobilityPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filters, setFilters] = useState(() => parseFiltersFromParams(searchParams));

  const pageTitle = useMemo(() => {
    if (filters.listingType === "property") return "Property";
    if (filters.listingType === "vehicle") return "Mobility";
    return "Property & Mobility";
  }, [filters.listingType]);

  const categoryOptions = useMemo(() => {
    if (filters.listingType === "property") return PROPERTY_CATEGORIES;
    if (filters.listingType === "vehicle") return MOBILITY_CATEGORIES;
    return [...PROPERTY_CATEGORIES, ...MOBILITY_CATEGORIES];
  }, [filters.listingType]);

  useEffect(() => {
    setFilters(parseFiltersFromParams(searchParams));
  }, [searchParams]);

  const syncParams = useCallback((nextFilters) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value === true) params.set(key, "true");
      else if (value) params.set(key, String(value));
    });
    setSearchParams(params, { replace: true });
  }, [setSearchParams]);

  const loadListings = useCallback(async (activeFilters = filters) => {
    setLoading(true);
    try {
      const availability = await fetchPropertyMobilityAvailability();
      if (availability.disabled || !availability.available) {
        setListings([]);
        return;
      }
      const result = await searchPropertyListings({
        ...activeFilters,
        verifiedOnly: activeFilters.verifiedOnly,
        featuredOnly: activeFilters.featuredOnly,
      });
      setListings(result?.data?.listings || result?.listings || []);
    } catch (error) {
      toast.error(resolvePropertyMobilityErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadListings(filters);
  }, [filters, loadListings]);

  const handleSearch = (e) => {
    e.preventDefault();
    syncParams(filters);
    loadListings(filters);
  };

  const handleCategorySelect = (category) => {
    const next = { ...filters, category: filters.category === category ? "" : category };
    setFilters(next);
    syncParams(next);
  };

  const handleShare = async (listingId, title) => {
    const url = `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}/listing/${listingId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied.");
      }
    } catch {
      /* cancelled */
    }
  };

  const handleFavorite = (listingId) => {
    togglePropertyFavorite(listingId);
    setFavoriteIds((prev) => {
      const has = prev.includes(listingId);
      return has ? prev.filter((id) => id !== listingId) : [...prev, listingId];
    });
  };

  useEffect(() => {
    setFavoriteIds(listings.filter((l) => isPropertyFavorite(l.listingId)).map((l) => l.listingId));
  }, [listings]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
        <p className="text-gray-500 mt-1">Browse apartments, houses, land, cars, motorcycles, trucks, and commercial property.</p>
        <div className="flex flex-wrap gap-2 mt-4">
          <Link to="/property-mobility?listingType=property" className="px-4 py-2 rounded-xl border text-sm font-medium">Property</Link>
          <Link to="/property-mobility?listingType=vehicle" className="px-4 py-2 rounded-xl border text-sm font-medium">Mobility</Link>
          <Link to="/products" className="px-4 py-2 rounded-xl border text-sm font-medium">Shopping</Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {categoryOptions.map((item) => (
          <button
            key={item.value}
            type="button"
            className={`px-3 py-1.5 rounded-full text-sm border ${
              filters.category === item.value ? "bg-blue-600 text-white border-blue-600" : "border-gray-300 dark:border-gray-600"
            }`}
            onClick={() => handleCategorySelect(item.value)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form className="grid grid-cols-1 md:grid-cols-4 gap-3" onSubmit={handleSearch}>
        <input className="h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900" placeholder="Search" value={filters.q} onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))} aria-label="Search" />
        <select className="h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900" value={filters.listingType} onChange={(e) => setFilters((p) => ({ ...p, listingType: e.target.value, category: "" }))} aria-label="Listing type">
          <option value="">All types</option>
          <option value="property">Property</option>
          <option value="vehicle">Mobility</option>
        </select>
        <input className="h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900" placeholder="Location" value={filters.location} onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))} aria-label="Location" />
        <button type="submit" className="h-11 rounded-xl bg-blue-600 text-white font-medium">Search</button>
        <label className="flex items-center gap-2 text-sm min-h-[44px]">
          <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => setFilters((p) => ({ ...p, verifiedOnly: e.target.checked }))} />
          Verified only
        </label>
        <label className="flex items-center gap-2 text-sm min-h-[44px]">
          <input type="checkbox" checked={filters.featuredOnly} onChange={(e) => setFilters((p) => ({ ...p, featuredOnly: e.target.checked }))} />
          Featured only
        </label>
      </form>

      {loading ? <p className="text-sm text-gray-500">Loading listings…</p> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {!loading && listings.length === 0 ? (
          <PropertyMobilityStatusBanner tone="info" title="No listings" message="Try adjusting your filters." />
        ) : null}
        {listings.map((listing) => {
          const saved = favoriteIds.includes(listing.listingId);
          return (
            <article key={listing.listingId} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link to={`/property-mobility/listing/${listing.listingId}`} className="font-semibold text-lg hover:underline">
                    {listing.title}
                  </Link>
                  <p className="text-sm text-gray-500">{formatCategory(listing.category)} · {listing.location?.city || "—"}</p>
                </div>
                {listing.verified ? <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span> : null}
              </div>
              <p className="text-xl font-semibold">{formatPrice(listing.price)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{listing.description}</p>
              <div className="flex flex-wrap gap-2">
                <Link to={`/property-mobility/listing/${listing.listingId}`} className="min-h-[44px] px-4 rounded-xl bg-blue-600 text-white text-sm font-medium inline-flex items-center">
                  View details
                </Link>
                <button type="button" className="min-h-[44px] px-4 rounded-xl border text-sm font-medium inline-flex items-center gap-1" onClick={() => handleFavorite(listing.listingId)}>
                  {saved ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                  {saved ? "Saved" : "Save"}
                </button>
                <button type="button" className="min-h-[44px] px-4 rounded-xl border text-sm font-medium" onClick={() => handleShare(listing.listingId, listing.title)}>
                  Share
                </button>
                <button
                  type="button"
                  className="min-h-[44px] px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium"
                  onClick={() =>
                    submitPropertyOffer({
                      listingId: listing.listingId,
                      type: "contact",
                      message: "I am interested in this listing.",
                    }).then(() => toast.success("Message sent via inbox."))
                  }
                >
                  Contact Owner
                </button>
                <button
                  type="button"
                  className="min-h-[44px] px-4 rounded-xl border border-red-300 text-red-600 text-sm font-medium"
                  onClick={() =>
                    submitPropertyReport({
                      listingId: listing.listingId,
                      reason: "spam",
                      details: "Reported from public browse page.",
                    }).then(() => toast.success("Report submitted."))
                  }
                >
                  Report
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};

export default PublicPropertyMobilityPage;
