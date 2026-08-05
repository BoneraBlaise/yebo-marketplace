import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import VendorDashboardLayout from "../components/Dashboard/VendorDashboardLayout";
import { useCreateExperience } from "../components/seller-experience/CreateExperienceContext";
import OwnerListingsToolbar from "../components/PropertyMobility/OwnerListingsToolbar";
import OwnerListingsGrid from "../components/PropertyMobility/OwnerListingsGrid";
import PropertyMobilityEmptyState from "../components/PropertyMobility/PropertyMobilityEmptyState";
import {
  PropertyMobilityStatusBanner,
  ResponsiveDataTable,
} from "../components/PropertyMobility/propertyMobilityUi";
import {
  formatCategory,
  formatPrice,
  resolvePropertyMobilityErrorMessage,
} from "../components/PropertyMobility/propertyMobilityHelpers";
import {
  createOwnerAgency,
  deleteOwnerListing,
  fetchOwnerAgencies,
  fetchOwnerListings,
  fetchOwnerOffers,
  fetchOwnerVerification,
  fetchPropertyMobilityAvailability,
  pauseOwnerListing,
  promoteOwnerListing,
  publishOwnerListing,
  requestOwnerVerification,
  respondOwnerOffer,
  subscribeOwnerAgency,
} from "../services/propertyMobilityService";
import "../components/PropertyMobility/property-mobility-ui.css";

const TABS = ["listings", "agencies", "offers", "verification"];

const inputClass =
  "h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white w-full";

const OwnerPropertyMobilityPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { openCreate } = useCreateExperience();
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [listings, setListings] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [offers, setOffers] = useState([]);
  const [verification, setVerification] = useState(null);
  const [agencyForm, setAgencyForm] = useState({ type: "real_estate_agency", name: "" });
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const availability = await fetchPropertyMobilityAvailability();
      if (availability.disabled || !availability.available) {
        setFeatureDisabled(true);
        return;
      }
      const results = await Promise.allSettled([
        fetchOwnerListings(),
        fetchOwnerAgencies(),
        fetchOwnerOffers(),
        fetchOwnerVerification(),
      ]);
      if (results[0].status === "fulfilled") setListings(results[0].value?.data || []);
      if (results[1].status === "fulfilled") setAgencies(results[1].value?.data || []);
      if (results[2].status === "fulfilled") setOffers(results[2].value?.data || []);
      if (results[3].status === "fulfilled") setVerification(results[3].value?.data || null);
    } catch (error) {
      toast.error(resolvePropertyMobilityErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (location.state?.openCreateWizard) {
      openCreate("property", loadData);
      setActiveTab("listings");
      window.history.replaceState({}, document.title);
    }
  }, [location.state, openCreate, loadData]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const filteredListings = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = listings.filter((item) => {
      if (categoryFilter && item.category !== categoryFilter) return false;
      if (statusFilter && item.status !== statusFilter) return false;
      if (!q) return true;
      const haystack = [
        item.title,
        item.category,
        item.location?.city,
        item.location?.district,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price_asc") return Number(a.price) - Number(b.price);
      if (sortBy === "price_desc") return Number(b.price) - Number(a.price);
      if (sortBy === "title") return String(a.title || "").localeCompare(String(b.title || ""));
      if (sortBy === "oldest") return String(a.createdAt || "").localeCompare(String(b.createdAt || ""));
      return String(b.createdAt || "").localeCompare(String(a.createdAt || ""));
    });
  }, [listings, query, categoryFilter, statusFilter, sortBy]);

  const handleListingAction = async (action, listingId, successMessage) => {
    try {
      await action(listingId);
      if (successMessage) toast.success(successMessage);
      loadData();
    } catch (error) {
      toast.error(resolvePropertyMobilityErrorMessage(error));
    }
  };

  const handleDeleteListing = (listing) => {
    if (!window.confirm(`Delete "${listing.title}"? This cannot be undone.`)) return;
    handleListingAction(deleteOwnerListing, listing.listingId, "Listing deleted.");
  };

  const handleShareListing = async (listing) => {
    const url = `${window.location.origin}/property-mobility/listing/${listing.listingId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: listing.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      }
    } catch {
      /* cancelled */
    }
  };

  const handlePublishComplete = useCallback(() => {
    loadData();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [loadData]);

  const resetOwnerFilters = () => {
    setQuery("");
    setCategoryFilter("");
    setStatusFilter("");
  };

  return (
    <VendorDashboardLayout active={24} bare>
      <div id="pm-my-listings" className="pm-vendor-dashboard space-y-6">
        <div className="pm-vendor-dashboard__header">
          <h1 className="pm-vendor-dashboard__title">Property & Mobility</h1>
          <p className="pm-vendor-dashboard__subtitle">Manage apartments, houses, land, cars, and commercial property.</p>
        </div>

        {featureDisabled ? (
          <PropertyMobilityStatusBanner tone="warning" title="Unavailable" message="Property & Mobility is disabled." />
        ) : null}

        <div className="pm-vendor-tabs" role="tablist" aria-label="Property mobility sections">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`pm-vendor-tabs__btn${activeTab === tab ? " is-active" : ""}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="pm-skeleton-grid" aria-busy="true">
            {[0, 1, 2].map((i) => (
              <div key={i} className="pm-skeleton-card">
                <div className="pm-skeleton-card__media" />
                <div className="pm-skeleton-card__body">
                  <div className="pm-skeleton-line pm-skeleton-line--medium" />
                  <div className="pm-skeleton-line pm-skeleton-line--short" />
                  <div className="pm-skeleton-line" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && activeTab === "listings" ? (
          <div className="space-y-5">
            <OwnerListingsToolbar
              query={query}
              category={categoryFilter}
              status={statusFilter}
              sort={sortBy}
              viewMode={viewMode}
              resultCount={filteredListings.length}
              onQueryChange={setQuery}
              onCategoryChange={setCategoryFilter}
              onStatusChange={setStatusFilter}
              onSortChange={setSortBy}
              onViewModeChange={setViewMode}
              onCreate={() => openCreate("property", handlePublishComplete)}
            />

            {!filteredListings.length ? (
              <PropertyMobilityEmptyState
                title={listings.length ? "No listings match your filters" : "No listings yet"}
                description={
                  listings.length
                    ? "Try changing your filters or search another keyword."
                    : "Create your first property or mobility listing."
                }
                onReset={listings.length ? resetOwnerFilters : undefined}
                onCreate={!listings.length ? () => openCreate("property", handlePublishComplete) : undefined}
              />
            ) : (
              <OwnerListingsGrid
                listings={filteredListings}
                viewMode={viewMode}
                onPublish={(listing) =>
                  handleListingAction(publishOwnerListing, listing.listingId, "Listing submitted for review.")
                }
                onPause={(listing) =>
                  handleListingAction(pauseOwnerListing, listing.listingId, "Listing paused.")
                }
                onFeature={(listing) =>
                  handleListingAction(
                    (id) => promoteOwnerListing(id, "featured"),
                    listing.listingId,
                    "Listing featured."
                  )
                }
                onDelete={handleDeleteListing}
                onShare={handleShareListing}
                onEdit={(listing) => navigate(`/property-mobility/listing/${listing.listingId}`)}
              />
            )}
          </div>
        ) : null}

        {!loading && activeTab === "agencies" ? (
          <div className="space-y-4">
            <form
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                await createOwnerAgency(agencyForm);
                loadData();
              }}
            >
              <select className={inputClass} value={agencyForm.type} onChange={(e) => setAgencyForm((p) => ({ ...p, type: e.target.value }))} aria-label="Agency type">
                <option value="real_estate_agency">Real Estate Agency</option>
                <option value="car_dealer">Car Dealer</option>
              </select>
              <input className={inputClass} placeholder="Agency name" value={agencyForm.name} onChange={(e) => setAgencyForm((p) => ({ ...p, name: e.target.value }))} aria-label="Agency name" />
              <button type="submit" className="h-11 rounded-xl bg-blue-600 text-white font-medium">
                Add Agency
              </button>
            </form>
            <ResponsiveDataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "type", label: "Type" },
                { key: "subscriptionStatus", label: "Subscription" },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <button type="button" className="text-blue-600 text-sm min-h-[44px] px-2" onClick={() => subscribeOwnerAgency(row.agencyId).then(loadData)}>
                      Subscribe
                    </button>
                  ),
                },
              ]}
              rows={agencies.map((item) => ({ ...item, id: item.agencyId }))}
            />
          </div>
        ) : null}

        {!loading && activeTab === "offers" ? (
          <ResponsiveDataTable
            columns={[
              { key: "offerId", label: "Offer" },
              { key: "listingId", label: "Listing" },
              { key: "type", label: "Type" },
              { key: "amount", label: "Amount", render: (row) => (row.amount != null ? formatPrice(row.amount) : "—") },
              { key: "status", label: "Status" },
              {
                key: "actions",
                label: "Actions",
                render: (row) =>
                  row.status === "pending" ? (
                    <div className="flex gap-2">
                      <button type="button" className="text-green-600 text-sm min-h-[44px] px-2" onClick={() => respondOwnerOffer(row.offerId, "accepted").then(loadData)}>
                        Accept
                      </button>
                      <button type="button" className="text-red-600 text-sm min-h-[44px] px-2" onClick={() => respondOwnerOffer(row.offerId, "rejected").then(loadData)}>
                        Reject
                      </button>
                    </div>
                  ) : (
                    row.status
                  ),
              },
            ]}
            rows={offers.map((item) => ({ ...item, id: item.offerId }))}
          />
        ) : null}

        {!loading && activeTab === "verification" ? (
          <div className="space-y-4">
            <PropertyMobilityStatusBanner
              tone={verification?.verified ? "info" : "warning"}
              title={verification?.verified ? "Yebone Verified" : "Not verified"}
              message={
                verification?.verified
                  ? `Badge active until ${verification.expiresAt || "expiry unknown"}`
                  : "Complete verification requirements to earn the Yebone Verified badge."
              }
            />
            <button
              type="button"
              className="h-11 px-5 rounded-xl bg-blue-600 text-white font-medium"
              onClick={() =>
                requestOwnerVerification({
                  nationalIdVerified: true,
                  phoneVerified: true,
                  addressVerified: true,
                }).then(loadData)
              }
            >
              Request Verification
            </button>
          </div>
        ) : null}
      </div>
    </VendorDashboardLayout>
  );
};

export default OwnerPropertyMobilityPage;
