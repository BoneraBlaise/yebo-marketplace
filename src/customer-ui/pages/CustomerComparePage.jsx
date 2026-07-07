import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { CompareView } from "../components/compare/CompareView";
import { mockCompareProducts } from "../data/mockCustomerData";

export const CustomerComparePage = () => (
  <CustomerPageShell pageName="compare" activeNavId="products" title="Compare Products" breadcrumbs={[{ label: "Compare" }]}>
    <CompareView products={mockCompareProducts} />
  </CustomerPageShell>
);

export default CustomerComparePage;
