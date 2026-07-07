import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { CartView } from "../components/cart/CartView";
import { mockCartItems } from "../data/mockCustomerData";

export const CustomerCartPage = () => (
  <CustomerPageShell pageName="cart" activeNavId="cart" title="Shopping Cart" breadcrumbs={[{ label: "Cart" }]}>
    <CartView items={mockCartItems} />
  </CustomerPageShell>
);

export default CustomerCartPage;
