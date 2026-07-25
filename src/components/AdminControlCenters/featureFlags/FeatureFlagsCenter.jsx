import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterShell,
  ControlCenterSkeleton,
  DraftPublishBar,
  WorkflowStatusBar,
} from "../shell/ControlCenterShell";
import {
  fetchConfigurationWorkflow,
  fetchRuntimeFeatureFlags,
  publishPlatformConfiguration,
  updateRuntimeFeatureFlags,
} from "../../../services/platformConfigurationService";

const STATUSES = ["enabled", "disabled", "beta", "coming_soon", "internal"];

const FeatureFlagsCenter = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [flags, setFlags] = useState({});
  const [initialFlags, setInitialFlags] = useState({});
  const [workflow, setWorkflow] = useState(null);
  const [reason, setReason] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [flagsRes, workflowRes] = await Promise.all([
        fetchRuntimeFeatureFlags(),
        fetchConfigurationWorkflow(),
      ]);
      const current = flagsRes?.data || {};
      setFlags(current);
      setInitialFlags(JSON.parse(JSON.stringify(current)));
      setWorkflow(workflowRes?.data || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load feature flags");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(() => JSON.stringify(flags) !== JSON.stringify(initialFlags), [flags, initialFlags]);

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await updateRuntimeFeatureFlags(flags, reason.trim(), false);
      toast.success("Feature flag draft saved");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      if (dirty) await updateRuntimeFeatureFlags(flags, reason.trim(), false);
      await publishPlatformConfiguration(reason.trim());
      toast.success("Feature flags published");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to publish");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <ControlCenterShell
      title="Runtime Feature Flags"
      subtitle="Enable, disable, beta, coming soon, or internal — no deployment required."
    >
      <WorkflowStatusBar workflow={workflow} />

      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <div className="admin-cc-grid admin-cc-grid--2 gap-3">
          {Object.entries(flags).map(([id, config]) => (
            <ControlCenterCard key={id} className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold dark:text-white">{config.label || id}</p>
                <p className="text-xs text-gray-500 mt-1">{id}</p>
              </div>
              <select
                className="h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm"
                value={config.status || "enabled"}
                onChange={(e) =>
                  setFlags((prev) => ({
                    ...prev,
                    [id]: { ...prev[id], status: e.target.value },
                  }))
                }
                aria-label={`Status for ${config.label || id}`}
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </ControlCenterCard>
          ))}
        </div>
      )}

      <DraftPublishBar
        dirty={dirty}
        saving={saving}
        publishing={publishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscard={() => setFlags(JSON.parse(JSON.stringify(initialFlags)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default FeatureFlagsCenter;
