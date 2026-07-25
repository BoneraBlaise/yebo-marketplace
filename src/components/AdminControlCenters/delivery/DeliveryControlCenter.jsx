import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterShell,
  ControlCenterSkeleton,
  ControlCenterTabs,
  MetricCard,
  StickySaveBar,
  ToggleSwitch,
} from "../shell/ControlCenterShell";
import { formatCurrency } from "../constants/platformCatalog";
import {
  fetchDeliveryAuditHistory,
  fetchDeliveryConfiguration,
  updateDeliveryConfiguration,
} from "../../../services/deliveryConfigurationService";

const SHIPPING_MODES = [
  { key: "vendorDelivery", label: "Vendor Shipping" },
  { key: "customerPickup", label: "Customer Pickup" },
  { key: "yeboneDelivery", label: "Yebone Delivery", comingSoon: true },
];

const TABS = [
  { id: "modes", label: "Shipping Modes" },
  { id: "pricing", label: "Pricing" },
  { id: "zones", label: "Delivery Zones" },
  { id: "partners", label: "Partners" },
];

const DeliveryControlCenter = () => {
  const [activeTab, setActiveTab] = useState("modes");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState("");
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState(null);
  const [auditLog, setAuditLog] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [configRes, auditRes] = await Promise.all([
        fetchDeliveryConfiguration(),
        fetchDeliveryAuditHistory(20),
      ]);
      const current = configRes?.data?.settings || {};
      setSettings(current);
      setDraft(JSON.parse(JSON.stringify(current)));
      setAuditLog(auditRes?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load delivery center");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(() => JSON.stringify(settings) !== JSON.stringify(draft), [settings, draft]);

  const toggleMode = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], enabled: !prev[key]?.enabled },
    }));
  };

  const updateNested = (section, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateDeliveryConfiguration(settings, reason.trim());
      toast.success("Delivery configuration saved");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save delivery settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ControlCenterShell
      title="Delivery Control Center"
      subtitle="Shipping modes, pricing, zones, and partner network — Yebone Delivery activates the full network."
    >
      <ControlCenterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : settings ? (
        <>
          {activeTab === "modes" && (
            <div className="space-y-3">
              {SHIPPING_MODES.map(({ key, label, comingSoon }) => (
                <ControlCenterCard key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold dark:text-white">{label}</p>
                    {comingSoon && !settings[key]?.enabled ? (
                      <p className="text-xs text-amber-600 mt-1">Coming Soon — one switch activates the delivery network</p>
                    ) : null}
                  </div>
                  <ToggleSwitch
                    enabled={Boolean(settings[key]?.enabled)}
                    onChange={() => toggleMode(key)}
                    label={`Toggle ${label}`}
                  />
                </ControlCenterCard>
              ))}
              <div className="admin-cc-grid admin-cc-grid--3">
                <MetricCard label="Live tracking" value={settings.liveTracking?.enabled ? "On" : "Off"} />
                <MetricCard label="Auto assignment" value={settings.autoAssignment?.enabled ? "On" : "Off"} />
                <MetricCard label="Delivery ratings" value={settings.deliveryRatings?.enabled ? "On" : "Off"} />
              </div>
            </div>
          )}

          {activeTab === "pricing" && (
            <div className="admin-cc-grid admin-cc-grid--3">
              {[
                ["baseFee", "Base fee"],
                ["perKm", "Per KM"],
                ["heavyPackage", "Heavy package"],
                ["nightFee", "Night fee"],
                ["expressFee", "Express fee"],
                ["largePackage", "Large package"],
              ].map(([key, label]) => (
                <ControlCenterCard key={key}>
                  <div className="admin-cc-field">
                    <label>{label}</label>
                    <input
                      type="number"
                      value={settings.pricing?.[key] ?? 0}
                      onChange={(e) => updateNested("pricing", key, Number(e.target.value))}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{formatCurrency(settings.pricing?.[key])}</p>
                </ControlCenterCard>
              ))}
            </div>
          )}

          {activeTab === "zones" && (
            <ControlCenterCard>
              <div className="admin-cc-field">
                <label>Supported districts (comma-separated)</label>
                <textarea
                  rows={3}
                  value={(settings.zones?.supportedDistricts || []).join(", ")}
                  onChange={(e) =>
                    updateNested(
                      "zones",
                      "supportedDistricts",
                      e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                    )
                  }
                />
              </div>
              <div className="admin-cc-field mt-3">
                <label>Coverage note</label>
                <input
                  type="text"
                  value={settings.zones?.coverageNote || ""}
                  onChange={(e) => updateNested("zones", "coverageNote", e.target.value)}
                />
              </div>
              <p className="text-sm text-gray-500 mt-3">Coverage map integrates with supported districts above.</p>
            </ControlCenterCard>
          )}

          {activeTab === "partners" && (
            <div className="space-y-3">
              <ControlCenterCard className="flex items-center justify-between">
                <div>
                  <p className="font-semibold dark:text-white">Future riders program</p>
                  <p className="text-xs text-gray-500">Prepare rider onboarding before network launch</p>
                </div>
                <ToggleSwitch
                  enabled={settings.partners?.futureRiders !== false}
                  onChange={(enabled) => updateNested("partners", "futureRiders", enabled)}
                  label="Toggle future riders"
                />
              </ControlCenterCard>
              <ControlCenterCard>
                <div className="admin-cc-field">
                  <label>Courier partners (comma-separated)</label>
                  <textarea
                    rows={3}
                    value={(settings.partners?.courierPartners || []).join(", ")}
                    onChange={(e) =>
                      updateNested(
                        "partners",
                        "courierPartners",
                        e.target.value.split(",").map((item) => item.trim()).filter(Boolean)
                      )
                    }
                  />
                </div>
              </ControlCenterCard>
              {auditLog.length ? (
                <ControlCenterCard>
                  <h3 className="font-semibold mb-2 dark:text-white">Recent changes</h3>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {auditLog.slice(-5).map((entry, index) => (
                      <li key={index}>
                        {entry.setting} · {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—"}
                      </li>
                    ))}
                  </ul>
                </ControlCenterCard>
              ) : null}
            </div>
          )}
        </>
      ) : null}

      <StickySaveBar
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        onDiscard={() => setSettings(JSON.parse(JSON.stringify(draft)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default DeliveryControlCenter;
