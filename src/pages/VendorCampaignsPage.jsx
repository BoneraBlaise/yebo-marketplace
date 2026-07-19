import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import VendorDashboardLayout from "../components/Dashboard/VendorDashboardLayout";
import { GrowthCommerceStatusBanner } from "../components/GrowthCommerce/growthCommerceUi";
import {
  createVendorCampaign,
  duplicateVendorCampaign,
  fetchGrowthCommerceAvailability,
  fetchVendorCampaigns,
  fetchVendorMarketingDashboard,
  resolveGrowthCommerceErrorMessage,
  updateVendorCampaignStatus,
} from "../services/growthCommerceService";

const CAMPAIGN_TYPES = [
  { value: "flash_sale", label: "Flash Sale" },
  { value: "scheduled_sale", label: "Scheduled Sale" },
  { value: "weekend_sale", label: "Weekend Sale" },
  { value: "holiday_sale", label: "Holiday Sale" },
  { value: "featured_campaign", label: "Featured Campaign" },
];

const INITIAL_FORM = {
  name: "",
  type: "flash_sale",
  description: "",
  discountType: "percentage",
  discountValue: 10,
  startDate: "",
  endDate: "",
};

const inputClass = (hasError) =>
  `h-11 px-4 rounded-xl border-2 bg-white dark:bg-gray-900 text-sm dark:text-white ${
    hasError ? "border-red-400 dark:border-red-500" : "border-gray-200 dark:border-gray-700"
  }`;

const validateCampaignForm = (form) => {
  const errors = {};
  if (!form.name.trim()) {
    errors.name = "Campaign name is required.";
  }
  if (!Number.isFinite(Number(form.discountValue)) || Number(form.discountValue) < 1) {
    errors.discountValue = "Enter a discount value of at least 1.";
  } else if (form.discountType === "percentage" && Number(form.discountValue) > 100) {
    errors.discountValue = "Percentage discount cannot exceed 100.";
  }
  if (form.startDate && form.endDate && new Date(form.endDate) <= new Date(form.startDate)) {
    errors.endDate = "End date must be after the start date.";
  }
  return errors;
};

const VendorCampaignsPage = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dashboardError, setDashboardError] = useState("");
  const [campaignsError, setCampaignsError] = useState("");
  const [form, setForm] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    setDashboardError("");
    setCampaignsError("");

    try {
      const availability = await fetchGrowthCommerceAvailability();
      if (availability.disabled || !availability.available) {
        setFeatureDisabled(true);
        setCampaigns([]);
        setDashboard(null);
        return;
      }

      setFeatureDisabled(false);

      const [campaignResult, dashboardResult] = await Promise.allSettled([
        fetchVendorCampaigns(),
        fetchVendorMarketingDashboard(),
      ]);

      if (campaignResult.status === "fulfilled") {
        setCampaigns(campaignResult.value?.data || []);
      } else {
        const message = resolveGrowthCommerceErrorMessage(
          campaignResult.reason,
          "Unable to load campaigns"
        );
        setCampaigns([]);
        setCampaignsError(message);
      }

      if (dashboardResult.status === "fulfilled") {
        setDashboard(dashboardResult.value?.data || null);
      } else {
        const message = resolveGrowthCommerceErrorMessage(
          dashboardResult.reason,
          "Unable to load campaign analytics"
        );
        setDashboard(null);
        setDashboardError(message);
      }

      if (campaignResult.status === "rejected" && dashboardResult.status === "rejected") {
        setLoadError("Unable to load campaign data. Please try again.");
      }
    } catch (error) {
      setLoadError(resolveGrowthCommerceErrorMessage(error, "Unable to load campaign data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreate = async (event) => {
    event.preventDefault();
    const errors = validateCampaignForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setCreating(true);
    try {
      await createVendorCampaign(form);
      toast.success("Campaign created successfully");
      setForm(INITIAL_FORM);
      setFieldErrors({});
      await loadData();
    } catch (error) {
      toast.error(resolveGrowthCommerceErrorMessage(error, "Unable to create campaign"));
    } finally {
      setCreating(false);
    }
  };

  const handleStatus = async (campaignId, status) => {
    setActionLoadingId(`${campaignId}:${status}`);
    try {
      await updateVendorCampaignStatus(campaignId, status);
      toast.success(`Campaign ${status}`);
      await loadData();
    } catch (error) {
      toast.error(resolveGrowthCommerceErrorMessage(error, "Unable to update campaign status"));
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDuplicate = async (campaignId) => {
    setActionLoadingId(`${campaignId}:duplicate`);
    try {
      await duplicateVendorCampaign(campaignId);
      toast.success("Campaign duplicated successfully");
      await loadData();
    } catch (error) {
      toast.error(resolveGrowthCommerceErrorMessage(error, "Unable to duplicate campaign"));
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <VendorDashboardLayout active={22} bare>
        <div className="space-y-4" aria-live="polite" aria-busy="true">
          <p className="text-sm text-gray-500">Loading campaigns...</p>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="yebone-surface rounded-2xl p-4 h-20 animate-pulse" />
            ))}
          </div>
        </div>
      </VendorDashboardLayout>
    );
  }

  if (featureDisabled) {
    return (
      <VendorDashboardLayout active={22} bare>
        <GrowthCommerceStatusBanner
          tone="warning"
          title="Campaigns are unavailable"
          message="Growth Commerce campaigns are disabled for this marketplace right now. Your existing products, orders, and promotions continue to work normally."
          action={
            <button type="button" onClick={loadData} className="yebone-btn-primary yebone-btn-lift">
              Check again
            </button>
          }
        />
      </VendorDashboardLayout>
    );
  }

  if (loadError) {
    return (
      <VendorDashboardLayout active={22} bare>
        <GrowthCommerceStatusBanner
          tone="error"
          title="Unable to load campaigns"
          message={loadError}
          action={
            <button type="button" onClick={loadData} className="yebone-btn-primary yebone-btn-lift">
              Retry
            </button>
          }
        />
      </VendorDashboardLayout>
    );
  }

  return (
    <VendorDashboardLayout active={22} bare>
      <div className="space-y-6">
        {dashboardError ? (
          <GrowthCommerceStatusBanner tone="warning" title="Analytics unavailable" message={dashboardError} />
        ) : dashboard ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="yebone-surface rounded-2xl p-4">
              <p className="text-xs text-gray-500">Views</p>
              <p className="text-xl font-semibold dark:text-white">{dashboard.metrics?.views || 0}</p>
            </div>
            <div className="yebone-surface rounded-2xl p-4">
              <p className="text-xs text-gray-500">CTR</p>
              <p className="text-xl font-semibold dark:text-white">{dashboard.metrics?.ctr || 0}%</p>
            </div>
            <div className="yebone-surface rounded-2xl p-4">
              <p className="text-xs text-gray-500">Conversion</p>
              <p className="text-xl font-semibold dark:text-white">{dashboard.metrics?.conversionRate || 0}%</p>
            </div>
            <div className="yebone-surface rounded-2xl p-4">
              <p className="text-xs text-gray-500">Revenue</p>
              <p className="text-xl font-semibold dark:text-white">{dashboard.metrics?.revenue || 0}</p>
            </div>
          </div>
        ) : (
          <GrowthCommerceStatusBanner
            tone="info"
            title="No campaign analytics yet"
            message="Performance metrics will appear here after your campaigns receive views and orders."
          />
        )}

        <form
          onSubmit={handleCreate}
          noValidate
          className="yebone-surface rounded-2xl p-4 grid md:grid-cols-2 gap-4"
          aria-label="Create campaign"
        >
          <div>
            <label htmlFor="campaign-name" className="block text-sm font-medium dark:text-white mb-2">
              Campaign name
            </label>
            <input
              id="campaign-name"
              required
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              className={`w-full ${inputClass(fieldErrors.name)}`}
              aria-invalid={Boolean(fieldErrors.name)}
              aria-describedby={fieldErrors.name ? "campaign-name-error" : undefined}
            />
            {fieldErrors.name ? (
              <p id="campaign-name-error" className="mt-1 text-xs text-red-500">
                {fieldErrors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="campaign-type" className="block text-sm font-medium dark:text-white mb-2">
              Campaign type
            </label>
            <select
              id="campaign-type"
              value={form.type}
              onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}
              className={`w-full ${inputClass(false)}`}
            >
              {CAMPAIGN_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="campaign-discount" className="block text-sm font-medium dark:text-white mb-2">
              Discount value (%)
            </label>
            <input
              id="campaign-discount"
              type="number"
              min="1"
              max="100"
              value={form.discountValue}
              onChange={(e) => setForm((prev) => ({ ...prev, discountValue: Number(e.target.value) }))}
              className={`w-full ${inputClass(fieldErrors.discountValue)}`}
              aria-invalid={Boolean(fieldErrors.discountValue)}
              aria-describedby={fieldErrors.discountValue ? "campaign-discount-error" : undefined}
            />
            {fieldErrors.discountValue ? (
              <p id="campaign-discount-error" className="mt-1 text-xs text-red-500">
                {fieldErrors.discountValue}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="campaign-start-date" className="block text-sm font-medium dark:text-white mb-2">
              Start date
            </label>
            <input
              id="campaign-start-date"
              type="datetime-local"
              value={form.startDate}
              onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
              className={`w-full ${inputClass(false)}`}
            />
          </div>

          <div>
            <label htmlFor="campaign-end-date" className="block text-sm font-medium dark:text-white mb-2">
              End date
            </label>
            <input
              id="campaign-end-date"
              type="datetime-local"
              value={form.endDate}
              onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
              className={`w-full ${inputClass(fieldErrors.endDate)}`}
              aria-invalid={Boolean(fieldErrors.endDate)}
              aria-describedby={fieldErrors.endDate ? "campaign-end-date-error" : undefined}
            />
            {fieldErrors.endDate ? (
              <p id="campaign-end-date-error" className="mt-1 text-xs text-red-500">
                {fieldErrors.endDate}
              </p>
            ) : null}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="campaign-description" className="block text-sm font-medium dark:text-white mb-2">
              Description
            </label>
            <textarea
              id="campaign-description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="w-full min-h-[88px] px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={creating}
            className="md:col-span-2 yebone-btn-primary yebone-btn-lift disabled:opacity-50"
          >
            {creating ? "Creating..." : "Create campaign"}
          </button>
        </form>

        {campaignsError ? (
          <GrowthCommerceStatusBanner tone="error" title="Campaign list unavailable" message={campaignsError} />
        ) : campaigns.length === 0 ? (
          <GrowthCommerceStatusBanner
            tone="info"
            title="No campaigns yet"
            message="Create your first campaign using the form above."
          />
        ) : (
          <div className="grid gap-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.campaignId}
                className="yebone-surface rounded-2xl p-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3"
              >
                <div>
                  <p className="font-medium dark:text-white">{campaign.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {campaign.type} · {campaign.status} · {campaign.discountValue}
                    {campaign.discountType === "percentage" ? "%" : ""} off
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {campaign.status === "active" && (
                    <button
                      type="button"
                      onClick={() => handleStatus(campaign.campaignId, "paused")}
                      disabled={Boolean(actionLoadingId)}
                      aria-label={`Pause campaign ${campaign.name}`}
                      className="px-3 py-2 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                    >
                      {actionLoadingId === `${campaign.campaignId}:paused` ? "Pausing..." : "Pause"}
                    </button>
                  )}
                  {campaign.status === "paused" && (
                    <button
                      type="button"
                      onClick={() => handleStatus(campaign.campaignId, "active")}
                      disabled={Boolean(actionLoadingId)}
                      aria-label={`Resume campaign ${campaign.name}`}
                      className="px-3 py-2 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                    >
                      {actionLoadingId === `${campaign.campaignId}:active` ? "Resuming..." : "Resume"}
                    </button>
                  )}
                  {campaign.status === "draft" && (
                    <button
                      type="button"
                      onClick={() => handleStatus(campaign.campaignId, "scheduled")}
                      disabled={Boolean(actionLoadingId)}
                      aria-label={`Schedule campaign ${campaign.name}`}
                      className="px-3 py-2 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                    >
                      {actionLoadingId === `${campaign.campaignId}:scheduled` ? "Scheduling..." : "Schedule"}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDuplicate(campaign.campaignId)}
                    disabled={Boolean(actionLoadingId)}
                    aria-label={`Duplicate campaign ${campaign.name}`}
                    className="px-3 py-2 rounded-lg text-xs bg-gray-100 dark:bg-gray-800 disabled:opacity-50"
                  >
                    {actionLoadingId === `${campaign.campaignId}:duplicate` ? "Duplicating..." : "Duplicate"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </VendorDashboardLayout>
  );
};

export default VendorCampaignsPage;
