import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { CheckoutView, OrderConfirmation } from "../components/checkout/CheckoutView";
import { mockCartItems, mockAddresses } from "../data/mockCustomerData";

export const CustomerCheckoutPage = ({ confirmed = false }) => (
  <CustomerPageShell pageName="checkout" activeNavId="cart" title="Checkout" breadcrumbs={[{ label: "Cart" }, { label: "Checkout" }]}>
    {confirmed ? <OrderConfirmation orderId="ORD-20260705" /> : <CheckoutView items={mockCartItems} addresses={mockAddresses} />}
  </CustomerPageShell>
);

export default CustomerCheckoutPage;
