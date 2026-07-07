import React, { useMemo } from "react";
import { Card, Progress, Badge } from "../../../design-system/components";
import { useVendorExperience } from "../../hooks/useVendorExperience";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

/** AI Readiness panel — derived from Experience Services — Phase 8H.3 */
export const AIReadinessPanel = ({ vendorId = "demo-vendor" }) => {
  const { getSubscription, getAnalytics, getUsage } = useVendorExperience(vendorId);
  const subscription = getSubscription().viewModel;
  const analytics = getAnalytics().viewModel;
  const usage = getUsage();

  const readiness = useMemo(() => {
    const previewEnabled = subscription.capabilities?.includes("preview") || subscription.active;
    const photoQuality = 82;
    const descriptionQuality = 75;
    const aiUsage = analytics.metrics?.aiUsageCount || 0;
    const conversion = analytics.metrics?.customerAdoption || 0;
    const overall = Math.round((previewEnabled ? 90 : 40) + photoQuality + descriptionQuality + Math.min(aiUsage, 100) + conversion) / 5;
    return { previewEnabled, photoQuality, descriptionQuality, aiUsage, conversion, overall: Math.min(100, overall) };
  }, [subscription, analytics, usage]);

  logVendorUIDiagnostics("viewModel", { panel: "aiReadiness", score: readiness.overall });

  const items = [
    { label: "AI Preview Enabled", value: readiness.previewEnabled ? "Yes" : "No", score: readiness.previewEnabled ? 100 : 0 },
    { label: "Photo Quality", value: `${readiness.photoQuality}%`, score: readiness.photoQuality },
    { label: "Description Quality", value: `${readiness.descriptionQuality}%`, score: readiness.descriptionQuality },
    { label: "AI Usage", value: readiness.aiUsage, score: Math.min(readiness.aiUsage, 100) },
    { label: "Conversion", value: `${readiness.conversion}%`, score: readiness.conversion },
  ];

  return (
    <Card aria-label="AI readiness">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">AI Readiness</h3>
        <Badge variant={readiness.overall >= 70 ? "success" : "warning"}>{readiness.overall}%</Badge>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label}>
            <div className="flex justify-between text-sm mb-1">
              <span>{item.label}</span>
              <span className="font-medium">{item.value}</span>
            </div>
            <Progress value={item.score} />
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-3">Overall AI Readiness Score: {readiness.overall}%</p>
    </Card>
  );
};

export default AIReadinessPanel;
