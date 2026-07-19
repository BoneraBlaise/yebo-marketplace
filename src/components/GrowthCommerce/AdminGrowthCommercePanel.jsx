import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  fetchAdminAmbassadors,
  fetchAdminCampaigns,
  fetchAdminHomepageSections,
  fetchAdminMarketingDashboard,
  fetchGrowthCommerceAvailability,
  fetchGrowthCommerceConfiguration,
  resolveGrowthCommerceErrorMessage,
  runCampaignAutomation,
  updateAdminHomepageSections,
  updateGrowthCommerceConfiguration,
} from "../../services/growthCommerceService";
import { GrowthCommerceStatusBanner } from "./growthCommerceUi";

const SECTION_LABELS = {
  heroBanner: "Hero Banner",
  featuredProducts: "Featured Products",
  trendingProducts: "Trending Products",
  flashSaleSection: "Flash Sale Section",
  campaignBanner: "Campaign Banner",
  topVendors: "Top Vendors",
  newArrivals: "New Arrivals",
  bestSellers: "Best Sellers",
};

const FEATURE_LABELS = {
  campaigns: "Campaigns",
  promotions: "Promotions",
  homepage: "Homepage Merchandising",
  affiliates: "Affiliates",
  ambassadors: "Ambassadors",
  marketingDashboard: "Marketing Dashboard",
  automation: "Campaign Automation",
  searchIntegration: "Search Integration",
  aiIntegration: "AI Integration",
};

const TABS = [
  { id: "campaigns", label: "Campaigns" },
  { id: "homepage", label: "Homepage" },
  { id: "promotions", label: "Promotions" },
  { id: "affiliates", label: "Affiliates" },
  { id: "ambassadors", label: "Ambassadors" },
  { id: "dashboard", label: "Marketing Dashboard" },
  { id: "configuration", label: "Configuration" },
];

const settleResult = (result, fallbackMessage) => {
  if (result.status === "fulfilled") {
    return { data: result.value, error: null };
  }
  return {
    data: null,
    error: resolveGrowthCommerceErrorMessage(result.reason, fallbackMessage),
  };
};

const AdminGrowthCommercePanel = () => {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [loading, setLoading] = useState(true);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [sectionErrors, setSectionErrors] = useState({});
  const [campaigns, setCampaigns] = useState([]);
  const [homepageSections, setHomepageSections] = useState({});
  const [dashboard, setDashboard] = useState(null);
  const [ambassadors, setAmbassadors] = useState([]);
  const [settings, setSettings] = useState(null);
  const [draftSettings, setDraftSettings] = useState({});
  const [saving, setSaving] = useState(false);
  const [automationRunning, setAutomationRunning] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    setSectionErrors({});

    try {
      const availability = await fetchGrowthCommerceAvailability();
      if (availability.disabled || !availability.available) {
        setFeatureDisabled(true);
        setCampaigns([]);
        setHomepageSections({});
        setDashboard(null);
        setAmbassadors([]);
        setSettings(null);
        setDraftSettings({});
        return;
      }

      setFeatureDisabled(false);

      const results = await Promise.allSettled([
        fetchAdminCampaigns(),
        fetchAdminHomepageSections(),
        fetchAdminMarketingDashboard(),
        fetchAdminAmbassadors(),
        fetchGrowthCommerceConfiguration(),
      ]);

      const [campaignRes, homepageRes, dashboardRes, ambassadorRes, configRes] = results.map((result, index) => {
        const messages = [
          "Unable to load campaigns",
          "Unable to load homepage settings",
          "Unable to load marketing dashboard",
          "Unable to load ambassadors",
          "Unable to load configuration",
        ];
        return settleResult(result, messages[index]);
      });

      const nextSectionErrors = {};
      if (campaignRes.error) nextSectionErrors.campaigns = campaignRes.error;
      if (homepageRes.error) nextSectionErrors.homepage = homepageRes.error;
      if (dashboardRes.error) nextSectionErrors.dashboard = dashboardRes.error;
      if (ambassadorRes.error) nextSectionErrors.ambassadors = ambassadorRes.error;
      if (configRes.error) nextSectionErrors.configuration = configRes.error;

      setSectionErrors(nextSectionErrors);
      setCampaigns(campaignRes.data?.data || []);
      setHomepageSections(homepageRes.data?.data?.sections || {});
      setDashboard(dashboardRes.data?.data || null);
      setAmbassadors(ambassadorRes.data?.data || []);

      const currentSettings = configRes.data?.data?.settings || {};
      setSettings(currentSettings);
      setDraftSettings(
        Object.fromEntries(
          Object.entries(currentSettings).map(([key, value]) => [key, Boolean(value?.enabled)])
        )
      );

      const errorCount = Object.keys(nextSectionErrors).length;
      if (errorCount === results.length) {
        setLoadError("Unable to load Growth Commerce data. Please try again.");
      } else if (errorCount > 0) {
        toast.warn("Some Growth Commerce sections could not be loaded.");
      }
    } catch (error) {
      setLoadError(resolveGrowthCommerceErrorMessage(error, "Unable to load Growth Commerce data"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const hasSettingChanges = useMemo(() => {
    if (!settings) return false;
    return Object.keys(FEATURE_LABELS).some(
      (key) => Boolean(settings[key]?.enabled) !== Boolean(draftSettings[key])
    );
  }, [settings, draftSettings]);

  const handleHomepageToggle = async (sectionKey) => {
    const next = {
      ...homepageSections,
      [sectionKey]: {
        ...homepageSections[sectionKey],
        enabled: !homepageSections[sectionKey]?.enabled,
      },
    };
    try {
      await updateAdminHomepageSections(next);
      setHomepageSections(next);
      toast.success(`${SECTION_LABELS[sectionKey] || sectionKey} updated`);
    } catch (error) {
      toast.error(resolveGrowthCommerceErrorMessage(error, "Unable to update homepage section"));
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await updateGrowthCommerceConfiguration(
        Object.fromEntries(
          Object.entries(draftSettings).map(([key, enabled]) => [key, { enabled }])
        )
      );
      toast.success("Growth Commerce configuration saved");
      await loadData();
    } catch (error) {
      toast.error(resolveGrowthCommerceErrorMessage(error, "Unable to save configuration"));
    } finally {
      setSaving(false);
    }
  };

  const handleRunAutomation = async () => {
    setAutomationRunning(true);
    try {
      const result = await runCampaignAutomation();
      toast.success(`Automation processed ${result?.data?.processed || 0} campaign changes`);
      await loadData();
    } catch (error) {
      toast.error(resolveGrowthCommerceErrorMessage(error, "Automation run failed"));
    } finally {
      setAutomationRunning(false);
    }
  };

  const renderSectionError = (key) =>
    sectionErrors[key] ? (
      <GrowthCommerceStatusBanner tone="error" title="Unable to load this section" message={sectionErrors[key]} />
    ) : null;

  if (loading) {
    return (
      <div className="space-y-4" aria-live="polite" aria-busy="true">
        <p className="text-sm text-gray-500">Loading Growth Commerce...</p>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="yebone-surface rounded-2xl p-4 h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (featureDisabled) {
    return (
      <GrowthCommerceStatusBanner
        tone="warning"
        title="Growth Commerce is disabled"
        message="This feature is turned off for the marketplace. Existing storefront and Growth Platform tools continue to work normally."
        action={
          <button type="button" onClick={loadData} className="yebone-btn-primary yebone-btn-lift">
            Check again
          </button>
        }
      />
    );
  }

  if (loadError) {
    return (
      <GrowthCommerceStatusBanner
        tone="error"
        title="Growth Commerce unavailable"
        message={loadError}
        action={
          <button type="button" onClick={loadData} className="yebone-btn-primary yebone-btn-lift">
            Retry
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold dark:text-white">Growth Commerce</h2>
          <p className="text-sm text-gray-500 mt-1">
            Campaigns, homepage merchandising, affiliates, and marketplace marketing analytics.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRunAutomation}
          disabled={automationRunning}
          className="yebone-btn-primary yebone-btn-lift disabled:opacity-50"
        >
          {automationRunning ? "Running automation..." : "Run campaign automation"}
        </button>
      </div>

      <div
        role="tablist"
        aria-label="Growth Commerce sections"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`gc-tab-${tab.id}`}
            aria-selected={activeTab === tab.id}
            aria-controls={`gc-panel-${tab.id}`}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-yebone-primary text-white"
                : "bg-gray-100 dark:bg-gray-800 dark:text-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`gc-panel-${activeTab}`}
        aria-labelledby={`gc-tab-${activeTab}`}
      >
        {activeTab === "campaigns" && (
          <div className="space-y-4">
            {renderSectionError("campaigns")}
            {campaigns.length === 0 ? (
              <GrowthCommerceStatusBanner
                tone="info"
                title="No campaigns yet"
                message="Vendor campaigns will appear here once sellers create them."
              />
            ) : (
              <div className="grid gap-3">
                {campaigns.map((campaign) => (
                  <div
                    key={campaign.campaignId}
                    className="yebone-surface rounded-2xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3"
                  >
                    <div>
                      <p className="font-medium dark:text-white">{campaign.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {campaign.type} · {campaign.status} · Vendor {campaign.vendorId}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500">
                      Views {campaign.analytics?.views || 0} · Orders {campaign.analytics?.orders || 0}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "homepage" && (
          <div className="space-y-4">
            {renderSectionError("homepage")}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(SECTION_LABELS).map(([key, label]) => (
                <label
                  key={key}
                  htmlFor={`homepage-section-${key}`}
                  className="yebone-surface rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="text-sm font-medium dark:text-white">{label}</span>
                  <input
                    id={`homepage-section-${key}`}
                    type="checkbox"
                    className="accent-yebone-primary h-5 w-5"
                    checked={Boolean(homepageSections[key]?.enabled)}
                    onChange={() => handleHomepageToggle(key)}
                  />
                </label>
              ))}
            </div>
          </div>
        )}

        {activeTab === "promotions" && (
          <GrowthCommerceStatusBanner
            tone="info"
            title="Promotion validation"
            message="Promotion validation reuses the Growth Platform engine. Configure campaign discount rules from vendor campaigns and validate at checkout through existing promotion APIs."
          />
        )}

        {activeTab === "affiliates" && (
          <GrowthCommerceStatusBanner
            tone="info"
            title="Affiliate links"
            message="Affiliate links extend the Growth referral system. Users generate share links from their referral dashboard; commission tracking remains in the Growth reward ledger."
          />
        )}

        {activeTab === "ambassadors" && (
          <div className="space-y-4">
            {renderSectionError("ambassadors")}
            {ambassadors.length === 0 ? (
              <GrowthCommerceStatusBanner
                tone="info"
                title="No ambassadors registered yet"
                message="Ambassador profiles will appear here when users opt in."
              />
            ) : (
              <div className="grid gap-3">
                {ambassadors.map((ambassador) => (
                  <div key={ambassador.userId} className="yebone-surface rounded-2xl p-4">
                    <p className="font-medium dark:text-white">{ambassador.displayName}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {ambassador.userId} · Campaigns {ambassador.campaignIds?.length || 0}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "dashboard" && (
          <div className="space-y-4">
            {renderSectionError("dashboard")}
            {!dashboard ? (
              <GrowthCommerceStatusBanner
                tone="info"
                title="No dashboard metrics yet"
                message="Marketplace marketing metrics will appear here once campaigns generate activity."
              />
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                <div className="yebone-surface rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Active campaigns</p>
                  <p className="text-2xl font-semibold dark:text-white">{dashboard.activeCampaigns}</p>
                </div>
                <div className="yebone-surface rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Views</p>
                  <p className="text-2xl font-semibold dark:text-white">{dashboard.marketplaceMetrics?.views || 0}</p>
                </div>
                <div className="yebone-surface rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Orders</p>
                  <p className="text-2xl font-semibold dark:text-white">{dashboard.marketplaceMetrics?.orders || 0}</p>
                </div>
                <div className="yebone-surface rounded-2xl p-4">
                  <p className="text-xs text-gray-500">Revenue</p>
                  <p className="text-2xl font-semibold dark:text-white">{dashboard.marketplaceMetrics?.revenue || 0}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "configuration" && (
          <div className="space-y-4">
            {renderSectionError("configuration")}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {Object.entries(FEATURE_LABELS).map(([key, label]) => (
                <label
                  key={key}
                  htmlFor={`gc-config-${key}`}
                  className="yebone-surface rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <span className="text-sm font-medium dark:text-white">{label}</span>
                  <input
                    id={`gc-config-${key}`}
                    type="checkbox"
                    className="accent-yebone-primary h-5 w-5"
                    checked={Boolean(draftSettings[key])}
                    onChange={() =>
                      setDraftSettings((prev) => ({ ...prev, [key]: !prev[key] }))
                    }
                  />
                </label>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSaveSettings}
              disabled={!hasSettingChanges || saving}
              className="yebone-btn-primary yebone-btn-lift disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save configuration"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminGrowthCommercePanel;
