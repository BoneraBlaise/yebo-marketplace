import React from "react";
import { Card, Button, EmptyState, LoadingState, ErrorState } from "../../../design-system/components";
import { Alert, Banner } from "../../../design-system/notifications";
import {
  AIPreviewCard, AIJobCard, AIHistoryCard, AIRecommendationCard, AIUsageMeter,
} from "../../../design-system/ai";
import { useCustomerExperience } from "../../hooks/useCustomerExperience";
import { logCustomerUIDiagnostics } from "../../diagnostics/CustomerUIDiagnostics";

export const AIExperiencePanel = ({ userId = "demo-user" }) => {
  logCustomerUIDiagnostics("component", { name: "AIExperiencePanel" });
  const { getPreviewSessions, getPreviewHistory, getGeneratedAssets, contracts } = useCustomerExperience(userId);

  const sessions = getPreviewSessions()?.previewSessions || [];
  const history = getPreviewHistory()?.viewModel?.items || [];
  const assets = getGeneratedAssets()?.assets || [];

  return (
    <section aria-label="AI Experience" className="space-y-4">
      <Card>
        <h3 className="font-semibold mb-2">✨ Preview with AI</h3>
        <p className="text-sm text-gray-600 mb-3">Placeholder — uses Experience Services only.</p>
        {sessions.length ? sessions.map((s) => (
          <AIPreviewCard key={s.sessionId} previewType={s.ai_preview_type || "preview"} status={s.status} />
        )) : <Button variant="secondary" size="sm">Start Preview</Button>}
      </Card>
      <AIHistoryPlaceholder items={history} />
      <AIAssetsPlaceholder assets={assets} />
      <AIJobsPlaceholder />
      <AIRecommendationsPlaceholder />
      <Card className="text-xs text-gray-400">
        <p>Available contracts: {Object.keys(contracts || {}).join(", ")}</p>
      </Card>
    </section>
  );
};

export const AIHistoryPlaceholder = ({ items = [] }) => (
  <Card aria-label="AI History">
    <h3 className="font-semibold mb-2">AI History</h3>
    {items.length ? <AIHistoryCard items={items.map((i, idx) => ({ id: i.id || idx, label: i.previewType || i.type || "Preview" }))} /> : (
      <EmptyState title="No AI history" description="Your AI preview history will appear here." />
    )}
  </Card>
);

export const AIAssetsPlaceholder = ({ assets = [] }) => (
  <Card aria-label="AI Assets">
    <h3 className="font-semibold mb-2">AI Assets</h3>
    {assets.length ? (
      <div className="grid grid-cols-2 gap-2">{assets.map((a) => (
        <div key={a.assetId} className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm">{a.assetType || "Asset"}</div>
      ))}</div>
    ) : <EmptyState title="No AI assets" description="Generated assets will appear here." />}
  </Card>
);

export const AIJobsPlaceholder = () => (
  <Card aria-label="AI Jobs">
    <h3 className="font-semibold mb-2">AI Jobs</h3>
    <AIJobCard jobId="job-placeholder" status="idle" progress={0} />
    <AIUsageMeter used={0} total={100} />
  </Card>
);

export const AIRecommendationsPlaceholder = () => (
  <Card aria-label="AI Recommendations">
    <h3 className="font-semibold mb-2">AI Recommendations</h3>
    <AIRecommendationCard message="Personalized product recommendations powered by AI will appear here." />
  </Card>
);

export const NotificationShowcase = () => (
  <section aria-label="Notification examples" className="space-y-3">
    <Alert variant="info">Informational alert for customer notifications.</Alert>
    <Banner variant="warning">Promotional banner placeholder.</Banner>
    <LoadingState message="Loading products..." />
    <ErrorState message="Unable to load data (placeholder)." retry={() => {}} />
  </section>
);

export default { AIExperiencePanel, AIHistoryPlaceholder, AIAssetsPlaceholder, AIJobsPlaceholder, AIRecommendationsPlaceholder, NotificationShowcase };
