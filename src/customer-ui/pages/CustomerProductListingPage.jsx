import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { ProductListing } from "../components/products/ProductDiscovery";
import { mockProducts } from "../data/mockCustomerData";

export const CustomerProductListingPage = () => (
  <CustomerPageShell pageName="products" activeNavId="products" title="All Products" breadcrumbs={[{ label: "Products" }]}>
    <ProductListing products={mockProducts} />
  </CustomerPageShell>
);

export default CustomerProductListingPage;
