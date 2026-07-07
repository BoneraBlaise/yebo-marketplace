import React from "react";
import { Card, Tabs, DataTable, Badge, Button } from "../../../design-system/components";
import { Alert } from "../../../design-system/notifications";
import { mockSecurityAlerts } from "../../data/mockAdminData";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const SecurityCenter = () => {
  const [tab, setTab] = React.useState("roles");
  logAdminUIDiagnostics("component", { name: "SecurityCenter", tab });

  return (
    <div aria-label="Security center">
      <Tabs tabs={[
        { id: "roles", label: "Roles" },
        { id: "permissions", label: "Permissions" },
        { id: "sessions", label: "Sessions" },
        { id: "audit", label: "Audit Logs" },
        { id: "apikeys", label: "API Keys" },
        { id: "alerts", label: "Alerts" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        {tab === "roles" && (
          <DataTable columns={[{ key: "role", label: "Role" }, { key: "users", label: "Users" }]} rows={[
            { role: "platform_admin", users: 3 },
            { role: "vendor", users: 342 },
            { role: "customer", users: 8920 },
          ]} />
        )}
        {tab === "permissions" && (
          <Card><div className="flex flex-wrap gap-2">{["admin:providers", "admin:jobs", "admin:infrastructure", "admin:costs", "admin:usage", "admin:diagnostics"].map((p) => <Badge key={p}>{p}</Badge>)}</div></Card>
        )}
        {tab === "sessions" && (
          <DataTable columns={[{ key: "user", label: "User" }, { key: "device", label: "Device" }, { key: "lastActive", label: "Last Active" }]} rows={[
            { user: "admin@yebo.com", device: "Desktop", lastActive: "2 min ago" },
          ]} />
        )}
        {tab === "audit" && (
          <DataTable columns={[{ key: "action", label: "Action" }, { key: "user", label: "User" }, { key: "time", label: "Time" }]} rows={[
            { action: "login", user: "admin@yebo.com", time: "2026-07-07 16:00" },
            { action: "feature_flag_toggle", user: "admin@yebo.com", time: "2026-07-07 15:45" },
          ]} />
        )}
        {tab === "apikeys" && (
          <Card aria-label="API keys placeholder">
            <p className="text-sm text-gray-500 mb-3">API key management placeholder.</p>
            <Button size="sm" variant="secondary">Generate API Key</Button>
          </Card>
        )}
        {tab === "alerts" && (
          <div className="space-y-2">
            {mockSecurityAlerts.map((a) => (
              <Alert key={a.id} variant={a.severity === "warning" ? "warning" : "info"}>{a.message}</Alert>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityCenter;
