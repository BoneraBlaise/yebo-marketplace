import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { CategoryGrid } from "../components/landing/LandingSections";
import { ProductListing } from "../components/products/ProductDiscovery";
import { mockCategories, mockProducts } from "../data/mockCustomerData";

export const CustomerCategoryPage = ({ categoryName = "Electronics" }) => (
  <CustomerPageShell pageName="category" activeNavId="products" title={categoryName} breadcrumbs={[{ label: "Categories" }, { label: categoryName }]}>
    <CategoryGrid categories={mockCategories} />
    <ProductListing products={mockProducts.filter((p) => p.category === categoryName || categoryName === "All")} />
  </CustomerPageShell>
);

export default CustomerCategoryPage;
