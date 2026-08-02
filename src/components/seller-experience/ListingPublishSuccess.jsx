import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineCheckCircle, HiOutlineExternalLink, HiOutlineShare, HiOutlinePlus } from "react-icons/hi";
import "./listing-publish-success.css";

const ListingPublishSuccess = ({ listing, onCreateAnother, onClose }) => {
  const navigate = useNavigate();
  const listingId = listing?.listingId;
  const title = listing?.title || "Your listing";
  const viewPath = listingId ? `/property-mobility/listing/${listingId}` : "/dashboard-property-mobility";

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
      <div className="listing-publish-success__icon" aria-hidden="true">
        <HiOutlineCheckCircle size={48} />
      </div>
      <h2 className="listing-publish-success__title">Listing Published</h2>
      <p className="listing-publish-success__desc">
        Your listing is now live and pending review. Buyers can discover it once approved.
      </p>
      {listingId && (
        <p className="listing-publish-success__id">
          ID: <code>{listingId}</code>
        </p>
      )}

      <div className="listing-publish-success__actions">
        <Link to={viewPath} className="listing-publish-success__btn listing-publish-success__btn--primary" onClick={onClose}>
          <HiOutlineExternalLink size={18} aria-hidden="true" />
          View Listing
        </Link>
        <button type="button" className="listing-publish-success__btn listing-publish-success__btn--secondary" onClick={handleShare}>
          <HiOutlineShare size={18} aria-hidden="true" />
          Share Listing
        </button>
        <button
          type="button"
          className="listing-publish-success__btn listing-publish-success__btn--secondary"
          onClick={() => {
            onCreateAnother?.();
          }}
        >
          <HiOutlinePlus size={18} aria-hidden="true" />
          Create Another Listing
        </button>
        <button
          type="button"
          className="listing-publish-success__btn listing-publish-success__btn--ghost"
          onClick={() => {
            onClose?.();
            navigate("/dashboard-property-mobility");
          }}
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ListingPublishSuccess;
