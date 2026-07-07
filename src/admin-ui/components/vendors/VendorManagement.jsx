import React from "react";
import { Card, DataTable, Badge, Progress, Tabs } from "../../../design-system/components";
import { mockVendors } from "../../data/mockAdminData";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

export const VendorManagement = ({ vendors = mockVendors }) => {
  const [tab, setTab] = React.useState("list");
  logAdminUIDiagnostics("component", { name: "VendorManagement" });

  const columns = [
    { key: "name", label: "Vendor" },
    { key: "health", label: "Health" },
    { key: "aiReadiness", label: "AI Readiness" },
    { key: "subscription", label: "Subscription" },
    { key: "credits", label: "Credits" },
    { key: "revenue", label: "Revenue" },
    { key: "status", label: "Status" },
  ];
  const rows = vendors.map((v) => ({
    ...v,
    revenue: v.revenue ? `$${v.revenue.toLocaleString()}` : "—",
  }));

  return (
    <div aria-label="Vendor management">
      <Tabs tabs={[{ id: "list", label: "Vendor List" }, { id: "details", label: "Store Details" }]} active={tab} onChange={setTab} />
      <div className="mt-4">
        {tab === "list" && <DataTable columns={columns} rows={rows} />}
        {tab === "details" && vendors[0] && (
          <Card aria-label="Store details">
            <h3 className="font-semibold text-lg mb-4">{vendors[0].name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-500">Health Score</p><Progress value={vendors[0].health} /><p className="text-sm mt-1">{vendors[0].health}%</p></div>
              <div><p className="text-sm text-gray-500">AI Readiness</p><Progress value={vendors[0].aiReadiness} /><p className="text-sm mt-1">{vendors[0].aiReadiness}%</p></div>
              <div><p className="text-sm text-gray-500">Subscription</p><Badge>{vendors[0].subscription}</Badge></div>
              <div><p className="text-sm text-gray-500">Credits</p><p className="font-bold">{vendors[0].credits}</p></div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VendorManagement;
