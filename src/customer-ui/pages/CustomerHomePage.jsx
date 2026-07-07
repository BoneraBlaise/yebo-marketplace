import React from "react";
import CustomerPageShell from "../components/CustomerPageShell";
import {
  HeroSection, CategoryGrid, FeaturedProducts, FeaturedVendors, PromotionsBanner,
  AIValueSection, FlashDealsSection, TrendingProducts, PopularBrandsSection, StatsSection,
  TrustBadgesSection, TestimonialsSection, NewsletterSection, LandingFooter,
} from "../components/landing/LandingSections";
import { mockCategories, mockProducts, mockVendors, mockPromotions } from "../data/mockCustomerData";
import { MARKETPLACE_NAME } from "../../ui-polish/brandConstants";

export const CustomerHomePage = () => (
  <CustomerPageShell pageName="home" activeNavId="home" title={MARKETPLACE_NAME}>
    <HeroSection />
    <TrustBadgesSection />
    <AIValueSection />
    <PromotionsBanner promotions={mockPromotions} />
    <FlashDealsSection products={mockProducts} />
    <CategoryGrid categories={mockCategories} />
    <TrendingProducts products={mockProducts} />
    <FeaturedProducts products={mockProducts} />
    <PopularBrandsSection />
    <FeaturedVendors vendors={mockVendors} />
    <StatsSection />
    <TestimonialsSection />
    <NewsletterSection />
    <LandingFooter />
  </CustomerPageShell>
);

export default CustomerHomePage;
