import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterShell,
  ControlCenterSkeleton,
  ControlCenterTabs,
  DraftPublishBar,
  WorkflowStatusBar,
} from "../shell/ControlCenterShell";
import { formatCurrency } from "../constants/platformCatalog";
import {
  fetchConfigurationWorkflow,
  fetchPlatformConfiguration,
  fetchPlatformConfigurationAudit,
  publishPlatformConfiguration,
  updatePlatformConfigurationSection,
} from "../../../services/platformConfigurationService";

const SECTIONS = [
  { id: "pricing", label: "Platform Pricing" },
  { id: "commissions", label: "Commissions" },
  { id: "referral", label: "Referral" },
  { id: "ai", label: "AI Products" },
  { id: "delivery", label: "Delivery" },
  { id: "domains", label: "Domain Configs" },
  { id: "audit", label: "Version History" },
];

const PlatformConfigurationCenter = () => {
  const [activeTab, setActiveTab] = useState("pricing");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [workflow, setWorkflow] = useState(null);
  const [reason, setReason] = useState("");
  const [aggregate, setAggregate] = useState(null);
  const [pricing, setPricing] = useState(null);
  const [initialPricing, setInitialPricing] = useState(null);
  const [auditLog, setAuditLog] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [configRes, auditRes, workflowRes] = await Promise.all([
        fetchPlatformConfiguration(),
        fetchPlatformConfigurationAudit(30),
        fetchConfigurationWorkflow(),
      ]);
      setAggregate(configRes?.data || null);
      const values =
        configRes?.data?.platform?.draftBusinessValues?.pricing ||
        configRes?.data?.workflow?.draft?.businessValues?.pricing ||
        configRes?.data?.platform?.businessValues?.pricing ||
        {};
      setPricing(values);
      setInitialPricing(JSON.parse(JSON.stringify(values)));
      setAuditLog(auditRes?.data || []);
      setWorkflow(workflowRes?.data || configRes?.data?.workflow || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load platform configuration");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(
    () => JSON.stringify(pricing) !== JSON.stringify(initialPricing),
    [pricing, initialPricing]
  );

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      await updatePlatformConfigurationSection("pricing", pricing, reason.trim());
      toast.success("Platform pricing draft saved");
      setReason("");
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
      if (dirty) await updatePlatformConfigurationSection("pricing", pricing, reason.trim());
      await publishPlatformConfiguration(reason.trim());
      toast.success("Platform configuration published");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to publish");
    } finally {
      setPublishing(false);
    }
  };

  const businessValues = aggregate?.platform?.businessValues || {};
  const domains = aggregate?.domains || {};

  return (
    <ControlCenterShell
      title="Platform Configuration"
      subtitle={`Version ${aggregate?.platform?.version || 1} — save draft, review, then publish to production.`}
    >
      <WorkflowStatusBar workflow={workflow} />
      <ControlCenterTabs tabs={SECTIONS} active={activeTab} onChange={setActiveTab} />

      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <>
          {activeTab === "pricing" && pricing && (
            <div className="admin-cc-grid admin-cc-grid--3">
              {[
                ["verificationPrice", "Verification price"],
                ["featuredPrice", "Featured price"],
                ["sponsoredPrice", "Sponsored price"],
                ["searchBoostPrice", "Search boost price"],
                ["auctionFee", "Auction fee (%)"],
                ["flashSaleFee", "Flash sale fee (%)"],
                ["eventListingPrice", "Event listing price"],
                ["vendorSubscriptionMonthly", "Vendor subscription / month"],
              ].map(([key, label]) => (
                <ControlCenterCard key={key}>
                  <div className="admin-cc-field">
                    <label>{label}</label>
                    <input
                      type="number"
                      value={pricing[key] ?? 0}
                      onChange={(e) => setPricing((prev) => ({ ...prev, [key]: Number(e.target.value) }))}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {key.includes("Fee") ? `${pricing[key]}%` : formatCurrency(pricing[key])}
                  </p>
                </ControlCenterCard>
              ))}
            </div>
          )}

          {activeTab === "commissions" && (
            <ControlCenterCard>
              <pre className="text-xs overflow-auto max-h-96 dark:text-gray-200">
                {JSON.stringify(businessValues.categoryCommissions, null, 2)}
              </pre>
            </ControlCenterCard>
          )}

          {activeTab === "referral" && (
            <ControlCenterCard>
              <pre className="text-xs overflow-auto max-h-96 dark:text-gray-200">
                {JSON.stringify(businessValues.referral, null, 2)}
              </pre>
            </ControlCenterCard>
          )}

          {activeTab === "ai" && (
            <ControlCenterCard>
              <pre className="text-xs overflow-auto max-h-96 dark:text-gray-200">
                {JSON.stringify(businessValues.aiProducts, null, 2)}
              </pre>
            </ControlCenterCard>
          )}

          {activeTab === "delivery" && (
            <ControlCenterCard>
              <pre className="text-xs overflow-auto max-h-96 dark:text-gray-200">
                {JSON.stringify(domains.delivery?.settings || businessValues.deliveryPricing, null, 2)}
              </pre>
            </ControlCenterCard>
          )}

          {activeTab === "domains" && (
            <div className="space-y-3">
              {Object.entries(domains).map(([key, value]) => (
                <ControlCenterCard key={key}>
                  <h3 className="font-semibold capitalize mb-2 dark:text-white">{key.replace(/([A-Z])/g, " $1")}</h3>
                  <pre className="text-xs overflow-auto max-h-48 dark:text-gray-200">
                    {JSON.stringify(value, null, 2)}
                  </pre>
                </ControlCenterCard>
              ))}
            </div>
          )}

          {activeTab === "audit" && (
            <ControlCenterCard>
              <ul className="space-y-2 text-sm">
                {auditLog.length ? (
                  auditLog
                    .slice()
                    .reverse()
                    .map((entry, index) => (
                      <li key={index} className="border-b border-gray-100 dark:border-gray-800 pb-2">
                        <span className="font-medium dark:text-white">{entry.action}</span>
                        <span className="text-gray-500"> · {entry.section}</span>
                        <span className="block text-xs text-gray-400">
                          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : "—"} · {entry.admin}
                        </span>
                      </li>
                    ))
                ) : (
                  <li className="text-gray-500">No configuration changes recorded yet.</li>
                )}
              </ul>
            </ControlCenterCard>
          )}
        </>
      )}

      <DraftPublishBar
        dirty={dirty && activeTab === "pricing"}
        saving={saving}
        publishing={publishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onDiscard={() => setPricing(JSON.parse(JSON.stringify(initialPricing)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default PlatformConfigurationCenter;
