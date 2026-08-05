import React, { useEffect, useState } from "react";
import { searchPropertyListings } from "../../services/propertyMobilityService";
import PropertyListingCard from "./PropertyListingCard";

const PropertyRelatedListings = ({ listing }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!listing?.listingId) {
      setRelated([]);
      setLoading(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);

    searchPropertyListings({
      category: listing.category,
      location: listing.location?.city || listing.city,
      listingType: listing.kind === "vehicle" ? "vehicle" : "property",
      limit: 6,
    })
      .then((result) => {
        if (cancelled) return;
        const items = (result?.data?.listings || result?.listings || []).filter(
          (item) => item.listingId !== listing.listingId
        );
        setRelated(items.slice(0, 4));
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [listing]);

  if (loading) {
    return (
      <section className="pm-detail__section">
        <h2 className="pm-detail__section-title">Related listings</h2>
        <div className="pm-listings-grid">
          {[0, 1].map((i) => (
            <div key={i} className="pm-skeleton-card">
              <div className="pm-skeleton-card__media" />
              <div className="pm-skeleton-card__body">
                <div className="pm-skeleton-line pm-skeleton-line--short" />
                <div className="pm-skeleton-line" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (!related.length) return null;

  return (
    <section className="pm-detail__section">
      <h2 className="pm-detail__section-title">Related listings</h2>
      <div className="pm-listings-grid">
        {related.map((item) => (
          <PropertyListingCard key={item.listingId} listing={item} compact />
        ))}
      </div>
    </section>
  );
};

export default PropertyRelatedListings;
