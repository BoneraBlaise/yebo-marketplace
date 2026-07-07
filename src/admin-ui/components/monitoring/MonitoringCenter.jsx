import React from "react";
import { Card, Tabs, Badge } from "../../../design-system/components";
import { Logs, Statistics } from "../../../design-system/data";
import { AIProviderStatus } from "../../../design-system/ai";
import { useAdminExperience } from "../../hooks/useAdminExperience";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const MonitoringCenter = () => {
  const [tab, setTab] = React.useState("health");
  const { getDiagnostics, getProviderMonitoring, getJobMonitoring, getInfrastructureHealth } = useAdminExperience();
  const diagnostics = getDiagnostics();
  const providers = getProviderMonitoring();
  const jobs = getJobMonitoring();
  const infra = getInfrastructureHealth();

  logAdminUIDiagnostics("viewModel", { panel: "monitoring" });
  logAdminUIDiagnostics("performance", { tab });

  return (
    <div aria-label="Monitoring center">
      <Tabs tabs={[
        { id: "health", label: "System Health" },
        { id: "performance", label: "Performance" },
        { id: "diagnostics", label: "Diagnostics" },
        { id: "logs", label: "Logs" },
        { id: "queue", label: "Queue" },
        { id: "providers", label: "Providers" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        {tab === "health" && (
          <Statistics stats={[
            { id: "commerce", label: "Commerce", value: diagnostics.diagnostics?.commerceInitialized ? "OK" : "—" },
            { id: "infra", label: "Infrastructure", value: diagnostics.diagnostics?.infrastructureInitialized ? "OK" : "—" },
            { id: "jobs", label: "Jobs", value: jobs.total || 0 },
            { id: "infra2", label: "Infra Init", value: infra.initialized ? "Yes" : "No" },
          ]} />
        )}
        {tab === "performance" && (
          <Card><h3 className="font-semibold mb-2">Performance</h3><p className="text-sm text-gray-500">Platform performance metrics placeholder.</p></Card>
        )}
        {tab === "diagnostics" && (
          <Card>
            <h3 className="font-semibold mb-2">Diagnostics Snapshot</h3>
            <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto">{JSON.stringify(diagnostics.diagnostics, null, 2)}</pre>
          </Card>
        )}
        {tab === "logs" && (
          <Logs entries={[
            { time: "16:00:01", message: "Platform health check passed" },
            { time: "16:00:05", message: "Provider selection completed" },
            { time: "16:00:12", message: "Job queue processed 0 items" },
          ]} />
        )}
        {tab === "queue" && (
          <Card><h3 className="font-semibold mb-2">Queue Status</h3><Badge>{jobs.total || 0} jobs</Badge></Card>
        )}
        {tab === "providers" && (
          <Card>
            {providers.map((p, i) => (
              <div key={i} className="mb-2"><AIProviderStatus provider={p.source || "Provider"} status="online" /></div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

export default MonitoringCenter;
