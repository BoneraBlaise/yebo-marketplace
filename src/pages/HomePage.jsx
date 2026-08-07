import React, { Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { HomeHero, HomeFeatureStrip } from "../components/Home";
import ProductCardSkeleton from "../components/Home/ProductCardSkeleton";
import { Container } from "../components/ui";
import "../components/Home/home.css";

const HomeRecentlyViewed = lazy(() => import("../components/Home/HomeRecentlyViewed"));
const HomeProductRails = lazy(() => import("../components/Home/HomeProductRails"));
const HomeCategories = lazy(() => import("../components/Home/HomeCategories"));
const HomeMarketplaceHub = lazy(() => import("../components/Home/HomeMarketplaceHub"));
const HomeGrowthCommerce = lazy(() => import("../components/Home/HomeGrowthCommerce"));
const HomeVerifiedVendors = lazy(() => import("../components/Home/HomeVerifiedVendors"));
const HomeYeboneBand = lazy(() => import("../components/Home/HomeYeboneBand"));
const HomeEventsBanner = lazy(() => import("../components/Home/HomeEventsBanner"));
const HomeNewsletter = lazy(() => import("../components/Home/HomeNewsletter"));

const SectionFallback = () => (
  <div className="home-section home-section-enter home-section--compact">
    <Container>
      <ProductCardSkeleton count={3} />
    </Container>
  </div>
);

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  return (
    <>
      <Helmet>
        <title>Yebone | Shop Smarter — Everything in one place</title>
        <meta
          name="description"
          content="Discover millions of products across Africa with AI-powered virtual try-on. Yebone — everything in one place."
        />
      </Helmet>

      <div className="home-page yebone-premium-screen flex flex-col flex-1">
        <div className="scroll-smooth flex-1">
          <HomeHero />

          {isAuthenticated && (
            <Suspense fallback={<SectionFallback />}>
              <HomeRecentlyViewed />
            </Suspense>
          )}

          <Suspense fallback={<SectionFallback />}>
            <HomeProductRails />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <HomeCategories />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <HomeMarketplaceHub />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <HomeGrowthCommerce bannersOnly />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <HomeVerifiedVendors />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <HomeYeboneBand />
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <HomeEventsBanner />
          </Suspense>

          <HomeFeatureStrip />

          <Suspense fallback={<SectionFallback />}>
            <HomeNewsletter />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default HomePage;
