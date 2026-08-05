import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { formatListingPrice } from "./propertyMobilityHelpers";
import "./property-mobility-ui.css";

const PropertyListingCard = ({ listing, saved, onToggleSave, compact = false }) => {
  const photo = listing.photos?.[0] || listing.images?.[0];
  const city = listing.location?.city || listing.city || "—";
  const district = listing.location?.district || listing.district;
  const locationLabel = [district, city].filter(Boolean).join(", ");
  const detailUrl = `/property-mobility/listing/${listing.listingId}`;

  const handleSaveClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onToggleSave?.(listing.listingId);
  };

  return (
    <article className={`pm-listing-card${compact ? " pm-listing-card--compact" : ""}`}>
      <Link to={detailUrl} className="pm-listing-card__link" aria-label={`View ${listing.title}`}>
        <div className="pm-listing-card__media">
          {photo ? (
            <img src={photo} alt="" loading="lazy" decoding="async" className="pm-listing-card__img" />
          ) : (
            <div className="pm-listing-card__placeholder" aria-hidden="true">
              🏠
            </div>
          )}
          {listing.verified ? <span className="pm-listing-card__badge">Verified</span> : null}
          {listing.featured ? (
            <span className="pm-listing-card__badge pm-listing-card__badge--featured">Featured</span>
          ) : null}
        </div>

        <div className="pm-listing-card__body">
          <p className="pm-listing-card__price">{formatListingPrice(listing)}</p>
          <h3 className="pm-listing-card__title">{listing.title}</h3>
          <p className="pm-listing-card__location">
            <HiOutlineLocationMarker size={13} aria-hidden="true" />
            <span>{locationLabel}</span>
          </p>
        </div>
      </Link>

      <button
        type="button"
        className={`pm-listing-card__save${saved ? " is-saved" : ""}`}
        aria-label={saved ? "Remove from saved" : "Save listing"}
        onClick={handleSaveClick}
      >
        {saved ? <AiFillHeart size={16} /> : <AiOutlineHeart size={16} />}
      </button>
    </article>
  );
};

export default PropertyListingCard;
