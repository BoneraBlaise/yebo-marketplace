import React from "react";
import PropertyListingCard from "./PropertyListingCard";

const PropertyListingsCarousel = ({ listings, favoriteIds, onToggleSave }) => {
  if (!listings.length) return null;

  return (
    <div className="pm-listings-carousel" role="list" aria-label="Browse listings">
      {listings.map((listing) => (
        <div key={listing.listingId} className="pm-listings-carousel__item" role="listitem">
          <PropertyListingCard
            listing={listing}
            saved={favoriteIds.includes(listing.listingId)}
            onToggleSave={onToggleSave}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyListingsCarousel;
