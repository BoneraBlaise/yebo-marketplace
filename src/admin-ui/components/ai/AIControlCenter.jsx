import React, { useState } from "react";
import { Card, Tabs, Badge } from "../../../design-system/components";
import {
  AICreditsCard, AIROICard, AIAnalyticsCard, AIJobCard, AIHistoryCard,
  AIProviderStatus, AIModelBadge, AIUsageMeter, AIQueueCard,
} from "../../../design-system/ai";
import { useAdminExperience } from "../../hooks/useAdminExperience";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const AIControlCenter = () => {
  const [tab, setTab] = useState("overview");
  const { getProviderMonitoring, getJobMonitoring, getCostMonitoring, getUsageMonitoring } = useAdminExperience();
  const providers = getProviderMonitoring();
  const jobs = getJobMonitoring();
  const costs = getCostMonitoring();
  const usage = getUsageMonitoring();

  logAdminUIDiagnostics("viewModel", { panel: "aiControl", jobs: jobs.total });

  return (
    <div aria-label="AI control center">
      <Tabs tabs={[
        { id: "overview", label: "Overview" },
        { id: "providers", label: "Providers" },
        { id: "jobs", label: "Jobs" },
        { id: "assets", label: "Assets" },
        { id: "history", label: "History" },
        { id: "analytics", label: "Analytics" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        {tab === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <AICreditsCard remaining={costs.creditsRemaining} allocated={costs.creditsConsumed + costs.creditsRemaining} />
            <AIROICard roi="—" />
            <AIAnalyticsCard usage={usage.commerce?.aiUsageCount || 0} credits={costs.creditsConsumed} />
          </div>
        )}
        {tab === "providers" && (
          <Card>
            <h3 className="font-semibold mb-3">Providers & Models</h3>
            {providers.map((p, i) => (
              <div key={i} className="flex items-center gap-2 mb-2">
                <AIProviderStatus provider={p.source || "Provider"} status="online" />
                <AIModelBadge model="preview-v2" />
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </Card>
        )}
        {tab === "jobs" && (
          <>
            <AIQueueCard queued={jobs.total || 0} running={0} />
            <AIJobCard jobId="platform-latest" status="idle" progress={0} />
          </>
        )}
        {tab === "assets" && (
          <Card aria-label="Assets"><p className="text-sm text-gray-500">Generated assets: {usage.infrastructure?.assetCount || 0}</p></Card>
        )}
        {tab === "history" && (
          <AIHistoryCard items={[{ id: 1, label: "Preview session" }, { id: 2, label: "Asset generated" }]} />
        )}
        {tab === "analytics" && (
          <Card>
            <h3 className="font-semibold mb-3">AI Usage Analytics</h3>
            <AIUsageMeter used={costs.creditsConsumed} total={costs.creditsConsumed + costs.creditsRemaining} />
            <div className="mt-4 space-y-1 text-sm">
              {Object.entries(costs.usageByService || {}).map(([svc, count]) => (
                <div key={svc} className="flex justify-between"><span>{svc}</span><span>{count}</span></div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIControlCenter;
