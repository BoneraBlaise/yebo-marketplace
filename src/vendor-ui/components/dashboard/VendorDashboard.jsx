import React from "react";
import { Card, StatisticCard, Badge, Button } from "../../../design-system/components";
import {
  AICreditsCard, AIROICard, AIAnalyticsCard, AIRecommendationCard, AIProviderStatus,
} from "../../../design-system/ai";
import { Alert, Banner } from "../../../design-system/notifications";
import { useVendorExperience } from "../../hooks/useVendorExperience";
import { StoreHealthPanel } from "../health/StoreHealthPanel";
import { AIReadinessPanel } from "../health/AIReadinessPanel";
import { mockVendorStats } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const VendorDashboard = ({ vendorId = "demo-vendor" }) => {
  const { getDashboard, getCredits, getROI, getAnalytics, getRecommendations } = useVendorExperience(vendorId);
  const { viewModel } = getDashboard();
  const credits = getCredits().viewModel;
  const roi = getROI();
  const analytics = getAnalytics().viewModel;
  const recommendations = getRecommendations();

  logVendorUIDiagnostics("dashboard", { view: viewModel?.view, sections: viewModel?.sections?.length });
  logVendorUIDiagnostics("viewModel", { credits: credits?.remaining, roi: roi?.roiPercent });

  return (
    <div className="space-y-6" aria-label="Vendor dashboard">
      <Banner variant="info">Welcome to your vendor operating workspace.</Banner>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard label="Revenue" value={`$${mockVendorStats.revenue.toLocaleString()}`} trend="+12%" />
        <StatisticCard label="Orders" value={mockVendorStats.orders} trend="+8%" />
        <StatisticCard label="Products" value={mockVendorStats.products} />
        <StatisticCard label="Customers" value={mockVendorStats.customers} trend="+5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <AICreditsCard remaining={credits.remaining} allocated={credits.allocated} />
        <AIROICard roi={roi.roiPercent ? `${roi.roiPercent}%` : "—"} revenue={roi.revenueLift} />
        <AIAnalyticsCard usage={analytics.metrics?.aiUsageCount || 0} credits={analytics.metrics?.creditsConsumed || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <StoreHealthPanel vendorId={vendorId} />
        <AIReadinessPanel vendorId={vendorId} />
      </div>

      <Card aria-label="Analytics summary">
        <h3 className="font-semibold mb-3">Analytics Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">AI Usage</span><p className="font-bold">{analytics.metrics?.aiUsageCount || 0}</p></div>
          <div><span className="text-gray-500">Customer Adoption</span><p className="font-bold">{analytics.metrics?.customerAdoption || 0}%</p></div>
        </div>
      </Card>

      <Card aria-label="Notifications">
        <h3 className="font-semibold mb-3">Notifications</h3>
        <Alert variant="warning">3 orders pending confirmation</Alert>
        <div className="mt-2"><Alert variant="info">AI credits reset in 12 days</Alert></div>
      </Card>

      <section aria-label="Recommendations">
        <h3 className="font-semibold mb-3">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(recommendations.length ? recommendations : [{ message: "Enable wrist_tryon for watch products to boost conversions." }]).map((r, i) => (
            <AIRecommendationCard key={i} message={r.message || r.title || String(r)} />
          ))}
        </div>
      </section>

      <Card aria-label="Quick actions">
        <h3 className="font-semibold mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-2">
          <Button size="sm">Add Product</Button>
          <Button size="sm" variant="secondary">View Orders</Button>
          <Button size="sm" variant="secondary">AI Workspace</Button>
          <Button size="sm" variant="ghost">Generate Report</Button>
        </div>
      </Card>

      <div className="flex items-center gap-4 text-sm">
        <span className="text-gray-500">AI Health:</span>
        <AIProviderStatus provider="Primary" status="online" />
        <Badge variant="success">Healthy</Badge>
      </div>
    </div>
  );
};

export default VendorDashboard;
