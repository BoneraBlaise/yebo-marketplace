import React, { useState } from "react";
import { Card, Button, Tabs, DataTable } from "../../../design-system/components";
import { mockOrders } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

const ORDER_STATUSES = ["all", "pending", "confirmed", "processing", "shipping", "delivered", "cancelled", "returned", "refund_requested"];

const statusVariant = {
  pending: "warning", confirmed: "default", processing: "default",
  shipping: "default", delivered: "success", cancelled: "error",
  returned: "warning", refund_requested: "error",
};

export const OrderManagement = ({ orders = mockOrders }) => {
  const [filter, setFilter] = useState("all");
  logVendorUIDiagnostics("component", { name: "OrderManagement", filter });

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const columns = [
    { key: "id", label: "Order" },
    { key: "customer", label: "Customer" },
    { key: "date", label: "Date" },
    { key: "status", label: "Status" },
    { key: "total", label: "Total" },
  ];
  const rows = filtered.map((o) => ({ ...o, total: `$${o.total}`, status: o.status.replace("_", " ") }));

  return (
    <div aria-label="Order management">
      <Tabs
        tabs={ORDER_STATUSES.map((s) => ({ id: s, label: s === "all" ? "All" : s.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()) }))}
        active={filter}
        onChange={setFilter}
      />
      <div className="mt-4">
        <DataTable columns={columns} rows={rows} />
        {filter === "refund_requested" && filtered.length > 0 && (
          <Card className="mt-4">
            <h3 className="font-semibold mb-2">Refund Requests</h3>
            {filtered.map((o) => (
              <div key={o.id} className="flex justify-between items-center py-2 border-b last:border-0">
                <span>{o.id} — {o.customer}</span>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary">Approve</Button>
                  <Button size="sm" variant="ghost">Decline</Button>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;
