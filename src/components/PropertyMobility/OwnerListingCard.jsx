import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineShare,
  HiOutlineTrash,
  HiOutlinePause,
  HiOutlineUpload,
  HiOutlineStar,
  HiOutlineLocationMarker,
} from "react-icons/hi";
import {
  formatCategory,
  formatPrice,
  formatListingStatus,
  formatListingLocation,
  formatListingDate,
  getListingThumbnail,
  canPublishListing,
  canFeatureListing,
  canPauseListing,
} from "./propertyMobilityHelpers";
import "./property-mobility-ui.css";

const OwnerListingCard = ({
  listing,
  layout = "grid",
  onPublish,
  onPause,
  onFeature,
  onDelete,
  onShare,
  onEdit,
}) => {
  const [imgError, setImgError] = useState(false);
  const thumbnail = getListingThumbnail(listing);
  const statusMeta = formatListingStatus(listing.status);
  const viewPath = `/property-mobility/listing/${listing.listingId}`;
  const views = listing.views ?? listing.viewCount;
  const createdLabel = formatListingDate(listing.createdAt);

  const handleShare = async (e) => {
    e.preventDefault();
    if (onShare) {
      onShare(listing);
      return;
    }
    const url = `${window.location.origin}${viewPath}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
      }
    } catch {
      /* cancelled */
    }
  };

  const actionBtn = (label, Icon, onClick, { danger = false, disabled = false } = {}) => (
    <button
      type="button"
      className={`pm-owner-card__action${danger ? " pm-owner-card__action--danger" : ""}`}
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
    >
      <Icon size={18} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );

  return (
    <article className={`pm-owner-card pm-owner-card--${layout}`}>
      <Link to={viewPath} className="pm-owner-card__media" aria-label={`Preview ${listing.title}`}>
        {thumbnail && !imgError ? (
          <img
            src={thumbnail}
            alt=""
            loading="lazy"
            decoding="async"
            className="pm-owner-card__img"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="pm-owner-card__placeholder" aria-hidden="true">
            🏠
          </div>
        )}
        <span className={`pm-status-badge pm-status-badge--${statusMeta.tone}`}>
          {statusMeta.emoji} {statusMeta.label}
        </span>
      </Link>

      <div className="pm-owner-card__body">
        <div className="pm-owner-card__head">
          <Link to={viewPath} className="pm-owner-card__title">
            {listing.title || "Untitled listing"}
          </Link>
          <p className="pm-owner-card__price">
            {formatPrice(listing.price, listing.currency || "RWF")}
          </p>
        </div>

        <p className="pm-owner-card__location">
          <HiOutlineLocationMarker size={15} aria-hidden="true" />
          {formatListingLocation(listing)}
        </p>

        <div className="pm-owner-card__meta">
          <span className="pm-owner-card__category">{formatCategory(listing.category)}</span>
          {createdLabel ? <span className="pm-owner-card__date">Listed {createdLabel}</span> : null}
          {views != null ? (
            <span className="pm-owner-card__views">{Number(views).toLocaleString()} views</span>
          ) : null}
        </div>

        <div className="pm-owner-card__actions">
          {actionBtn("Preview", HiOutlineEye, () => window.open(viewPath, "_blank", "noopener,noreferrer"))}
          {actionBtn("Edit", HiOutlinePencil, () => onEdit?.(listing))}
          <button
            type="button"
            className="pm-owner-card__action"
            aria-label="Share"
            title="Share"
            onClick={handleShare}
          >
            <HiOutlineShare size={18} aria-hidden="true" />
            <span>Share</span>
          </button>
          {canPublishListing(listing.status)
            ? actionBtn("Publish", HiOutlineUpload, () => onPublish?.(listing))
            : null}
          {canPauseListing(listing.status)
            ? actionBtn("Pause", HiOutlinePause, () => onPause?.(listing))
            : null}
          {canFeatureListing(listing.status)
            ? actionBtn("Feature", HiOutlineStar, () => onFeature?.(listing))
            : null}
          {actionBtn("Delete", HiOutlineTrash, () => onDelete?.(listing), { danger: true })}
        </div>
      </div>
    </article>
  );
};

export default OwnerListingCard;
