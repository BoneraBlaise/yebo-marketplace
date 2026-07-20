import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import VendorDashboardLayout from "../components/Dashboard/VendorDashboardLayout";
import {
  PropertyMobilityStatusBanner,
  ResponsiveDataTable,
} from "../components/PropertyMobility/propertyMobilityUi";
import {
  LISTING_CATEGORIES,
  formatCategory,
  formatPrice,
  resolvePropertyMobilityErrorMessage,
} from "../components/PropertyMobility/propertyMobilityHelpers";
import {
  createOwnerAgency,
  createOwnerListing,
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

const TABS = ["listings", "agencies", "offers", "verification"];

const inputClass =
  "h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white w-full";

const OwnerPropertyMobilityPage = () => {
  const [activeTab, setActiveTab] = useState("listings");
  const [loading, setLoading] = useState(true);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [listings, setListings] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [offers, setOffers] = useState([]);
  const [verification, setVerification] = useState(null);
  const [form, setForm] = useState({
    category: "apartments",
    title: "",
    description: "",
    price: "",
    city: "",
    lat: "",
    lng: "",
  });
  const [agencyForm, setAgencyForm] = useState({ type: "real_estate_agency", name: "" });

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

  const handleCreateListing = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required.");
      return;
    }
    try {
      await createOwnerListing({
        category: form.category,
        title: form.title,
        description: form.description,
        price: Number(form.price),
        location: { city: form.city },
        coordinates: { lat: Number(form.lat), lng: Number(form.lng) },
        photos: [],
        amenities: [],
      });
      toast.success("Listing created.");
      setForm({ category: "apartments", title: "", description: "", price: "", city: "", lat: "", lng: "" });
      loadData();
    } catch (error) {
      toast.error(resolvePropertyMobilityErrorMessage(error, "Unable to create listing"));
    }
  };

  return (
    <VendorDashboardLayout active={24} bare>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Property & Mobility Listings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage apartments, houses, land, cars, and commercial property.</p>
        </div>

        {featureDisabled ? (
          <PropertyMobilityStatusBanner tone="warning" title="Unavailable" message="Property & Mobility is disabled." />
        ) : null}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Property mobility sections">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={`min-h-[44px] px-4 rounded-xl text-sm font-medium capitalize ${
                activeTab === tab ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? <p className="text-sm text-gray-500">Loading…</p> : null}

        {!loading && activeTab === "listings" ? (
          <div className="space-y-4">
            <form onSubmit={handleCreateListing} className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                aria-label="Category"
              >
                {LISTING_CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <input className={inputClass} placeholder="Title" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} aria-label="Title" />
              <input className={inputClass} placeholder="Price (RWF)" type="number" value={form.price} onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))} aria-label="Price" />
              <input className={inputClass} placeholder="City" value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} aria-label="City" />
              <input className={inputClass} placeholder="Latitude" value={form.lat} onChange={(e) => setForm((p) => ({ ...p, lat: e.target.value }))} aria-label="Latitude" />
              <input className={inputClass} placeholder="Longitude" value={form.lng} onChange={(e) => setForm((p) => ({ ...p, lng: e.target.value }))} aria-label="Longitude" />
              <textarea
                className="md:col-span-2 min-h-[100px] px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                aria-label="Description"
              />
              <button type="submit" className="md:col-span-2 h-11 rounded-xl bg-blue-600 text-white font-medium">
                Create Listing
              </button>
            </form>

            <ResponsiveDataTable
              columns={[
                { key: "title", label: "Title" },
                { key: "category", label: "Category", render: (row) => formatCategory(row.category) },
                { key: "price", label: "Price", render: (row) => formatPrice(row.price) },
                { key: "status", label: "Status" },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex flex-wrap gap-2">
                      <button type="button" className="text-blue-600 text-sm min-h-[44px] px-2" onClick={() => publishOwnerListing(row.listingId).then(loadData)}>
                        Publish
                      </button>
                      <button type="button" className="text-blue-600 text-sm min-h-[44px] px-2" onClick={() => pauseOwnerListing(row.listingId).then(loadData)}>
                        Pause
                      </button>
                      <button type="button" className="text-blue-600 text-sm min-h-[44px] px-2" onClick={() => promoteOwnerListing(row.listingId, "featured").then(loadData)}>
                        Feature
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={listings.map((item) => ({ ...item, id: item.listingId }))}
            />
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
