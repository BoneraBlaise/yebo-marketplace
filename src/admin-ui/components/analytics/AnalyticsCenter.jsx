import React from "react";
import { Card, StatisticCard } from "../../../design-system/components";
import { Statistics } from "../../../design-system/data";
import { AIAnalyticsCard, AIUsageMeter } from "../../../design-system/ai";
import { useAdminExperience } from "../../hooks/useAdminExperience";
import { mockPlatformStats } from "../../data/mockAdminData";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const AnalyticsCenter = () => {
  const { getUsageMonitoring, getCostMonitoring } = useAdminExperience();
  const usage = getUsageMonitoring();
  const costs = getCostMonitoring();

  logAdminUIDiagnostics("viewModel", { panel: "analytics" });

  return (
    <div aria-label="Analytics center" className="space-y-6">
      <Statistics stats={[
        { id: "revenue", label: "Revenue", value: `$${mockPlatformStats.revenue.toLocaleString()}` },
        { id: "growth", label: "Growth", value: "+18%" },
        { id: "orders", label: "Orders", value: mockPlatformStats.orders.toLocaleString() },
        { id: "customers", label: "Customers", value: mockPlatformStats.customers.toLocaleString() },
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard label="Vendors" value={mockPlatformStats.vendors} trend="+12" />
        <StatisticCard label="AI Usage" value={mockPlatformStats.aiUsage.toLocaleString()} trend="+24%" />
        <StatisticCard label="Conversion" value="3.2%" trend="+0.4%" />
        <StatisticCard label="Provider Usage" value={usage.commerce?.aiUsageCount || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AIAnalyticsCard usage={usage.commerce?.aiUsageCount || 0} credits={costs.creditsConsumed} />
        <Card>
          <h3 className="font-semibold mb-3">Credits Consumption</h3>
          <AIUsageMeter used={costs.creditsConsumed} total={costs.creditsConsumed + costs.creditsRemaining} />
        </Card>
      </div>

      <Card aria-label="Trend dashboard">
        <h3 className="font-semibold mb-2">Platform Trends</h3>
        <p className="text-sm text-gray-500">Revenue, orders, and AI adoption trends placeholder.</p>
        <div className="mt-4 h-32 bg-gray-50 dark:bg-gray-800 rounded-lg flex items-center justify-center text-gray-400">Chart placeholder</div>
      </Card>
    </div>
  );
};

export default AnalyticsCenter;
