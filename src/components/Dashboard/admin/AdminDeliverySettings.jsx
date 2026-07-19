import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineTruck } from "react-icons/hi";
import {
  fetchDeliveryAuditHistory,
  fetchDeliveryConfiguration,
  updateDeliveryConfiguration,
} from "../../../services/deliveryConfigurationService";

const SETTING_LABELS = {
  vendorDelivery: "Vendor Delivery",
  customerPickup: "Customer Pickup",
  yeboneDelivery: "Yebone Delivery",
  liveTracking: "Live Tracking",
  eta: "ETA",
  courierPhoneVisibility: "Courier Phone Visibility",
  customerPhoneVisibility: "Customer Phone Visibility",
  manualAssignment: "Manual Assignment",
  autoAssignment: "Auto Assignment",
  deliveryRatings: "Delivery Ratings",
};

const AdminDeliverySettings = () => {
  const [settings, setSettings] = useState(null);
  const [draft, setDraft] = useState({});
  const [auditLog, setAuditLog] = useState([]);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadConfiguration = useCallback(async () => {
    setLoading(true);
    try {
      const [configResponse, auditResponse] = await Promise.all([
        fetchDeliveryConfiguration(),
        fetchDeliveryAuditHistory(),
      ]);
      const currentSettings = configResponse?.data?.settings || {};
      setSettings(currentSettings);
      setDraft(
        Object.fromEntries(
          Object.entries(currentSettings).map(([key, value]) => [key, Boolean(value?.enabled)])
        )
      );
      setAuditLog(auditResponse?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load delivery settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadConfiguration();
  }, [loadConfiguration]);

  const hasChanges = useMemo(() => {
    if (!settings) return false;
    return Object.keys(SETTING_LABELS).some(
      (key) => Boolean(settings[key]?.enabled) !== Boolean(draft[key])
    );
  }, [settings, draft]);

  const handleToggle = (key) => {
    setDraft((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(draft).map(([key, enabled]) => [key, { enabled }])
      );
      await updateDeliveryConfiguration(payload, reason.trim());
      toast.success("Delivery configuration saved");
      setReason("");
      await loadConfiguration();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save delivery settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="admin-delivery" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-Poppins text-xl font-semibold dark:text-white flex items-center gap-2">
            <HiOutlineTruck className="text-yebone-primary" size={22} />
            Delivery settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Super Admin controls all delivery features. Changes apply immediately without restart.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || saving || loading}
          className="h-10 px-5 rounded-xl bg-yebone-primary text-white text-sm font-semibold disabled:opacity-50 yebone-btn-lift"
        >
          {saving ? "Saving..." : "Save configuration"}
        </button>
      </div>

      {loading ? (
        <div className="admin-skeleton h-48 rounded-xl" />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(SETTING_LABELS).map(([key, label]) => (
              <div key={key} className="vendor-form-section yebone-surface">
                <label className="flex items-center justify-between gap-3 cursor-pointer">
                  <div>
                    <p className="font-Poppins font-semibold text-sm dark:text-white">{label}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {key === "yeboneDelivery"
                        ? "Enable Yebone-managed delivery workflow"
                        : "Toggle without code changes or deployment"}
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 accent-yebone-primary"
                    checked={Boolean(draft[key])}
                    onChange={() => handleToggle(key)}
                    aria-label={`${label} toggle`}
                  />
                </label>
              </div>
            ))}
          </div>

          <div className="vendor-form-section yebone-surface">
            <label className="block text-sm font-semibold dark:text-white mb-2">
              Change reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Why are these settings changing?"
              className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-yebone-primary outline-none text-sm dark:text-white"
            />
          </div>

          <div className="vendor-form-section yebone-surface">
            <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Audit history</h3>
            {auditLog.length === 0 ? (
              <p className="text-sm text-gray-500">No configuration changes recorded yet.</p>
            ) : (
              <ul className="space-y-3">
                {auditLog
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <li
                      key={`${entry.setting}-${entry.timestamp}-${index}`}
                      className="text-sm border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0"
                    >
                      <div className="flex justify-between gap-3 dark:text-white">
                        <span className="font-medium">{SETTING_LABELS[entry.setting] || entry.setting}</span>
                        <span className="text-xs text-gray-400">
                          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {entry.oldValue?.enabled ? "Enabled" : "Disabled"} →{" "}
                        {entry.newValue?.enabled ? "Enabled" : "Disabled"} · Admin {entry.admin}
                        {entry.reason ? ` · ${entry.reason}` : ""}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default AdminDeliverySettings;
