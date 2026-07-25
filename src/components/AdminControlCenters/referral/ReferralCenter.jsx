import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterShell,
  ControlCenterSkeleton,
  ControlCenterTabs,
  DataTable,
  MetricCard,
  StickySaveBar,
  ToggleSwitch,
} from "../shell/ControlCenterShell";
import { PLATFORM_CATEGORIES, formatCurrency } from "../constants/platformCatalog";
import {
  fetchPlatformConfiguration,
  fetchReferralAdminDashboard,
  updatePlatformConfigurationSection,
  updateReferralCodeAction,
} from "../../../services/platformConfigurationService";

const TABS = [
  { id: "general", label: "General Settings" },
  { id: "category", label: "Category Commission" },
  { id: "referrers", label: "Top Referrers" },
  { id: "codes", label: "Referral Codes" },
  { id: "fraud", label: "Fraud Detection" },
];

const ReferralCenter = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState("");
  const [referral, setReferral] = useState(null);
  const [initialReferral, setInitialReferral] = useState(null);
  const [dashboard, setDashboard] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [configRes, dashRes] = await Promise.all([
        fetchPlatformConfiguration(),
        fetchReferralAdminDashboard(),
      ]);
      const settings = configRes?.data?.platform?.businessValues?.referral || {};
      setReferral(settings);
      setInitialReferral(JSON.parse(JSON.stringify(settings)));
      setDashboard(dashRes?.data || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load referral center");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(
    () => JSON.stringify(referral) !== JSON.stringify(initialReferral),
    [referral, initialReferral]
  );

  const updateReferral = (field, value) => {
    setReferral((prev) => ({ ...prev, [field]: value }));
  };

  const updateCategoryRate = (categoryId, value) => {
    setReferral((prev) => ({
      ...prev,
      categoryRates: { ...prev.categoryRates, [categoryId]: Number(value) },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePlatformConfigurationSection("referral", referral, reason.trim());
      toast.success("Referral settings saved");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save referral settings");
    } finally {
      setSaving(false);
    }
  };

  const handleCodeAction = async (id, action) => {
    try {
      await updateReferralCodeAction(id, action);
      toast.success(`Referral code ${action}d`);
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Action failed");
    }
  };

  const fraud = dashboard?.fraud || {};

  return (
    <ControlCenterShell
      title="Referral Center"
      subtitle="Manage referral commissions, codes, payouts, and fraud signals."
    >
      <ControlCenterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <>
          {activeTab === "general" && referral && (
            <div className="admin-cc-grid admin-cc-grid--3">
              {[
                ["minPayout", "Minimum payout"],
                ["maxPayout", "Maximum payout"],
                ["commissionCap", "Commission cap"],
                ["cookieDurationDays", "Cookie duration (days)"],
                ["linkExpirationDays", "Link expiration (days)"],
              ].map(([key, label]) => (
                <ControlCenterCard key={key}>
                  <div className="admin-cc-field">
                    <label>{label}</label>
                    <input
                      type="number"
                      value={referral[key] ?? 0}
                      onChange={(e) => updateReferral(key, Number(e.target.value))}
                    />
                  </div>
                </ControlCenterCard>
              ))}
            </div>
          )}

          {activeTab === "category" && referral && (
            <div className="admin-cc-grid admin-cc-grid--3">
              {PLATFORM_CATEGORIES.map((category) => (
                <ControlCenterCard key={category.id}>
                  <div className="admin-cc-field">
                    <label>{category.label} (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={referral.categoryRates?.[category.id] ?? 0}
                      onChange={(e) => updateCategoryRate(category.id, e.target.value)}
                    />
                  </div>
                </ControlCenterCard>
              ))}
            </div>
          )}

          {activeTab === "referrers" && (
            <DataTable
              columns={[
                { key: "name", label: "Referrer" },
                { key: "referralCode", label: "Code" },
                { key: "clicks", label: "Clicks" },
                { key: "orders", label: "Orders" },
                { key: "revenue", label: "Revenue", render: (row) => formatCurrency(row.revenue) },
                {
                  key: "commissionEarned",
                  label: "Commission",
                  render: (row) => formatCurrency(row.commissionEarned),
                },
                {
                  key: "pendingPayout",
                  label: "Pending payout",
                  render: (row) => formatCurrency(row.pendingPayout),
                },
              ]}
              rows={dashboard?.topReferrers || []}
              emptyMessage="No referrers yet"
            />
          )}

          {activeTab === "codes" && (
            <DataTable
              columns={[
                { key: "referralCode", label: "Code" },
                { key: "name", label: "User" },
                { key: "clicks", label: "Clicks" },
                { key: "orders", label: "Orders" },
                {
                  key: "isActive",
                  label: "Status",
                  render: (row) => (row.isActive ? "Active" : "Disabled"),
                },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) => (
                    <div className="flex flex-wrap gap-2">
                      {["disable", "enable", "reset", "delete"].map((action) => (
                        <button
                          key={action}
                          type="button"
                          className="text-xs font-medium text-yebone-primary min-h-[36px] px-2"
                          onClick={() => handleCodeAction(row.id, action)}
                        >
                          {action}
                        </button>
                      ))}
                    </div>
                  ),
                },
              ]}
              rows={dashboard?.codes || []}
              emptyMessage="No referral codes"
            />
          )}

          {activeTab === "fraud" && (
            <div className="space-y-4">
              <div className="admin-cc-grid admin-cc-grid--3">
                <MetricCard label="Self purchase" value={fraud.summary?.selfPurchase || 0} />
                <MetricCard label="Duplicate IP" value={fraud.summary?.duplicateIp || 0} />
                <MetricCard label="Blocked referrals" value={fraud.summary?.blocked || 0} />
              </div>
              <DataTable
                columns={[
                  { key: "type", label: "Signal" },
                  { key: "referralCode", label: "Referral" },
                  { key: "orderId", label: "Order" },
                  { key: "severity", label: "Severity" },
                ]}
                rows={(fraud.suspicious || []).map((item, index) => ({ ...item, id: index }))}
                emptyMessage="No suspicious activity detected"
              />
              <DataTable
                columns={[
                  { key: "referralCode", label: "Code" },
                  { key: "severity", label: "Status" },
                ]}
                rows={(fraud.blockedReferrals || []).map((item, index) => ({ ...item, id: index }))}
                emptyMessage="No blocked referrals"
              />
            </div>
          )}
        </>
      )}

      <StickySaveBar
        dirty={dirty && (activeTab === "general" || activeTab === "category")}
        saving={saving}
        onSave={handleSave}
        onDiscard={() => setReferral(JSON.parse(JSON.stringify(initialReferral)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default ReferralCenter;
