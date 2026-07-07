import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { ShippingView } from "../components/shipping/ShippingView";

export const VendorShippingPage = () => (
  <VendorPageShell pageName="shipping" activeNavId="shipping" title="Shipping" breadcrumbs={[{ label: "Shipping" }]}>
    <ShippingView />
  </VendorPageShell>
);

export default VendorShippingPage;
