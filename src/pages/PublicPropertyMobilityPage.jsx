import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PageMeta } from "../components/ui";
import PropertyMobilityFilters, { DEFAULT_PM_FILTERS } from "../components/PropertyMobility/PropertyMobilityFilters";
import PropertyListingCard from "../components/PropertyMobility/PropertyListingCard";
import PropertyMobilityEmptyState from "../components/PropertyMobility/PropertyMobilityEmptyState";
import {
  MOBILITY_CATEGORIES,
  PROPERTY_CATEGORIES,
  resolvePropertyMobilityErrorMessage,
} from "../components/PropertyMobility/propertyMobilityHelpers";
import {
  fetchPropertyMobilityAvailability,
  searchPropertyListings,
} from "../services/propertyMobilityService";
import {
  isPropertyFavorite,
  togglePropertyFavorite,
} from "../utils/propertyMobilityFavorites";
import "../components/PropertyMobility/property-mobility-ui.css";

const parseFiltersFromParams = (params) => ({
  ...DEFAULT_PM_FILTERS,
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

  const syncParams = useCallback(
    (nextFilters) => {
      const params = new URLSearchParams();
      Object.entries(nextFilters).forEach(([key, value]) => {
        if (value === true) params.set(key, "true");
        else if (value) params.set(key, String(value));
      });
      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

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

  const handleReset = () => {
    const reset = { ...DEFAULT_PM_FILTERS };
    setFilters(reset);
    syncParams(reset);
  };

  const handleShare = async (listing) => {
    const url = `${window.location.origin}/property-mobility/listing/${listing.listingId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
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
    <>
      <PageMeta
        title="Property & Mobility"
        description="Browse apartments, houses, land, cars, motorcycles, and commercial property for rent or sale on Yebone."
      />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{pageTitle}</h1>
        <p className="text-gray-500 text-base max-w-2xl">
          Browse apartments, houses, land, cars, motorcycles, trucks, and commercial property.
        </p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Link to="/property-mobility?listingType=property" className="pm-filters__chip">
            Property
          </Link>
          <Link to="/property-mobility?listingType=vehicle" className="pm-filters__chip">
            Mobility
          </Link>
          <Link to="/products" className="pm-filters__chip">
            Shopping
          </Link>
        </div>
      </header>

      <PropertyMobilityFilters
        filters={filters}
        onChange={(next) => {
          setFilters(next);
          syncParams(next);
        }}
        onSubmit={handleSearch}
        onReset={handleReset}
        categoryOptions={categoryOptions}
      />

      {loading ? (
        <div className="pm-skeleton-grid" aria-busy="true" aria-label="Loading listings">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="pm-skeleton-card">
              <div className="pm-skeleton-card__media" />
              <div className="pm-skeleton-card__body">
                <div className="pm-skeleton-line pm-skeleton-line--short" />
                <div className="pm-skeleton-line pm-skeleton-line--medium" />
                <div className="pm-skeleton-line" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="pm-listings-grid">
          {!listings.length ? (
            <PropertyMobilityEmptyState onReset={handleReset} />
          ) : (
            listings.map((listing) => (
              <PropertyListingCard
                key={listing.listingId}
                listing={listing}
                saved={favoriteIds.includes(listing.listingId)}
                onToggleSave={handleFavorite}
                onShare={handleShare}
              />
            ))
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default PublicPropertyMobilityPage;
