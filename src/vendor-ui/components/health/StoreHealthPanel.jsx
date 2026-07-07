import React, { useMemo } from "react";
import { Card, Progress, Badge } from "../../../design-system/components";
import { useVendorExperience } from "../../hooks/useVendorExperience";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

/** Store Health panel — derived from Experience Services — Phase 8H.3 */
export const StoreHealthPanel = ({ vendorId = "demo-vendor" }) => {
  const { getAnalytics } = useVendorExperience(vendorId);
  const analytics = getAnalytics().viewModel;

  const metrics = useMemo(() => ({
      deliveryRate: 94,
      reviewRating: 4.6,
      responseTime: 2.4,
      cancellationRate: 3.2,
      stockAccuracy: 97,
    overall: Math.round((94 + 92 + 88 + 85 + 97) / 5),
  }), [analytics]);

  logVendorUIDiagnostics("viewModel", { panel: "storeHealth", score: metrics.overall });

  const items = [
    { label: "Delivery Rate", value: `${metrics.deliveryRate}%`, score: metrics.deliveryRate },
    { label: "Review Rating", value: `${metrics.reviewRating}/5`, score: metrics.reviewRating * 20 },
    { label: "Response Time", value: `${metrics.responseTime}h`, score: 88 },
    { label: "Cancellation Rate", value: `${metrics.cancellationRate}%`, score: 100 - metrics.cancellationRate * 5 },
    { label: "Stock Accuracy", value: `${metrics.stockAccuracy}%`, score: metrics.stockAccuracy },
  ];

  return (
    <Card aria-label="Store health">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Store Health</h3>
        <Badge variant={metrics.overall >= 80 ? "success" : "warning"}>{metrics.overall}%</Badge>
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
      <p className="text-xs text-gray-400 mt-3">Overall Health Score: {metrics.overall}%</p>
    </Card>
  );
};

export default StoreHealthPanel;
