import React, { useCallback, useEffect, useState } from "react";
import {
  PropertyMobilityStatusBanner,
  ResponsiveDataTable,
} from "./propertyMobilityUi";
import {
  formatCategory,
  formatPrice,
  resolvePropertyMobilityErrorMessage,
} from "./propertyMobilityHelpers";
import {
  fetchAdminPropertyListings,
  fetchAdminPropertyMobilityDashboard,
  fetchAdminPropertyReports,
  fetchPropertyMobilityAvailability,
  fetchPropertyMobilityConfiguration,
  moderateAdminListing,
  moderateAdminReport,
  updatePropertyMobilityConfiguration,
} from "../../services/propertyMobilityService";

const PRICING_FIELDS = [
  ["verifiedBadgePrice", "Verified Badge Price"],
  ["verificationDurationDays", "Verification Duration (days)"],
  ["featuredPrice", "Featured Price"],
  ["homepagePromotionPrice", "Homepage Promotion"],
  ["searchBoostPrice", "Search Boost Price"],
  ["sponsoredPrice", "Sponsored Listing Price"],
  ["promotionDurationDays", "Promotion Duration (days)"],
  ["agencySubscriptionPrice", "Agency Subscription Price"],
  ["agencySubscriptionDurationDays", "Agency Subscription Duration (days)"],
];

const AdminPropertyMobilityPanel = () => {
  const [loading, setLoading] = useState(true);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [listings, setListings] = useState([]);
  const [reports, setReports] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [settings, setSettings] = useState(null);
  const [statusFilter, setStatusFilter] = useState("pending_review");
  const [notesModal, setNotesModal] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const availability = await fetchPropertyMobilityAvailability();
      if (availability.disabled || !availability.available) {
        setFeatureDisabled(true);
        return;
      }

      const results = await Promise.allSettled([
        fetchAdminPropertyMobilityDashboard(),
        fetchAdminPropertyListings({ status: statusFilter || undefined }),
        fetchAdminPropertyReports({ status: "pending" }),
        fetchPropertyMobilityConfiguration(),
      ]);

      if (results[0].status === "fulfilled") setDashboard(results[0].value?.data || null);
      if (results[1].status === "fulfilled") setListings(results[1].value?.data || []);
      if (results[2].status === "fulfilled") setReports(results[2].value?.data || []);
      if (results[3].status === "fulfilled") {
        setPricing(results[3].value?.data?.pricing || null);
        setSettings(results[3].value?.data?.settings || null);
      }
    } catch (error) {
      setLoadError(resolvePropertyMobilityErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleModerate = async (listingId, action, adminNotes = "") => {
    await moderateAdminListing(listingId, action, { adminNotes });
    loadData();
  };

  const promptModerate = (listingId, action) => {
    if (action === "request_changes" || action === "reject") {
      setNotesModal({ listingId, action });
      return;
    }
    handleModerate(listingId, action);
  };

  const submitNotesModerate = async (event) => {
    event.preventDefault();
    if (!notesModal) return;
    const adminNotes = new FormData(event.currentTarget).get("adminNotes") || "";
    await handleModerate(notesModal.listingId, notesModal.action, adminNotes);
    setNotesModal(null);
  };

  const handleReport = async (reportId, status) => {
    await moderateAdminReport(reportId, status, "Reviewed by admin");
    loadData();
  };

  const handlePricingSave = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    await updatePropertyMobilityConfiguration({
      pricing: {
        verifiedBadgePrice: Number(form.get("verifiedBadgePrice")),
        verificationDurationDays: Number(form.get("verificationDurationDays")),
        featuredPrice: Number(form.get("featuredPrice")),
        homepagePromotionPrice: Number(form.get("homepagePromotionPrice")),
        searchBoostPrice: Number(form.get("searchBoostPrice")),
        sponsoredPrice: Number(form.get("sponsoredPrice")),
        promotionDurationDays: Number(form.get("promotionDurationDays")),
        agencySubscriptionPrice: Number(form.get("agencySubscriptionPrice")),
        agencySubscriptionDurationDays: Number(form.get("agencySubscriptionDurationDays")),
      },
      settings: {
        promotions: {
          enabled: settings?.promotions?.enabled !== false,
          homepagePromotionLimit: Number(form.get("homepagePromotionLimit")),
        },
        agencies: {
          enabled: settings?.agencies?.enabled !== false,
          unlimitedListings: form.get("agencyUnlimitedListings") === "on",
          maxListings: Number(form.get("agencyMaxListings")),
        },
      },
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Property & Mobility</h1>
        <p className="text-sm text-gray-500 mt-1">Moderation, verification pricing, and marketplace oversight.</p>
      </div>

      {featureDisabled ? (
        <PropertyMobilityStatusBanner tone="warning" title="Feature unavailable" message="Property & Mobility is disabled." />
      ) : null}
      {loadError ? <PropertyMobilityStatusBanner tone="error" title="Load error" message={loadError} /> : null}

      {!loading && dashboard ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Total Listings", value: dashboard.listings?.total || 0 },
            { label: "Pending Review", value: dashboard.listings?.pendingReview || 0 },
            { label: "Needs Changes", value: dashboard.listings?.needsChanges || 0 },
            { label: "Published", value: dashboard.listings?.published || 0 },
            { label: "Pending Reports", value: dashboard.reports?.pending || 0 },
          ].map((metric) => (
            <div key={metric.label} className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-2xl font-semibold mt-2">{metric.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {pricing && settings ? (
        <form onSubmit={handlePricingSave} className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PRICING_FIELDS.map(([name, label]) => (
            <label key={name} className="text-sm">
              <span className="block mb-1 text-gray-600 dark:text-gray-300">{label}</span>
              <input
                name={name}
                type="number"
                defaultValue={pricing[name]}
                className="h-11 w-full px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900"
              />
            </label>
          ))}
          <label className="text-sm">
            <span className="block mb-1 text-gray-600 dark:text-gray-300">Homepage Promotion Limit</span>
            <input
              name="homepagePromotionLimit"
              type="number"
              defaultValue={settings.promotions?.homepagePromotionLimit ?? 12}
              className="h-11 w-full px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <label className="text-sm flex items-end gap-2 min-h-[44px]">
            <input
              name="agencyUnlimitedListings"
              type="checkbox"
              defaultChecked={settings.agencies?.unlimitedListings !== false}
              className="h-5 w-5"
            />
            <span className="text-gray-600 dark:text-gray-300">Agency Unlimited Listings</span>
          </label>
          <label className="text-sm">
            <span className="block mb-1 text-gray-600 dark:text-gray-300">Agency Maximum Listings</span>
            <input
              name="agencyMaxListings"
              type="number"
              defaultValue={settings.agencies?.maxListings ?? 100}
              className="h-11 w-full px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900"
            />
          </label>
          <div className="md:col-span-3">
            <button type="submit" className="h-11 px-5 rounded-xl bg-blue-600 text-white font-medium">
              Save Configuration
            </button>
          </div>
        </form>
      ) : null}

      {!loading ? (
        <>
          <section>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <h2 className="text-lg font-medium">Listings Moderation</h2>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm"
              >
                <option value="">All statuses</option>
                <option value="pending_review">Pending Review</option>
                <option value="needs_changes">Needs Changes</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
                <option value="paused">Paused</option>
              </select>
            </div>
            <ResponsiveDataTable
              columns={[
                { key: "title", label: "Title" },
                { key: "category", label: "Category", render: (row) => formatCategory(row.category) },
                { key: "price", label: "Price", render: (row) => formatPrice(row.price) },
                {
                  key: "status",
                  label: "Status",
                  render: (row) => String(row.status || "").replace(/_/g, " "),
                },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex flex-wrap gap-2">
                      {[
                        "approve",
                        "reject",
                        "request_changes",
                        "suspend",
                        "hide",
                        "restore",
                        "feature",
                        "unfeature",
                      ].map((action) => (
                        <button
                          key={action}
                          type="button"
                          className="text-blue-600 text-sm min-h-[44px] px-2 capitalize"
                          onClick={() => promptModerate(row.listingId, action)}
                        >
                          {action.replace(/_/g, " ")}
                        </button>
                      ))}
                    </div>
                  ),
                },
              ]}
              rows={listings.map((item) => ({ ...item, id: item.listingId }))}
            />
          </section>

          {notesModal ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
              <form
                onSubmit={submitNotesModerate}
                className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 p-5 space-y-4"
              >
                <h3 className="text-lg font-semibold capitalize">
                  {notesModal.action.replace(/_/g, " ")}
                </h3>
                <textarea
                  name="adminNotes"
                  rows={4}
                  placeholder="Optional note to the vendor…"
                  className="w-full rounded-xl border border-gray-200 dark:border-gray-700 p-3 text-sm dark:bg-gray-950"
                />
                <div className="flex gap-2 justify-end">
                  <button type="button" className="px-4 py-2 rounded-xl border" onClick={() => setNotesModal(null)}>
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded-xl bg-blue-600 text-white">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          ) : null}

          <section>
            <h2 className="text-lg font-medium mb-3">Reports</h2>
            <ResponsiveDataTable
              columns={[
                { key: "listingId", label: "Listing" },
                { key: "reason", label: "Reason" },
                { key: "status", label: "Status" },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex gap-2">
                      <button type="button" className="text-blue-600 text-sm min-h-[44px] px-2" onClick={() => handleReport(row.reportId, "dismissed")}>
                        Dismiss
                      </button>
                      <button type="button" className="text-red-600 text-sm min-h-[44px] px-2" onClick={() => handleReport(row.reportId, "action_taken")}>
                        Action
                      </button>
                    </div>
                  ),
                },
              ]}
              rows={reports.map((item) => ({ ...item, id: item.reportId }))}
            />
          </section>
        </>
      ) : null}
    </div>
  );
};

export default AdminPropertyMobilityPanel;
