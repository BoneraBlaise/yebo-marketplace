import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { PageMeta } from "../components/ui";
import ProductGallery from "../components/Products/ProductGallery";
import PropertyContactCard from "../components/PropertyMobility/PropertyContactCard";
import PropertyRelatedListings from "../components/PropertyMobility/PropertyRelatedListings";
import { PropertyMobilityStatusBanner } from "../components/PropertyMobility/propertyMobilityUi";
import {
  formatCategory,
  formatListingLocation,
  formatPrice,
  resolvePropertyMobilityErrorMessage,
} from "../components/PropertyMobility/propertyMobilityHelpers";
import {
  fetchPublicListing,
  submitPropertyReport,
} from "../services/propertyMobilityService";
import { startListingConversation } from "../services/communicationService";
import {
  isPropertyFavorite,
  togglePropertyFavorite,
} from "../utils/propertyMobilityFavorites";
import { optimizeProductImage } from "../utils/productImageUtils";
import "../components/PropertyMobility/property-mobility-ui.css";

const PropertyMobilityListingDetailPage = () => {
  const { listingId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [contacting, setContacting] = useState(false);

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

  const galleryImages = useMemo(
    () =>
      (listing?.photos || []).map((url, index) => ({
        url: typeof url === "string" ? url : url?.url,
        _id: `photo-${index}`,
      })),
    [listing?.photos]
  );

  const canonical = `/property-mobility/listing/${listingId}`;
  const seoImage = galleryImages[0]?.url
    ? optimizeProductImage(galleryImages[0].url, "hero")
    : undefined;

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

  const handleContact = async () => {
    if (!isAuthenticated) {
      toast.info("Please sign in to contact the vendor.");
      navigate("/login");
      return;
    }
    if (!listing?.ownerId) {
      toast.error("Seller contact is unavailable for this listing.");
      return;
    }

    setContacting(true);
    try {
      const conversation = await startListingConversation({
        listingId: listing.listingId,
        sellerId: listing.ownerId,
        listingSnapshot: {
          name: listing.title,
          price: listing.price,
          images: galleryImages,
          category: listing.category,
          location: formatListingLocation(listing),
        },
        initialMessage: `Hi, I'm interested in "${listing.title}".`,
      });
      navigate(`/inbox?conversation=${conversation._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not start conversation.");
    } finally {
      setContacting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="h-8 w-48 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mb-6" />
        <div className="grid lg:grid-cols-[1fr_320px] gap-8">
          <div className="h-[420px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          <div className="h-64 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10">
        <PropertyMobilityStatusBanner
          tone="info"
          title="Listing unavailable"
          message="This listing may have been removed or is not published."
        />
        <Link to="/property-mobility" className="inline-block mt-4 text-[#29625d] font-medium">
          ← Back to browse
        </Link>
      </div>
    );
  }

  const mapsUrl = listing.location?.mapsUrl;
  const amenities = listing.amenities || listing.attributes || [];

  return (
    <>
      <PageMeta
        title={listing.title}
        description={listing.description?.slice(0, 160) || `${formatCategory(listing.category)} in ${formatListingLocation(listing)}`}
        image={seoImage}
        canonical={canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": listing.kind === "vehicle" ? "Product" : "RealEstateListing",
          name: listing.title,
          description: listing.description,
          offers: {
            "@type": "Offer",
            price: listing.price,
            priceCurrency: listing.currency || "RWF",
          },
          address: formatListingLocation(listing),
        }}
      />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        <Link to="/property-mobility" className="text-sm text-[#29625d] font-medium">
          ← Back to Property & Mobility
        </Link>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-8 items-start">
          <div className="space-y-6">
            {galleryImages.length ? (
              <ProductGallery images={galleryImages} select={galleryIndex} setSelect={setGalleryIndex} />
            ) : (
              <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                No photos available
              </div>
            )}

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-semibold">{listing.title}</h1>
                  <p className="text-gray-500 mt-1">
                    {formatCategory(listing.category)} · {formatListingLocation(listing)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="min-h-[44px] px-4 rounded-xl border font-medium flex items-center gap-2"
                    onClick={handleFavorite}
                  >
                    {favorite ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
                    {favorite ? "Saved" : "Save"}
                  </button>
                  <button type="button" className="min-h-[44px] px-4 rounded-xl border font-medium" onClick={handleShare}>
                    Share
                  </button>
                </div>
              </div>

              <p className="text-2xl font-semibold">{formatPrice(listing.price, listing.currency)}</p>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{listing.description}</p>

              {amenities.length ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Features</h2>
                  <ul className="flex flex-wrap gap-2">
                    {amenities.map((item) => (
                      <li
                        key={String(item)}
                        className="text-sm px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      >
                        {String(item).replace(/_/g, " ")}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {mapsUrl ? (
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-2">Location</h2>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#29625d] font-medium text-sm"
                  >
                    View on map →
                  </a>
                </div>
              ) : null}

              <div className="flex flex-wrap gap-2 pt-2 lg:hidden">
                <button
                  type="button"
                  className="min-h-[44px] px-4 rounded-xl bg-[#29625d] text-white text-sm font-medium"
                  onClick={handleContact}
                  disabled={contacting}
                >
                  Contact Vendor
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

            <PropertyRelatedListings listing={listing} />
          </div>

          <div className="hidden lg:block space-y-4">
            <PropertyContactCard listing={listing} onContact={handleContact} contacting={contacting} />
            <button
              type="button"
              className="w-full min-h-[44px] px-4 rounded-xl border text-sm font-medium"
              onClick={() =>
                submitPropertyReport({
                  listingId: listing.listingId,
                  reason: "spam",
                  details: "Reported from listing detail page.",
                }).then(() => toast.success("Report submitted."))
              }
            >
              Report listing
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PropertyMobilityListingDetailPage;
