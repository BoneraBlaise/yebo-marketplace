import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import { HeroSection, CategoryGrid, FeaturedProducts, FeaturedVendors, PromotionsBanner } from "../components/landing/LandingSections";
import { mockCategories, mockProducts, mockVendors, mockPromotions } from "../data/mockCustomerData";

export const CustomerHomePage = () => (
  <CustomerPageShell pageName="home" activeNavId="home" title="YEBO Marketplace">
    <HeroSection />
    <PromotionsBanner promotions={mockPromotions} />
    <CategoryGrid categories={mockCategories} />
    <FeaturedProducts products={mockProducts} />
    <FeaturedVendors vendors={mockVendors} />
  </CustomerPageShell>
);

export default CustomerHomePage;
