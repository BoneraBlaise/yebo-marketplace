import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterEmpty,
  ControlCenterShell,
  ControlCenterSkeleton,
  ControlCenterTabs,
  DataTable,
  MetricCard,
  SimpleBarChart,
  StickySaveBar,
  ToggleSwitch,
} from "../shell/ControlCenterShell";
import { PLATFORM_CATEGORIES, formatCategoryLabel, formatCurrency } from "../constants/platformCatalog";
import {
  fetchCommissionAnalytics,
  fetchCommissionRules,
} from "../../../services/growthConfigurationService";
import {
  fetchCommissionHistory,
  fetchPlatformConfiguration,
  updatePlatformConfigurationSection,
} from "../../../services/platformConfigurationService";

const TABS = [
  { id: "platform", label: "Platform Commission" },
  { id: "categories", label: "Category Rules" },
  { id: "history", label: "History" },
  { id: "analytics", label: "Analytics" },
];

const CommissionCenter = () => {
  const [activeTab, setActiveTab] = useState("platform");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState("");
  const [categoryCommissions, setCategoryCommissions] = useState({});
  const [initialCommissions, setInitialCommissions] = useState({});
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [rules, setRules] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [configRes, historyRes, analyticsRes, rulesRes] = await Promise.all([
        fetchPlatformConfiguration(),
        fetchCommissionHistory(100),
        fetchCommissionAnalytics(),
        fetchCommissionRules({ strategy: "CATEGORY", limit: 100 }),
      ]);
      const commissions = configRes?.data?.platform?.businessValues?.categoryCommissions || {};
      setCategoryCommissions(commissions);
      setInitialCommissions(JSON.parse(JSON.stringify(commissions)));
      setHistory(historyRes?.data || []);
      setAnalytics(analyticsRes?.data || null);
      setRules(rulesRes?.data?.items || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load commission center");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(
    () => JSON.stringify(categoryCommissions) !== JSON.stringify(initialCommissions),
    [categoryCommissions, initialCommissions]
  );

  const updateCategory = (categoryId, field, value) => {
    setCategoryCommissions((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePlatformConfigurationSection("categoryCommissions", categoryCommissions, reason.trim());
      toast.success("Commission settings saved — future orders will use updated rates");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save commission settings");
    } finally {
      setSaving(false);
    }
  };

  const historical = analytics?.historical || {};
  const runtime = analytics?.runtime || {};

  return (
    <ControlCenterShell
      title="Commission Center"
      subtitle="Configure platform and category commissions. Changes apply to future orders immediately."
    >
      <ControlCenterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <>
          {activeTab === "platform" && (
            <div className="admin-cc-grid admin-cc-grid--2">
              {PLATFORM_CATEGORIES.slice(0, 6).map((category) => {
                const config = categoryCommissions[category.id] || {};
                return (
                  <ControlCenterCard key={category.id}>
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <h3 className="font-semibold dark:text-white">{category.label}</h3>
                      <ToggleSwitch
                        enabled={config.enabled !== false}
                        onChange={(enabled) => updateCategory(category.id, "enabled", enabled)}
                        label={`Toggle ${category.label} commission`}
                      />
                    </div>
                    <div className="admin-cc-grid admin-cc-grid--2 gap-3">
                      <div className="admin-cc-field">
                        <label>Percentage (%)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={config.percentage ?? 10}
                          onChange={(e) => updateCategory(category.id, "percentage", Number(e.target.value))}
                        />
                      </div>
                      <div className="admin-cc-field">
                        <label>Fixed fee</label>
                        <input
                          type="number"
                          min="0"
                          value={config.fixedFee ?? 0}
                          onChange={(e) => updateCategory(category.id, "fixedFee", Number(e.target.value))}
                        />
                      </div>
                      <div className="admin-cc-field">
                        <label>Minimum fee</label>
                        <input
                          type="number"
                          min="0"
                          value={config.minFee ?? 0}
                          onChange={(e) => updateCategory(category.id, "minFee", Number(e.target.value))}
                        />
                      </div>
                      <div className="admin-cc-field">
                        <label>Maximum fee</label>
                        <input
                          type="number"
                          min="0"
                          value={config.maxFee ?? ""}
                          onChange={(e) =>
                            updateCategory(category.id, "maxFee", e.target.value === "" ? null : Number(e.target.value))
                          }
                        />
                      </div>
                    </div>
                  </ControlCenterCard>
                );
              })}
            </div>
          )}

          {activeTab === "categories" && (
            <div className="space-y-3">
              {PLATFORM_CATEGORIES.map((category) => {
                const config = categoryCommissions[category.id] || {};
                const rule = rules.find((item) => item.scope?.categoryId === category.id);
                return (
                  <ControlCenterCard key={category.id} className="flex flex-wrap items-center gap-4 justify-between">
                    <div>
                      <p className="font-semibold dark:text-white">{category.label}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Rule: {rule ? rule.name : "Not synced"} · Priority {config.priority ?? 5}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 items-center">
                      <div className="admin-cc-field !mb-0 w-24">
                        <label>Priority</label>
                        <input
                          type="number"
                          value={config.priority ?? 5}
                          onChange={(e) => updateCategory(category.id, "priority", Number(e.target.value))}
                        />
                      </div>
                      <ToggleSwitch
                        enabled={config.enabled !== false}
                        onChange={(enabled) => updateCategory(category.id, "enabled", enabled)}
                        label={`Toggle ${category.label}`}
                      />
                    </div>
                  </ControlCenterCard>
                );
              })}
            </div>
          )}

          {activeTab === "history" && (
            <DataTable
              columns={[
                { key: "vendor", label: "Vendor" },
                { key: "product", label: "Product" },
                { key: "category", label: "Category", render: (row) => formatCategoryLabel(row.category) },
                { key: "order", label: "Order" },
                { key: "commission", label: "Commission", render: (row) => formatCurrency(row.commission) },
                { key: "status", label: "Status" },
                {
                  key: "date",
                  label: "Date",
                  render: (row) => (row.date ? new Date(row.date).toLocaleString() : "—"),
                },
              ]}
              rows={history}
              emptyMessage="No commission history yet"
            />
          )}

          {activeTab === "analytics" && (
            <div className="space-y-4">
              <div className="admin-cc-grid admin-cc-grid--4">
                <MetricCard label="Commission revenue" value={formatCurrency(historical.totalCommissionRevenue)} />
                <MetricCard label="Rule executions" value={runtime.ruleExecutions || 0} />
                <MetricCard label="Top categories" value={historical.topCategories?.length || 0} />
                <MetricCard label="Top vendors" value={historical.topVendors?.length || 0} />
              </div>
              <div className="admin-cc-grid admin-cc-grid--2">
                <ControlCenterCard>
                  <h3 className="font-semibold mb-3 dark:text-white">Top earning categories</h3>
                  <SimpleBarChart items={historical.topCategories || []} />
                </ControlCenterCard>
                <ControlCenterCard>
                  <h3 className="font-semibold mb-3 dark:text-white">Top vendors</h3>
                  <SimpleBarChart items={historical.topVendors || []} />
                </ControlCenterCard>
              </div>
              <ControlCenterCard>
                <h3 className="font-semibold mb-3 dark:text-white">Monthly trend</h3>
                {(historical.monthlyTrend || []).length ? (
                  <SimpleBarChart
                    items={(historical.monthlyTrend || []).map((item) => ({
                      name: item.month,
                      value: item.value,
                    }))}
                  />
                ) : (
                  <ControlCenterEmpty title="No monthly trend data" />
                )}
              </ControlCenterCard>
            </div>
          )}
        </>
      )}

      <StickySaveBar
        dirty={dirty && (activeTab === "platform" || activeTab === "categories")}
        saving={saving}
        onSave={handleSave}
        onDiscard={() => setCategoryCommissions(JSON.parse(JSON.stringify(initialCommissions)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default CommissionCenter;
