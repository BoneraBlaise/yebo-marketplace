import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  HiOutlineCheckCircle,
  HiOutlineExternalLink,
  HiOutlineShare,
  HiOutlinePlus,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  formatCategory,
  formatPrice,
  formatListingStatus,
  formatListingLocation,
  getListingThumbnail,
} from "../PropertyMobility/propertyMobilityHelpers";
import "./listing-publish-success.css";

const ListingPublishSuccess = ({ listing, onCreateAnother, onClose, autoRedirect = false }) => {
  const navigate = useNavigate();
  const listingId = listing?.listingId;
  const title = listing?.title || "Your listing";
  const viewPath = listingId ? `/property-mobility/listing/${listingId}` : "/dashboard-property-mobility";
  const statusMeta = formatListingStatus(listing?.status || "pending_review");
  const thumbnail = getListingThumbnail(listing);

  const handleShare = async () => {
    const url = `${window.location.origin}${viewPath}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="listing-publish-success">
      <div className="listing-publish-success__hero">
        <div className="listing-publish-success__icon" aria-hidden="true">
          <HiOutlineCheckCircle size={40} />
        </div>
        <h2 className="listing-publish-success__title">Listing Submitted</h2>
        <p className="listing-publish-success__desc">
          Your listing has been submitted successfully.
        </p>
        <p className="listing-publish-success__moderation">
          Our moderation team will review it.
        </p>
        <div className="listing-publish-success__eta">
          <span className="listing-publish-success__eta-label">Estimated review time</span>
          <strong>Within 24 hours</strong>
        </div>
      </div>

      {listing ? (
        <div className="listing-publish-success__preview">
          <div className="listing-publish-success__preview-media">
            {thumbnail ? (
              <img src={thumbnail} alt="" className="listing-publish-success__preview-img" />
            ) : (
              <div className="listing-publish-success__preview-placeholder" aria-hidden="true">
                🏠
              </div>
            )}
          </div>
          <div className="listing-publish-success__preview-body">
            <h3 className="listing-publish-success__preview-title">{title}</h3>
            {listing.price != null ? (
              <p className="listing-publish-success__preview-price">
                {formatPrice(listing.price, listing.currency || "RWF")}
              </p>
            ) : null}
            <p className="listing-publish-success__preview-location">
              <HiOutlineLocationMarker size={16} aria-hidden="true" />
              {formatListingLocation(listing)}
            </p>
            <p className="listing-publish-success__preview-category">{formatCategory(listing.category)}</p>
            <span className={`pm-status-badge pm-status-badge--${statusMeta.tone}`}>
              {statusMeta.emoji} {statusMeta.label}
            </span>
          </div>
        </div>
      ) : null}

      {autoRedirect ? (
        <p className="listing-publish-success__countdown">Taking you to My Listings…</p>
      ) : null}

      <div className="listing-publish-success__actions">
        <Link to={viewPath} className="listing-publish-success__btn listing-publish-success__btn--primary" onClick={onClose}>
          <HiOutlineExternalLink size={18} aria-hidden="true" />
          View Listing
        </Link>
        <button
          type="button"
          className="listing-publish-success__btn listing-publish-success__btn--secondary"
          onClick={() => onCreateAnother?.()}
        >
          <HiOutlinePlus size={18} aria-hidden="true" />
          Create Another Listing
        </button>
        <button
          type="button"
          className="listing-publish-success__btn listing-publish-success__btn--secondary"
          onClick={() => {
            onClose?.();
            navigate("/dashboard-property-mobility");
          }}
        >
          Go To Dashboard
        </button>
        <button type="button" className="listing-publish-success__btn listing-publish-success__btn--ghost" onClick={handleShare}>
          <HiOutlineShare size={18} aria-hidden="true" />
          Share Listing
        </button>
      </div>
    </div>
  );
};

export default ListingPublishSuccess;
