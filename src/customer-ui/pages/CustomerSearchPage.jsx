import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { SearchEntry, ProductListing, TrendingProducts, RecentlyViewed } from "../components/products/ProductDiscovery";
import { mockProducts } from "../data/mockCustomerData";

export const CustomerSearchPage = () => (
  <CustomerPageShell pageName="search" activeNavId="search" title="Search" breadcrumbs={[{ label: "Search" }]}>
    <SearchEntry />
    <TrendingProducts products={mockProducts} />
    <ProductListing products={mockProducts} />
    <RecentlyViewed products={mockProducts.slice(0, 3)} />
  </CustomerPageShell>
);

export default CustomerSearchPage;
