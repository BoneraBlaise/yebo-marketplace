import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { SearchEntry, ProductListing, TrendingProducts, RecentlyViewed } from "../components/products/ProductDiscovery";
import { SectionHeader, PremiumCard } from "../../ui-polish";
import { AI_POWERED_BY } from "../../ui-polish/brandConstants";
import { Badge, Button } from "../../design-system/components";
import { mockProducts } from "../data/mockCustomerData";

export const CustomerSearchPage = () => (
  <CustomerPageShell pageName="search" activeNavId="search" title="Search" breadcrumbs={[{ label: "Search" }]}>
    <SectionHeader title="Search Products" subtitle="Find exactly what you need" />
    <SearchEntry />
    <PremiumCard accent className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <Badge variant="warning">✨ AI Search</Badge>
        <p className="font-semibold mt-2">Try natural language search</p>
        <p className="text-sm text-gray-500">{AI_POWERED_BY} — describe what you&apos;re looking for.</p>
      </div>
      <Button variant="secondary">Enable AI Search</Button>
    </PremiumCard>
    <div className="mb-6">
      <p className="text-xs uppercase tracking-wide text-gray-500 mb-2">Popular searches</p>
      <div className="flex flex-wrap gap-2">
        {["Wireless headphones", "Summer fashion", "Home decor", "Running shoes"].map((q) => (
          <Button key={q} size="sm" variant="ghost">{q}</Button>
        ))}
      </div>
    </div>
    <TrendingProducts products={mockProducts} />
    <ProductListing products={mockProducts} />
    <RecentlyViewed products={mockProducts.slice(0, 3)} />
  </CustomerPageShell>
);

export default CustomerSearchPage;
