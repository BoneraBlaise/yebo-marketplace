import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineTrendingUp } from "react-icons/hi";
import {
  fetchGrowthAuditHistory,
  fetchGrowthConfiguration,
  updateGrowthConfiguration,
} from "../../../services/growthConfigurationService";

const SETTING_LABELS = {
  affiliate: "Affiliate Program",
  referral: "Referral Program",
  coupons: "Coupons",
  promotions: "Promotions",
  commissionRules: "Commission Rules",
  rewardLedger: "Reward Ledger",
};

const AdminGrowthSettings = () => {
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
        fetchGrowthConfiguration(),
        fetchGrowthAuditHistory(),
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
      toast.error(error?.response?.data?.message || "Unable to load growth settings");
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
      const payload = {
        settings: Object.fromEntries(
          Object.entries(draft).map(([key, enabled]) => [key, { enabled }])
        ),
      };
      await updateGrowthConfiguration(payload, reason.trim());
      toast.success("Growth configuration saved");
      setReason("");
      await loadConfiguration();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save growth settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section id="admin-growth" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-Poppins text-xl font-semibold dark:text-white flex items-center gap-2">
            <HiOutlineTrendingUp className="text-yebone-primary" size={22} />
            Growth settings
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Super Admin controls referral, affiliate, coupons, promotions, commission rules, and reward ledger.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={!hasChanges || saving}
          className="yebone-btn-primary yebone-btn-lift disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading growth configuration...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.entries(SETTING_LABELS).map(([key, label]) => (
              <label
                key={key}
                className="yebone-surface rounded-2xl p-4 flex items-center justify-between gap-3 cursor-pointer"
              >
                <span className="text-sm font-medium dark:text-white">{label}</span>
                <input
                  type="checkbox"
                  className="accent-yebone-primary h-5 w-5"
                  checked={Boolean(draft[key])}
                  onChange={() => handleToggle(key)}
                />
              </label>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Change reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Why are you changing these settings?"
              className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
            />
          </div>

          <div>
            <h3 className="text-sm font-semibold dark:text-white mb-3">Recent audit history</h3>
            {auditLog.length === 0 ? (
              <p className="text-sm text-gray-500">No configuration changes recorded yet.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {auditLog
                  .slice()
                  .reverse()
                  .map((entry, index) => (
                    <div
                      key={`${entry.timestamp}-${index}`}
                      className="text-xs rounded-xl border border-gray-100 dark:border-gray-800 p-3 dark:text-gray-300"
                    >
                      <p className="font-medium">{entry.action || entry.setting}</p>
                      <p className="text-gray-500 mt-1">
                        {entry.admin} · {new Date(entry.timestamp).toLocaleString()}
                        {entry.reason ? ` · ${entry.reason}` : ""}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default AdminGrowthSettings;
