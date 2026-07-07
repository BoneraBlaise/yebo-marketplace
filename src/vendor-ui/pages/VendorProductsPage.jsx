import React from "react";
import VendorPageShell from "../components/VendorPageShell";
import { ProductManagement } from "../components/products/ProductManagement";

export const VendorProductsPage = () => (
  <VendorPageShell pageName="products" activeNavId="products" title="Products" breadcrumbs={[{ label: "Products" }]}>
    <ProductManagement />
  </VendorPageShell>
);

export default VendorProductsPage;
