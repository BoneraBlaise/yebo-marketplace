import React from "react";
import OwnerListingCard from "./OwnerListingCard";
import "./property-mobility-ui.css";

const OwnerListingsGrid = ({
  listings,
  viewMode = "grid",
  onPublish,
  onPause,
  onFeature,
  onDelete,
  onShare,
  onEdit,
}) => (
  <div
    className={viewMode === "list" ? "pm-owner-listings pm-owner-listings--list" : "pm-owner-listings pm-owner-listings--grid"}
    role="list"
    aria-label="Your listings"
  >
    {listings.map((listing) => (
      <OwnerListingCard
        key={listing.listingId}
        listing={listing}
        layout={viewMode === "list" ? "list" : "grid"}
        onPublish={onPublish}
        onPause={onPause}
        onFeature={onFeature}
        onDelete={onDelete}
        onShare={onShare}
        onEdit={onEdit}
      />
    ))}
  </div>
);

export default OwnerListingsGrid;
