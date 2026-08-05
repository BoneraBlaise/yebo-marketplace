import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { HiOutlineShare, HiOutlineLocationMarker } from "react-icons/hi";
import { PageMeta } from "../components/ui";
import ProductGallery from "../components/Products/ProductGallery";
import PropertyContactCard from "../components/PropertyMobility/PropertyContactCard";
import PropertyRelatedListings from "../components/PropertyMobility/PropertyRelatedListings";
import { PropertyMobilityStatusBanner } from "../components/PropertyMobility/propertyMobilityUi";
import {
  formatCategory,
  formatListingLocation,
  formatListingPrice,
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

  const handleReport = () =>
    submitPropertyReport({
      listingId: listing.listingId,
      reason: "spam",
      details: "Reported from listing detail page.",
    }).then(() => toast.success("Report submitted."));

  if (loading) {
    return (
      <div className="pm-detail">
        <div className="h-5 w-40 rounded bg-gray-100 dark:bg-gray-800 animate-pulse mb-6" />
        <div className="pm-detail__layout">
          <div className="space-y-6">
            <div className="h-[320px] sm:h-[420px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            <div className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          </div>
          <div className="hidden lg:block h-72 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="pm-detail">
        <PropertyMobilityStatusBanner
          tone="info"
          title="Listing unavailable"
          message="This listing may have been removed or is not published."
        />
        <Link to="/property-mobility" className="pm-detail__back">
          ← Back to browse
        </Link>
      </div>
    );
  }

  const mapsUrl = listing.location?.mapsUrl;
  const amenities = listing.amenities?.length ? listing.amenities : [];
  const locationLabel = formatListingLocation(listing);
  const priceLabel = formatListingPrice(listing);

  return (
    <>
      <PageMeta
        title={listing.title}
        description={
          listing.description?.slice(0, 160) ||
          `${formatCategory(listing.category)} in ${locationLabel}`
        }
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
            priceCurrency: listing.currency || listing.ownerInfo?.currency || "RWF",
          },
          address: locationLabel,
        }}
      />

      <div className="pm-detail pb-24 lg:pb-12">
        <Link to="/property-mobility" className="pm-detail__back">
          ← Property & Mobility
        </Link>

        <div className="pm-detail__layout">
          <div className="pm-detail__main">
            <div className="pm-detail__gallery-wrap">
              {galleryImages.length ? (
                <ProductGallery images={galleryImages} select={galleryIndex} setSelect={setGalleryIndex} />
              ) : (
                <div className="h-72 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                  No photos available
                </div>
              )}
            </div>

            <header className="pm-detail__header">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="pm-detail__title">{listing.title}</h1>
                  <p className="pm-detail__meta">
                    {formatCategory(listing.category)} · {locationLabel}
                  </p>
                </div>
                <div className="pm-detail__actions">
                  <button type="button" className="pm-detail__action-btn" onClick={handleFavorite}>
                    {favorite ? <AiFillHeart className="text-red-500" size={18} /> : <AiOutlineHeart size={18} />}
                    {favorite ? "Saved" : "Save"}
                  </button>
                  <button type="button" className="pm-detail__action-btn" onClick={handleShare}>
                    <HiOutlineShare size={18} />
                    Share
                  </button>
                </div>
              </div>
              <div className="pm-detail__price-row">
                <p className="pm-detail__price">{priceLabel}</p>
              </div>
            </header>

            {listing.description ? (
              <section className="pm-detail__section">
                <h2 className="pm-detail__section-title">Description</h2>
                <p className="pm-detail__description">{listing.description}</p>
              </section>
            ) : null}

            {amenities.length ? (
              <section className="pm-detail__section">
                <h2 className="pm-detail__section-title">Amenities</h2>
                <ul className="pm-detail__amenities">
                  {amenities.map((item) => (
                    <li key={String(item)} className="pm-detail__amenity">
                      {String(item).replace(/_/g, " ")}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {mapsUrl ? (
              <section className="pm-detail__section">
                <h2 className="pm-detail__section-title">Location</h2>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pm-detail__map-link"
                >
                  <HiOutlineLocationMarker size={18} />
                  View on map
                </a>
              </section>
            ) : null}

            <PropertyRelatedListings listing={listing} />
          </div>

          <aside className="pm-detail__sidebar">
            <PropertyContactCard listing={listing} onContact={handleContact} contacting={contacting} />
            <button
              type="button"
              className="w-full mt-3 min-h-[44px] px-4 rounded-xl border text-sm font-medium"
              onClick={handleReport}
            >
              Report listing
            </button>
          </aside>
        </div>
      </div>

      <div className="pm-detail__mobile-bar lg:hidden">
        <div className="pm-detail__mobile-price">
          <strong>{priceLabel}</strong>
          <span>{locationLabel}</span>
        </div>
        <button
          type="button"
          className="pm-detail__mobile-cta"
          onClick={handleContact}
          disabled={contacting}
        >
          {contacting ? "Opening…" : "Contact"}
        </button>
      </div>
    </>
  );
};

export default PropertyMobilityListingDetailPage;
