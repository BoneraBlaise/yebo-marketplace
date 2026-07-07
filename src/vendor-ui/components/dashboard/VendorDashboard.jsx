import React from "react";
import { Card, StatisticCard, Badge, Button } from "../../../design-system/components";
import {
  AICreditsCard, AIROICard, AIAnalyticsCard, AIRecommendationCard, AIProviderStatus,
} from "../../../design-system/ai";
import { Alert, Banner } from "../../../design-system/notifications";
import { SectionHeader, polishClasses } from "../../../ui-polish";
import { useVendorExperience } from "../../hooks/useVendorExperience";
import { StoreHealthPanel } from "../health/StoreHealthPanel";
import { AIReadinessPanel } from "../health/AIReadinessPanel";
import { mockVendorStats } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";
import { RevenueChart, OrdersChart, ConversionChart } from "../../../design-system/charts";
import { AI_POWERED_BY } from "../../../ui-polish/brandConstants";

const chartData = [
  { name: "Mon", value: 4200, rate: 3.2 },
  { name: "Tue", value: 5100, rate: 3.8 },
  { name: "Wed", value: 4800, rate: 3.5 },
  { name: "Thu", value: 6200, rate: 4.1 },
  { name: "Fri", value: 7100, rate: 4.4 },
  { name: "Sat", value: 8900, rate: 5.2 },
  { name: "Sun", value: 7600, rate: 4.8 },
];

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
    <div className="space-y-6 md:space-y-8 yebone-fade-up" aria-label="Vendor dashboard">
      <SectionHeader title="Dashboard" subtitle="Your vendor operating workspace at a glance" />
      <Banner variant="info">Welcome to your vendor operating workspace.</Banner>

      <div className={polishClasses.statGrid}>
        <StatisticCard label="Revenue" value={`$${mockVendorStats.revenue.toLocaleString()}`} trend="+12%" />
        <StatisticCard label="Orders" value={mockVendorStats.orders} trend="+8%" />
        <StatisticCard label="Products" value={mockVendorStats.products} />
        <StatisticCard label="Customers" value={mockVendorStats.customers} trend="+5%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card aria-label="Revenue chart"><RevenueChart data={chartData} /></Card>
        <Card aria-label="Orders chart"><OrdersChart data={chartData} /></Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticCard label="Conversion Rate" value="4.2%" trend="+0.8%" />
        <StatisticCard label="Traffic (7d)" value="12.4K" trend="+15%" />
        <StatisticCard label="Growth" value="+18%" trend="vs last month" />
      </div>

      <Card aria-label="Conversion"><ConversionChart data={chartData} /></Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card aria-label="Recent orders">
          <h3 className="font-semibold mb-3">Recent Orders</h3>
          {["#ORD-1042 — $89.99", "#ORD-1041 — $199.99", "#ORD-1040 — $49.99"].map((o) => (
            <div key={o} className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-800 text-sm last:border-0"><span>{o.split(" — ")[0]}</span><span className="font-medium">{o.split(" — ")[1]}</span></div>
          ))}
        </Card>
        <Card aria-label="Low stock alerts">
          <h3 className="font-semibold mb-3">Low Stock</h3>
          <Alert variant="warning">Running Shoes — 2 left</Alert>
          <div className="mt-2"><Alert variant="warning">Skincare Set — 5 left</Alert></div>
        </Card>
      </div>

      <Card aria-label="Top products">
        <h3 className="font-semibold mb-3">Top Products</h3>
        <div className="space-y-2 text-sm">
          {["Wireless Headphones — 128 sold", "Smart Watch Pro — 96 sold", "Organic T-Shirt — 74 sold"].map((p) => (
            <div key={p} className="flex justify-between py-1"><span>{p.split(" — ")[0]}</span><Badge variant="success">{p.split(" — ")[1]}</Badge></div>
          ))}
        </div>
      </Card>

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
        <div className="mt-2"><Alert variant="info">AI credits reset in 12 days · {AI_POWERED_BY}</Alert></div>
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
