import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { OrderManagement } from "../components/orders/OrderManagement";

export const VendorOrdersPage = () => (
  <VendorPageShell pageName="orders" activeNavId="orders" title="Orders" breadcrumbs={[{ label: "Orders" }]}>
    <OrderManagement />
  </VendorPageShell>
);

export default VendorOrdersPage;
