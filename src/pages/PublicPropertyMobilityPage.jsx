import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  PropertyMobilityStatusBanner,
} from "../components/PropertyMobility/propertyMobilityUi";
import {
  formatCategory,
  formatPrice,
  resolvePropertyMobilityErrorMessage,
} from "../components/PropertyMobility/propertyMobilityHelpers";
import {
  fetchPropertyMobilityAvailability,
  searchPropertyListings,
  submitPropertyOffer,
  submitPropertyReport,
} from "../services/propertyMobilityService";

const PublicPropertyMobilityPage = () => {
  const [loading, setLoading] = useState(true);
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({
    listingType: "",
    verifiedOnly: false,
    featuredOnly: false,
    minPrice: "",
    maxPrice: "",
    location: "",
    q: "",
  });

  const loadListings = useCallback(async () => {
    setLoading(true);
    try {
      const availability = await fetchPropertyMobilityAvailability();
      if (availability.disabled || !availability.available) {
        setListings([]);
        return;
      }
      const result = await searchPropertyListings({
        ...filters,
        verifiedOnly: filters.verifiedOnly,
        featuredOnly: filters.featuredOnly,
      });
      setListings(result?.data?.listings || []);
    } catch (error) {
      toast.error(resolvePropertyMobilityErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Property & Mobility</h1>
        <p className="text-gray-500 mt-1">Browse apartments, houses, land, cars, and commercial property.</p>
      </div>

      <form
        className="grid grid-cols-1 md:grid-cols-4 gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          loadListings();
        }}
      >
        <input className="h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900" placeholder="Search" value={filters.q} onChange={(e) => setFilters((p) => ({ ...p, q: e.target.value }))} aria-label="Search" />
        <select className="h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900" value={filters.listingType} onChange={(e) => setFilters((p) => ({ ...p, listingType: e.target.value }))} aria-label="Listing type">
          <option value="">All types</option>
          <option value="property">Property</option>
          <option value="vehicle">Vehicles</option>
        </select>
        <input className="h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900" placeholder="Location" value={filters.location} onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))} aria-label="Location" />
        <button type="submit" className="h-11 rounded-xl bg-blue-600 text-white font-medium">Search</button>
        <label className="flex items-center gap-2 text-sm min-h-[44px]">
          <input type="checkbox" checked={filters.verifiedOnly} onChange={(e) => setFilters((p) => ({ ...p, verifiedOnly: e.target.checked }))} />
          Verified only
        </label>
        <label className="flex items-center gap-2 text-sm min-h-[44px]">
          <input type="checkbox" checked={filters.featuredOnly} onChange={(e) => setFilters((p) => ({ ...p, featuredOnly: e.target.checked }))} />
          Featured only
        </label>
      </form>

      {loading ? <p className="text-sm text-gray-500">Loading listings…</p> : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {!loading && listings.length === 0 ? (
          <PropertyMobilityStatusBanner tone="info" title="No listings" message="Try adjusting your filters." />
        ) : null}
        {listings.map((listing) => (
          <article key={listing.listingId} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold text-lg">{listing.title}</h2>
                <p className="text-sm text-gray-500">{formatCategory(listing.category)} · {listing.location?.city || "—"}</p>
              </div>
              {listing.verified ? <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">Verified</span> : null}
            </div>
            <p className="text-xl font-semibold">{formatPrice(listing.price)}</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{listing.description}</p>
            <div className="flex flex-wrap gap-2">
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
                Contact Owner
              </button>
              <button
                type="button"
                className="min-h-[44px] px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-sm font-medium"
                onClick={() =>
                  submitPropertyOffer({
                    listingId: listing.listingId,
                    type: "offer",
                    amount: Math.round(listing.price * 0.95),
                    message: "Offer submitted via Property & Mobility.",
                  }).then(() => toast.success("Offer sent."))
                }
              >
                Make Offer
              </button>
              <button
                type="button"
                className="min-h-[44px] px-4 rounded-xl border border-red-300 text-red-600 text-sm font-medium"
                onClick={() =>
                  submitPropertyReport({
                    listingId: listing.listingId,
                    reason: "spam",
                    details: "Reported from public browse page.",
                  }).then(() => toast.success("Report submitted."))
                }
              >
                Report
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default PublicPropertyMobilityPage;
