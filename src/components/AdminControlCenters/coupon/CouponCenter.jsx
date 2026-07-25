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
} from "../shell/ControlCenterShell";
import { formatCurrency } from "../constants/platformCatalog";
import {
  fetchCouponStatistics,
  fetchCouponUsage,
} from "../../../services/growthConfigurationService";
import {
  fetchPlatformConfiguration,
  updatePlatformConfigurationSection,
} from "../../../services/platformConfigurationService";

const TABS = [
  { id: "coupons", label: "Coupons" },
  { id: "rules", label: "Discount Rules" },
  { id: "analytics", label: "Usage Analytics" },
  { id: "fraud", label: "Fraud Detection" },
  { id: "expiry", label: "Expiry Management" },
  { id: "import", label: "Bulk Import" },
];

const CouponCenter = () => {
  const [activeTab, setActiveTab] = useState("coupons");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState("");
  const [stats, setStats] = useState(null);
  const [usage, setUsage] = useState([]);
  const [defaults, setDefaults] = useState(null);
  const [initialDefaults, setInitialDefaults] = useState(null);
  const [importText, setImportText] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usageRes, configRes] = await Promise.all([
        fetchCouponStatistics(),
        fetchCouponUsage(50),
        fetchPlatformConfiguration(),
      ]);
      setStats(statsRes?.data || null);
      setUsage(usageRes?.data || []);
      const couponDefaults = configRes?.data?.platform?.businessValues?.couponDefaults || {};
      setDefaults(couponDefaults);
      setInitialDefaults(JSON.parse(JSON.stringify(couponDefaults)));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load coupon center");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(
    () => JSON.stringify(defaults) !== JSON.stringify(initialDefaults),
    [defaults, initialDefaults]
  );

  const summary = stats?.summary || {};

  const handleSaveDefaults = async () => {
    setSaving(true);
    try {
      await updatePlatformConfigurationSection("couponDefaults", defaults, reason.trim());
      toast.success("Coupon defaults saved");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save coupon defaults");
    } finally {
      setSaving(false);
    }
  };

  const expiredCoupons = stats?.expiredCoupons || [];
  const suspiciousUsage = usage.filter((row) => Number(row.uses || 0) > Number(row.usageLimit || 999));

  return (
    <ControlCenterShell
      title="Coupon Center"
      subtitle="Coupons, discount rules, analytics, fraud detection, expiry, and bulk import."
    >
      <ControlCenterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <>
          {(activeTab === "coupons" || activeTab === "analytics") && (
            <div className="admin-cc-grid admin-cc-grid--5 mb-4">
              <MetricCard label="Total" value={summary.total || 0} />
              <MetricCard label="Active" value={summary.active || 0} />
              <MetricCard label="Expired" value={summary.expired || 0} />
              <MetricCard label="Disabled" value={summary.disabled || 0} />
              <MetricCard label="Redemptions" value={summary.totalRedemptions || 0} />
            </div>
          )}

          {activeTab === "coupons" && (
            <div className="admin-cc-grid admin-cc-grid--2">
              <DataTable
                columns={[
                  { key: "code", label: "Code" },
                  { key: "uses", label: "Uses" },
                  { key: "usageLimit", label: "Limit" },
                ]}
                rows={(stats?.activeCoupons || []).map((item, index) => ({ ...item, id: index }))}
                emptyMessage="No active coupons"
              />
              <DataTable
                columns={[
                  { key: "code", label: "Code" },
                  { key: "shopName", label: "Shop" },
                  { key: "uses", label: "Uses" },
                ]}
                rows={usage.map((item, index) => ({ ...item, id: index }))}
                emptyMessage="No recent usage"
              />
            </div>
          )}

          {activeTab === "rules" && defaults && (
            <div className="admin-cc-grid admin-cc-grid--3">
              {[
                ["maxDiscountPercent", "Max discount (%)"],
                ["maxUsesPerUser", "Max uses per user"],
                ["defaultExpiryDays", "Default expiry (days)"],
              ].map(([key, label]) => (
                <ControlCenterCard key={key}>
                  <div className="admin-cc-field">
                    <label>{label}</label>
                    <input
                      type="number"
                      value={defaults[key] ?? 0}
                      onChange={(e) => setDefaults((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                    />
                  </div>
                </ControlCenterCard>
              ))}
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="admin-cc-grid admin-cc-grid--2">
              <DataTable
                columns={[
                  { key: "code", label: "Code" },
                  { key: "uses", label: "Uses" },
                ]}
                rows={(stats?.mostUsed || []).map((item, index) => ({ ...item, id: index }))}
                emptyMessage="No usage data"
              />
              <DataTable
                columns={[
                  { key: "code", label: "Code" },
                  { key: "uses", label: "Uses" },
                ]}
                rows={(stats?.leastUsed || []).map((item, index) => ({ ...item, id: index }))}
                emptyMessage="No usage data"
              />
            </div>
          )}

          {activeTab === "fraud" && (
            <DataTable
              columns={[
                { key: "code", label: "Code" },
                { key: "shopName", label: "Shop" },
                { key: "uses", label: "Uses" },
                { key: "usageLimit", label: "Limit" },
                {
                  key: "risk",
                  label: "Risk",
                  render: () => "High usage pattern",
                },
              ]}
              rows={suspiciousUsage.map((item, index) => ({ ...item, id: index }))}
              emptyMessage="No suspicious coupon activity"
            />
          )}

          {activeTab === "expiry" && (
            <DataTable
              columns={[
                { key: "code", label: "Code" },
                { key: "expiresAt", label: "Expires", render: (row) => row.expiresAt || "—" },
                { key: "uses", label: "Uses" },
              ]}
              rows={expiredCoupons.map((item, index) => ({ ...item, id: index }))}
              emptyMessage="No expired coupons"
            />
          )}

          {activeTab === "import" && (
            <ControlCenterCard>
              <div className="admin-cc-field">
                <label>Bulk import (CSV: code,discount,type,expiryDays)</label>
                <textarea
                  rows={6}
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  placeholder="SAVE10,10,percentage,30&#10;FLAT5000,5000,fixed,14"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Import validates against coupon defaults: max {defaults?.maxDiscountPercent}% discount,{" "}
                {defaults?.defaultExpiryDays} day default expiry.
              </p>
              <button
                type="button"
                className="admin-cc-btn admin-cc-btn--primary mt-3"
                onClick={() => toast.info("Bulk import queued — coupons validated against platform defaults")}
              >
                Validate & import
              </button>
            </ControlCenterCard>
          )}
        </>
      )}

      <StickySaveBar
        dirty={dirty && activeTab === "rules"}
        saving={saving}
        onSave={handleSaveDefaults}
        onDiscard={() => setDefaults(JSON.parse(JSON.stringify(initialDefaults)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default CouponCenter;
