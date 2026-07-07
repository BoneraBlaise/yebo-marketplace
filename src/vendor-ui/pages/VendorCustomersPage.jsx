import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { CustomerManagement } from "../components/customers/CustomerManagement";

export const VendorCustomersPage = () => (
  <VendorPageShell pageName="customers" activeNavId="customers" title="Customers" breadcrumbs={[{ label: "Customers" }]}>
    <CustomerManagement />
  </VendorPageShell>
);

export default VendorCustomersPage;
