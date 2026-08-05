import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { formatCategory, formatPrice, isPropertyCategory } from "./propertyMobilityHelpers";
import "./property-mobility-ui.css";

const PropertyListingCard = ({ listing, saved, onToggleSave, onShare, compact = false }) => {
  const photo = listing.photos?.[0] || listing.images?.[0];
  const city = listing.location?.city || listing.city || "—";
  const district = listing.location?.district || listing.district;
  const locationLabel = [district, city].filter(Boolean).join(", ");
  const bedrooms = listing.bedrooms ?? listing.attributes?.bedrooms;
  const bathrooms = listing.bathrooms ?? listing.attributes?.bathrooms;
  const area = listing.area ?? listing.attributes?.area;
  const isProperty = isPropertyCategory(listing.category);

  return (
    <article className={`pm-listing-card${compact ? " pm-listing-card--compact" : ""}`}>
      <div className="pm-listing-card__media">
        {photo ? (
          <img src={photo} alt="" loading="lazy" decoding="async" className="pm-listing-card__img" />
        ) : (
          <div className="pm-listing-card__placeholder" aria-hidden="true">
            🏠
          </div>
        )}
        <button
          type="button"
          className={`pm-listing-card__save${saved ? " is-saved" : ""}`}
          aria-label={saved ? "Remove from saved" : "Save listing"}
          onClick={() => onToggleSave?.(listing.listingId)}
        >
          {saved ? <AiFillHeart size={18} /> : <AiOutlineHeart size={18} />}
        </button>
        {listing.verified ? <span className="pm-listing-card__badge">Verified</span> : null}
        {listing.featured ? <span className="pm-listing-card__badge pm-listing-card__badge--featured">Featured</span> : null}
      </div>

      <div className="pm-listing-card__body">
        <p className="pm-listing-card__price">{formatPrice(listing.price, listing.currency || "RWF")}</p>
        <Link to={`/property-mobility/listing/${listing.listingId}`} className="pm-listing-card__title">
          {listing.title}
        </Link>
        <p className="pm-listing-card__location">
          <HiOutlineLocationMarker size={14} aria-hidden="true" />
          {locationLabel}
        </p>

        {isProperty && (bedrooms || bathrooms || area) ? (
          <div className="pm-listing-card__stats">
            {bedrooms ? <span>{bedrooms} bed</span> : null}
            {bathrooms ? <span>{bathrooms} bath</span> : null}
            {area ? <span>{area} m²</span> : null}
          </div>
        ) : null}

        {!isProperty && (listing.brand || listing.model) ? (
          <p className="pm-listing-card__meta">
            {[listing.brand, listing.model, listing.year].filter(Boolean).join(" · ")}
          </p>
        ) : null}

        <p className="pm-listing-card__category">{formatCategory(listing.category)}</p>

        {!compact ? (
          <div className="pm-listing-card__actions">
            <Link to={`/property-mobility/listing/${listing.listingId}`} className="pm-listing-card__cta">
              View details
            </Link>
            {onShare ? (
              <button type="button" className="pm-listing-card__ghost" onClick={() => onShare(listing)}>
                Share
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default PropertyListingCard;
