import React from "react";
import { Card, Tabs, DataTable } from "../../../design-system/components";
import { logAdminUIDiagnostics } from "../../diagnostics/AdminUIDiagnostics";

const mockCommerceData = {
  orders: [{ id: "O-1", customer: "Jane", total: 79.99, status: "completed" }, { id: "O-2", customer: "John", total: 199.99, status: "refunded" }],
  payments: [{ id: "P-1", amount: 79.99, method: "card", status: "captured" }],
  refunds: [{ id: "R-1", orderId: "O-2", amount: 199.99, status: "pending" }],
  coupons: [{ id: "C-1", code: "PLATFORM10", uses: 45 }],
  affiliates: [{ id: "A-1", partner: "Influencer A", commission: 270 }],
  subscriptions: [{ id: "S-1", vendor: "TechHub", plan: "business", status: "active" }],
};

export const CommerceCenter = () => {
  const [tab, setTab] = React.useState("orders");
  logAdminUIDiagnostics("component", { name: "CommerceCenter", tab });

  return (
    <div aria-label="Commerce center">
      <Tabs tabs={[
        { id: "orders", label: "Orders" },
        { id: "payments", label: "Payments" },
        { id: "refunds", label: "Refunds" },
        { id: "shipping", label: "Shipping" },
        { id: "coupons", label: "Coupons" },
        { id: "affiliate", label: "Affiliate" },
        { id: "subscriptions", label: "Subscriptions" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4">
        {tab === "orders" && <DataTable columns={[{ key: "id", label: "Order" }, { key: "customer", label: "Customer" }, { key: "total", label: "Total" }, { key: "status", label: "Status" }]} rows={mockCommerceData.orders.map((o) => ({ ...o, total: `$${o.total}` }))} />}
        {tab === "payments" && <DataTable columns={[{ key: "id", label: "Payment" }, { key: "amount", label: "Amount" }, { key: "method", label: "Method" }, { key: "status", label: "Status" }]} rows={mockCommerceData.payments.map((p) => ({ ...p, amount: `$${p.amount}` }))} />}
        {tab === "refunds" && <DataTable columns={[{ key: "orderId", label: "Order" }, { key: "amount", label: "Amount" }, { key: "status", label: "Status" }]} rows={mockCommerceData.refunds.map((r) => ({ ...r, amount: `$${r.amount}` }))} />}
        {tab === "shipping" && <Card><p className="text-sm text-gray-500">Platform shipping overview placeholder.</p></Card>}
        {tab === "coupons" && <DataTable columns={[{ key: "code", label: "Code" }, { key: "uses", label: "Uses" }]} rows={mockCommerceData.coupons} />}
        {tab === "affiliate" && <DataTable columns={[{ key: "partner", label: "Partner" }, { key: "commission", label: "Commission" }]} rows={mockCommerceData.affiliates.map((a) => ({ ...a, commission: `$${a.commission}` }))} />}
        {tab === "subscriptions" && <DataTable columns={[{ key: "vendor", label: "Vendor" }, { key: "plan", label: "Plan" }, { key: "status", label: "Status" }]} rows={mockCommerceData.subscriptions} />}
      </div>
    </div>
  );
};

export default CommerceCenter;
