import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { searchPropertyListings } from "../../services/propertyMobilityService";
import PropertyListingCard from "../PropertyMobility/PropertyListingCard";
import PropertyMobilityEmptyState from "../PropertyMobility/PropertyMobilityEmptyState";
import { resolveListingType } from "../../constants/marketplaceSearchConstants";
import "../PropertyMobility/property-mobility-ui.css";
import "./global-marketplace-search.css";

const GlobalPropertySearchSection = ({ searchTerm, vertical = "all" }) => {
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);

  const listingType = resolveListingType(vertical);
  const title =
    vertical === "mobility"
      ? "Vehicles"
      : vertical === "property"
        ? "Properties"
        : "Properties & Vehicles";

  useEffect(() => {
    const term = searchTerm?.trim();
    if (!term) {
      setListings([]);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    const params = { q: term, limit: 6 };
    if (listingType) params.listingType = listingType;

    searchPropertyListings(params)
      .then((result) => {
        if (cancelled) return;
        setListings(result?.data?.listings || result?.listings || []);
      })
      .catch(() => {
        if (!cancelled) setListings([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchTerm, listingType, vertical]);

  const term = searchTerm?.trim();
  if (!term) return null;

  return (
    <section className="gms-section pm-global-search" aria-label={`${title} results`}>
      <h2 className="gms-section__title">{title}</h2>

      {loading ? (
        <div className="pm-skeleton-grid">
          {[0, 1, 2].map((i) => (
            <div key={i} className="pm-skeleton-card">
              <div className="pm-skeleton-card__media" />
              <div className="pm-skeleton-card__body">
                <div className="pm-skeleton-line pm-skeleton-line--short" />
                <div className="pm-skeleton-line pm-skeleton-line--medium" />
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {!loading && listings.length === 0 ? (
        <PropertyMobilityEmptyState
          compact
          title={`No ${title.toLowerCase()} found`}
          description={`We couldn't find ${title.toLowerCase()} matching "${term}". Try a nearby city or different keywords.`}
          secondaryLabel="Browse all listings"
          secondaryTo="/property-mobility"
        />
      ) : null}

      {!loading && listings.length > 0 ? (
        <div className="pm-listings-grid">
          {listings.slice(0, 6).map((listing) => (
            <PropertyListingCard key={listing.listingId} listing={listing} compact />
          ))}
        </div>
      ) : null}

      <Link
        to={`/property-mobility?q=${encodeURIComponent(term)}${listingType ? `&listingType=${listingType}` : ""}`}
        className="gms-section__link"
      >
        View all {title.toLowerCase()} results →
      </Link>
    </section>
  );
};

export default GlobalPropertySearchSection;
