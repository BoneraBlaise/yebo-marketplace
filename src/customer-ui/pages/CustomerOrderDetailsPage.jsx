import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { OrderDetailsView } from "../components/orders/OrdersView";
import { mockOrderDetail } from "../data/mockCustomerData";

export const CustomerOrderDetailsPage = () => (
  <CustomerPageShell pageName="order-details" activeNavId="profile" title="Order Details" breadcrumbs={[{ label: "Orders" }, { label: `#${mockOrderDetail.id}` }]}>
    <OrderDetailsView order={mockOrderDetail} />
  </CustomerPageShell>
);

export default CustomerOrderDetailsPage;
