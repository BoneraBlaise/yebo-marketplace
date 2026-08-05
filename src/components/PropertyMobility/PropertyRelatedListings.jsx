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
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Related listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[0, 1].map((i) => (
            <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  if (!related.length) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Related listings</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((item) => (
          <PropertyListingCard key={item.listingId} listing={item} compact />
        ))}
      </div>
    </section>
  );
};

export default PropertyRelatedListings;
