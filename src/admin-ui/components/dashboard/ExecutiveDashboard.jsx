import React from "react";
import { Card, StatisticCard, Badge } from "../../../design-system/components";
import { Alert, Banner } from "../../../design-system/notifications";
import { AIProviderStatus, AIAnalyticsCard, AIUsageMeter } from "../../../design-system/ai";
import { Statistics } from "../../../design-system/data";
import { SectionHeader } from "../../../ui-polish";
import { useAdminExperience } from "../../hooks/useAdminExperience";
import { mockPlatformStats } from "../../data/mockAdminData";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";
import { RevenueChart, ProviderUsageChart, AnalyticsChart } from "../../../design-system/charts";
import { AI_POWERED_BY } from "../../../ui-polish/brandConstants";

const revenueData = [
  { name: "Jan", value: 82000 }, { name: "Feb", value: 91000 }, { name: "Mar", value: 88000 },
  { name: "Apr", value: 102000 }, { name: "May", value: 115000 }, { name: "Jun", value: 128000 },
];

export const ExecutiveDashboard = () => {
  const { getDiagnostics, getProviderMonitoring, getInfrastructureHealth, getUsageMonitoring } = useAdminExperience();
  const diagnostics = getDiagnostics();
  const providers = getProviderMonitoring();
  const infra = getInfrastructureHealth();
  const usage = getUsageMonitoring();

  logAdminUIDiagnostics("viewModel", { panel: "executive", providers: providers.length });
  logAdminUIDiagnostics("performance", { render: "ExecutiveDashboard" });

  return (
    <div className="space-y-6 md:space-y-8 yebone-fade-up" aria-label="Executive dashboard">
      <SectionHeader title="Executive Dashboard" subtitle="Platform overview and system health" />
      <Banner variant="info">YEBONE Control Center — Platform Overview</Banner>

      <Statistics stats={[
        { id: "revenue", label: "Revenue", value: `$${mockPlatformStats.revenue.toLocaleString()}` },
        { id: "orders", label: "Orders", value: mockPlatformStats.orders.toLocaleString() },
        { id: "customers", label: "Customers", value: mockPlatformStats.customers.toLocaleString() },
        { id: "vendors", label: "Vendors", value: mockPlatformStats.vendors },
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatisticCard label="Organizations" value={mockPlatformStats.organizations} />
        <StatisticCard label="AI Usage" value={mockPlatformStats.aiUsage.toLocaleString()} trend="+18%" />
        <AIAnalyticsCard usage={usage.commerce?.aiUsageCount || 0} credits={diagnostics.costs?.creditsConsumed || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card aria-label="Revenue overview"><RevenueChart data={revenueData} /></Card>
        <Card aria-label="Platform analytics"><AnalyticsChart data={revenueData} /></Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatisticCard label="Vendor KPI" value="94%" trend="Active rate" />
        <StatisticCard label="Customer KPI" value="4.6★" trend="Avg rating" />
        <StatisticCard label="AI KPI" value="1.2M" trend="Previews/mo" />
        <StatisticCard label="Uptime" value="99.9%" trend="30 days" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card aria-label="Infrastructure status">
          <h3 className="font-semibold mb-3">Infrastructure Status</h3>
          <Badge variant={infra.initialized ? "success" : "warning"}>{infra.initialized ? "Operational" : "Initializing"}</Badge>
          <dl className="mt-3 text-sm space-y-1">
            <div className="flex justify-between"><dt>Jobs</dt><dd>{diagnostics.jobs?.total || 0}</dd></div>
            <div className="flex justify-between"><dt>Assets</dt><dd>{usage.infrastructure?.assetCount || 0}</dd></div>
            <div className="flex justify-between"><dt>History Entries</dt><dd>{usage.infrastructure?.historyEntries || 0}</dd></div>
          </dl>
        </Card>
        <Card aria-label="Provider status">
          <h3 className="font-semibold mb-3">Provider Status</h3>
          {providers.length ? providers.map((p, i) => (
            <div key={i} className="flex items-center gap-2 mb-2">
              <AIProviderStatus provider={p.source || p.activeId || "Provider"} status="online" />
            </div>
          )) : <AIProviderStatus provider="Primary" status="online" />}
        </Card>
      </div>

      <Card aria-label="AI usage overview">
        <h3 className="font-semibold mb-3">AI Credits Overview</h3>
        <AIUsageMeter used={diagnostics.costs?.creditsConsumed || 0} total={(diagnostics.costs?.creditsConsumed || 0) + (diagnostics.costs?.creditsRemaining || 100)} />
      </Card>

      <Card aria-label="Provider usage">
        <h3 className="font-semibold mb-3">Provider Usage · {AI_POWERED_BY}</h3>
        <ProviderUsageChart data={[{ provider: "Primary", requests: 42000 }, { provider: "Fallback", requests: 8200 }]} />
      </Card>

      <Card aria-label="Activity feed">
        <h3 className="font-semibold mb-3">Recent Activity</h3>
        <ul className="space-y-3 text-sm">
          {[
            { time: "2m ago", event: "New vendor registration — TechHub Pro" },
            { time: "15m ago", event: "AI preview spike — 2,400 sessions/hr" },
            { time: "1h ago", event: "Feature flag updated — flash_deals_v2" },
            { time: "3h ago", event: "Infrastructure health check passed" },
          ].map((a) => (
            <li key={a.time} className="flex gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="text-gray-400 shrink-0 w-16">{a.time}</span>
              <span>{a.event}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card aria-label="Alerts and notifications">
        <h3 className="font-semibold mb-3">Alerts & Notifications</h3>
        <Alert variant="warning">2 vendors below AI readiness threshold</Alert>
        <div className="mt-2"><Alert variant="info">Infrastructure cleanup scheduled tonight</Alert></div>
      </Card>
    </div>
  );
};

export default ExecutiveDashboard;
