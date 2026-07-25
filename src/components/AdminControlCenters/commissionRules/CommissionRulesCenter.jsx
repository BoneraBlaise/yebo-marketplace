import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterShell,
  ControlCenterSkeleton,
  StickySaveBar,
  ToggleSwitch,
} from "../shell/ControlCenterShell";
import AdminCommissionRules from "../../Dashboard/admin/AdminCommissionRules";
import {
  fetchPlatformConfiguration,
  updatePlatformConfigurationSection,
} from "../../../services/platformConfigurationService";

const CommissionRulesCenter = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState("");
  const [ruleEngine, setRuleEngine] = useState(null);
  const [initialRuleEngine, setInitialRuleEngine] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchPlatformConfiguration();
      const engine = response?.data?.platform?.businessValues?.ruleEngine || {};
      setRuleEngine(engine);
      setInitialRuleEngine(JSON.parse(JSON.stringify(engine)));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load rule engine settings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(
    () => JSON.stringify(ruleEngine) !== JSON.stringify(initialRuleEngine),
    [ruleEngine, initialRuleEngine]
  );

  const updateEngine = (field, value) => {
    setRuleEngine((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updatePlatformConfigurationSection("ruleEngine", ruleEngine, reason.trim());
      toast.success("Rule engine settings saved");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save rule engine");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ControlCenterShell
      title="Commission Rules"
      subtitle="Business rule engine — priority, stacking, exceptions, and seasonal overrides."
    >
      {loading ? (
        <ControlCenterSkeleton rows={2} />
      ) : ruleEngine ? (
        <div className="admin-cc-grid admin-cc-grid--3 mb-6">
          <ControlCenterCard>
            <div className="admin-cc-field">
              <label>Stacking mode</label>
              <select value={ruleEngine.stackingMode || "additive"} onChange={(e) => updateEngine("stackingMode", e.target.value)}>
                <option value="additive">Additive</option>
                <option value="highest_wins">Highest wins</option>
                <option value="exclusive">Exclusive</option>
              </select>
            </div>
          </ControlCenterCard>
          <ControlCenterCard>
            <div className="admin-cc-field">
              <label>Minimum commission</label>
              <input
                type="number"
                value={ruleEngine.minCommission ?? 0}
                onChange={(e) => updateEngine("minCommission", Number(e.target.value))}
              />
            </div>
          </ControlCenterCard>
          <ControlCenterCard>
            <div className="admin-cc-field">
              <label>Maximum commission</label>
              <input
                type="number"
                value={ruleEngine.maxCommission ?? ""}
                onChange={(e) =>
                  updateEngine("maxCommission", e.target.value === "" ? null : Number(e.target.value))
                }
              />
            </div>
          </ControlCenterCard>
          <ControlCenterCard className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Priority rules</p>
              <p className="text-xs text-gray-500">Higher priority overrides lower</p>
            </div>
            <ToggleSwitch
              enabled={ruleEngine.priorityRules?.enabled !== false}
              onChange={(enabled) =>
                updateEngine("priorityRules", { ...ruleEngine.priorityRules, enabled })
              }
              label="Toggle priority rules"
            />
          </ControlCenterCard>
          <ControlCenterCard className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Campaign overrides</p>
            </div>
            <ToggleSwitch
              enabled={ruleEngine.campaignOverrides?.enabled !== false}
              onChange={(enabled) =>
                updateEngine("campaignOverrides", { ...ruleEngine.campaignOverrides, enabled })
              }
              label="Toggle campaign overrides"
            />
          </ControlCenterCard>
          <ControlCenterCard className="flex items-center justify-between">
            <div>
              <p className="font-medium dark:text-white">Seasonal commission</p>
            </div>
            <ToggleSwitch
              enabled={ruleEngine.seasonalCommission?.enabled === true}
              onChange={(enabled) =>
                updateEngine("seasonalCommission", { ...ruleEngine.seasonalCommission, enabled })
              }
              label="Toggle seasonal commission"
            />
          </ControlCenterCard>
        </div>
      ) : null}

      <AdminCommissionRules />

      <StickySaveBar
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        onDiscard={() => setRuleEngine(JSON.parse(JSON.stringify(initialRuleEngine)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default CommissionRulesCenter;
