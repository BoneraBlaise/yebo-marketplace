import React from "react";
import { Card, Tabs, Badge, Button } from "../../../design-system/components";
import { Statistics } from "../../../design-system/data";
import { useAdminExperience } from "../../hooks/useAdminExperience";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const InfrastructureCenter = () => {
  const [tab, setTab] = React.useState("overview");
  const { getInfrastructureHealth, getJobMonitoring, getUsageMonitoring } = useAdminExperience();
  const health = getInfrastructureHealth();
  const jobs = getJobMonitoring();
  const usage = getUsageMonitoring();

  logAdminUIDiagnostics("component", { name: "InfrastructureCenter", tab });

  return (
    <div aria-label="Infrastructure center">
      <Tabs tabs={[
        { id: "overview", label: "Overview" },
        { id: "storage", label: "Storage" },
        { id: "cache", label: "Cache" },
        { id: "queue", label: "Queue" },
        { id: "assets", label: "Assets" },
        { id: "lifecycle", label: "Lifecycle" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        <Statistics stats={[
          { id: "jobs", label: "Queue Jobs", value: jobs.total || 0 },
          { id: "assets", label: "Assets", value: usage.infrastructure?.assetCount || 0 },
          { id: "history", label: "History Entries", value: usage.infrastructure?.historyEntries || 0 },
          { id: "status", label: "Status", value: health.initialized ? "OK" : "Init" },
        ]} />

        {tab === "storage" && <Card><h3 className="font-semibold mb-2">Storage</h3><Badge variant="success">Active</Badge><p className="text-sm text-gray-500 mt-2">Storage manager operational.</p></Card>}
        {tab === "cache" && <Card><h3 className="font-semibold mb-2">Preview Cache</h3><p className="text-sm text-gray-500">Cache layer connected to commerce preview cache.</p></Card>}
        {tab === "queue" && <Card><h3 className="font-semibold mb-2">Job Queue</h3><p className="text-sm">{jobs.total || 0} jobs in queue.</p></Card>}
        {tab === "assets" && <Card><h3 className="font-semibold mb-2">Asset Manager</h3><p className="text-sm">{usage.infrastructure?.assetCount || 0} assets tracked.</p></Card>}
        {tab === "lifecycle" && (
          <Card>
            <h3 className="font-semibold mb-2">Lifecycle & Cleanup</h3>
            <p className="text-sm text-gray-500 mb-3">Lifecycle manager and cleanup service.</p>
            <Button size="sm" variant="secondary">Run Cleanup</Button>
          </Card>
        )}
        {tab === "overview" && (
          <Card aria-label="Notifications">
            <h3 className="font-semibold mb-2">Notification Hooks</h3>
            <p className="text-sm text-gray-500">Infrastructure notification hooks active.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default InfrastructureCenter;
