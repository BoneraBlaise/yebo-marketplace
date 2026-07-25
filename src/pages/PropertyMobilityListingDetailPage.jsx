import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import {
  PropertyMobilityStatusBanner,
} from "../components/PropertyMobility/propertyMobilityUi";
import {
  formatCategory,
  formatPrice,
  resolvePropertyMobilityErrorMessage,
} from "../components/PropertyMobility/propertyMobilityHelpers";
import {
  fetchPublicListing,
  submitPropertyOffer,
  submitPropertyReport,
} from "../services/propertyMobilityService";
import {
  isPropertyFavorite,
  togglePropertyFavorite,
} from "../utils/propertyMobilityFavorites";

const PropertyMobilityListingDetailPage = () => {
  const { listingId } = useParams();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [favorite, setFavorite] = useState(false);

  const loadListing = useCallback(async () => {
    setLoading(true);
    try {
      const result = await fetchPublicListing(listingId);
      const payload = result?.data?.listing || result?.listing || result?.data || result;
      setListing(payload?.listingId ? payload : null);
      setFavorite(isPropertyFavorite(listingId));
    } catch (error) {
      toast.error(resolvePropertyMobilityErrorMessage(error, "Listing not found"));
      setListing(null);
    } finally {
      setLoading(false);
    }
  }, [listingId]);

  useEffect(() => {
    loadListing();
  }, [loadListing]);

  const handleShare = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing?.title || "Yebone listing", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      }
    } catch {
      toast.info("Share cancelled.");
    }
  };

  const handleFavorite = () => {
    const saved = togglePropertyFavorite(listingId);
    setFavorite(saved);
    toast.success(saved ? "Saved to favorites." : "Removed from favorites.");
  };

  if (loading) {
    return <p className="max-w-5xl mx-auto px-4 py-10 text-gray-500">Loading listing…</p>;
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <PropertyMobilityStatusBanner tone="info" title="Listing unavailable" message="This listing may have been removed or is not published." />
        <Link to="/property-mobility" className="inline-block mt-4 text-[#29625d] font-medium">← Back to browse</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <Link to="/property-mobility" className="text-sm text-[#29625d] font-medium">← Back to Property & Mobility</Link>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">{listing.title}</h1>
            <p className="text-gray-500 mt-1">
              {formatCategory(listing.category)} · {listing.location?.city || listing.location || "—"}
            </p>
          </div>
          <div className="flex gap-2">
            <button type="button" className="min-h-[44px] px-4 rounded-xl border font-medium flex items-center gap-2" onClick={handleFavorite}>
              {favorite ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
              {favorite ? "Saved" : "Save"}
            </button>
            <button type="button" className="min-h-[44px] px-4 rounded-xl border font-medium" onClick={handleShare}>
              Share
            </button>
          </div>
        </div>

        <p className="text-2xl font-semibold">{formatPrice(listing.price)}</p>
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{listing.description}</p>

        {listing.verified ? (
          <span className="inline-flex text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">Verified listing</span>
        ) : null}

        <div className="flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            className="min-h-[44px] px-4 rounded-xl bg-blue-600 text-white text-sm font-medium"
            onClick={() =>
              submitPropertyOffer({
                listingId: listing.listingId,
                type: "contact",
                message: "I am interested in this listing.",
              }).then(() => toast.success("Message sent via inbox."))
            }
          >
            Contact Seller
          </button>
          <button
            type="button"
            className="min-h-[44px] px-4 rounded-xl border text-sm font-medium"
            onClick={() =>
              submitPropertyReport({
                listingId: listing.listingId,
                reason: "spam",
                details: "Reported from listing detail page.",
              }).then(() => toast.success("Report submitted."))
            }
          >
            Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyMobilityListingDetailPage;
