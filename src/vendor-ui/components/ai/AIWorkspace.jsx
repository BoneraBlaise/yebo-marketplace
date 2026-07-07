import React from "react";
import { Card, Tabs, Badge } from "../../../design-system/components";
import {
  AICreditsCard, AISubscriptionCard, AIROICard, AIAnalyticsCard,
  AIRecommendationCard, AIHistoryCard, AIUsageMeter, AIProviderStatus, AIModelBadge, AIJobCard,
} from "../../../design-system/ai";
import { useVendorExperience } from "../../hooks/useVendorExperience";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const AIWorkspace = ({ vendorId = "demo-vendor" }) => {
  const [tab, setTab] = React.useState("overview");
  const { getCredits, getSubscription, getROI, getAnalytics, getRecommendations, getUsage } = useVendorExperience(vendorId);

  const credits = getCredits().viewModel;
  const subscription = getSubscription().viewModel;
  const roi = getROI();
  const analytics = getAnalytics().viewModel;
  const recommendations = getRecommendations();
  const usage = getUsage();

  logVendorUIDiagnostics("component", { name: "AIWorkspace", tab });
  logVendorUIDiagnostics("viewModel", { credits: credits.remaining, plan: subscription.planLabel });

  const historyItems = (analytics.topItems || []).map((item, i) => ({
    id: i, label: item.ai_preview_type || item.name || `Preview ${i + 1}`,
  }));

  return (
    <div aria-label="AI workspace">
      <Tabs tabs={[
        { id: "overview", label: "Overview" },
        { id: "usage", label: "Usage" },
        { id: "history", label: "History" },
        { id: "providers", label: "Providers" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        {tab === "overview" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <AISubscriptionCard plan={subscription.planLabel || "Starter"} active={subscription.active} />
              <AICreditsCard remaining={credits.remaining} allocated={credits.allocated} />
              <AIROICard roi={roi.roiPercent ? `${roi.roiPercent}%` : "—"} revenue={roi.revenueLift} />
            </div>
            <AIAnalyticsCard usage={analytics.metrics?.aiUsageCount || 0} credits={analytics.metrics?.creditsConsumed || 0} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(recommendations.length ? recommendations : [{ message: "Add face_tryon to beauty products." }]).map((r, i) => (
                <AIRecommendationCard key={i} message={r.message || String(r)} />
              ))}
            </div>
          </>
        )}
        {tab === "usage" && (
          <Card>
            <h3 className="font-semibold mb-3">Preview Usage</h3>
            <AIUsageMeter used={credits.consumed} total={credits.allocated} />
            <p className="text-sm text-gray-500 mt-4">Total credits consumed: {usage.totalCredits || 0}</p>
            <div className="mt-3 space-y-1">
              {Object.entries(usage.byService || {}).map(([service, count]) => (
                <div key={service} className="flex justify-between text-sm"><span>{service}</span><span>{count}</span></div>
              ))}
            </div>
          </Card>
        )}
        {tab === "history" && (
          <AIHistoryCard items={historyItems.length ? historyItems : [{ id: 0, label: "No preview history yet" }]} />
        )}
        {tab === "providers" && (
          <Card>
            <h3 className="font-semibold mb-3">Provider & Model Status</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-2"><AIProviderStatus provider="Primary Provider" status="online" /><Badge variant="success">Active</Badge></div>
              <div className="flex items-center gap-2"><AIProviderStatus provider="Fallback Provider" status="online" /><Badge variant="default">Standby</Badge></div>
              <AIModelBadge model="preview-v2" />
              <AIJobCard jobId="latest" status="idle" progress={0} />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIWorkspace;
