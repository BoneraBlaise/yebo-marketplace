import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { OrdersList } from "../components/orders/OrdersView";
import { mockOrders } from "../data/mockCustomerData";

export const CustomerOrdersPage = () => (
  <CustomerPageShell pageName="orders" activeNavId="profile" title="My Orders" breadcrumbs={[{ label: "Orders" }]}>
    <OrdersList orders={mockOrders} />
  </CustomerPageShell>
);

export default CustomerOrdersPage;
