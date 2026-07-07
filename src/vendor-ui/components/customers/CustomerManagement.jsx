import React, { useState } from "react";
import { Card, Tabs, DataTable, StatisticCard } from "../../../design-system/components";
import { mockCustomers } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const CustomerManagement = ({ customers = mockCustomers }) => {
  const [tab, setTab] = useState("all");
  logVendorUIDiagnostics("component", { name: "CustomerManagement" });

  const repeat = customers.filter((c) => c.repeat);
  const top = [...customers].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5);

  const columns = [
    { key: "name", label: "Customer" },
    { key: "email", label: "Email" },
    { key: "orders", label: "Orders" },
    { key: "totalSpent", label: "Total Spent" },
    { key: "repeat", label: "Repeat" },
  ];
  const rows = (tab === "repeat" ? repeat : tab === "top" ? top : customers).map((c) => ({
    ...c, totalSpent: `$${c.totalSpent}`, repeat: c.repeat ? "Yes" : "No",
  }));

  return (
    <div aria-label="Customer management">
      <div className="grid grid-cols-3 gap-4 mb-6">
        <StatisticCard label="Total Customers" value={customers.length} />
        <StatisticCard label="Repeat Customers" value={repeat.length} />
        <StatisticCard label="Top Customer Spend" value={`$${top[0]?.totalSpent || 0}`} />
      </div>
      <Tabs tabs={[{ id: "all", label: "All Customers" }, { id: "repeat", label: "Repeat" }, { id: "top", label: "Top Customers" }]} active={tab} onChange={setTab} />
      <div className="mt-4">
        <DataTable columns={columns} rows={rows} />
      </div>
    </div>
  );
};

export default CustomerManagement;
