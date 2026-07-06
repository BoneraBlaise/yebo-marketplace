import React, { useState, useEffect, Suspense, lazy } from "react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import {
  HomeHeader,
  HomeHero,
  HomeFeatureStrip,
} from "../components/Home";
import ProductCardSkeleton from "../components/Home/ProductCardSkeleton";
import { Container } from "../components/ui";
import "../components/Home/home.css";

const HomeCategories = lazy(() => import("../components/Home/HomeCategories"));
const HomeProductRails = lazy(() => import("../components/Home/HomeProductRails"));
const HomeAIExperience = lazy(() => import("../components/Home/HomeAIExperience"));
const HomeAIDiscovery = lazy(() => import("../components/ai/sections/HomeAIDiscovery"));
const AIShoppingAssistants = lazy(() => import("../components/ai/sections/AIShoppingAssistants"));
const HomeAIPicks = lazy(() => import("../components/Home/HomeAIPicks"));
const HomeEventsBanner = lazy(() => import("../components/Home/HomeEventsBanner"));
const HomeEventsSection = lazy(() => import("../components/Home/HomeEventsSection"));
const HomeVerifiedVendors = lazy(() => import("../components/Home/HomeVerifiedVendors"));
const HomeReviews = lazy(() => import("../components/Home/HomeReviews"));
const HomeRecentlyViewed = lazy(() => import("../components/Home/HomeRecentlyViewed"));
const HomeNewsletter = lazy(() => import("../components/Home/HomeNewsletter"));
const HomeFooter = lazy(() => import("../components/Home/HomeFooter"));

const SectionFallback = () => (
  <div className="home-section home-section-enter">
    <Container>
      <ProductCardSkeleton count={3} />
    </Container>
  </div>
);

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  const [isMobile, setIsMobile] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsBannerVisible(width > 900);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Helmet>
        <title>Yebone | Shop Smarter — Everything in one place</title>
        <meta
          name="description"
          content="Discover millions of products across Africa with AI-powered virtual try-on. Yebone — everything in one place."
        />
      </Helmet>

      <div className="home-page flex flex-col min-h-screen bg-yebone-light-gray dark:bg-gray-950">
        <HomeHeader activeHeading={1} />

        <main className="scroll-smooth">
          {/* 1. Hero */}
          <HomeHero />

          {/* 2. Marketplace Benefits */}
          <HomeFeatureStrip />

          {/* 3. Marketplace Categories */}
          <Suspense fallback={<SectionFallback />}>
            <HomeCategories />
          </Suspense>

          {/* 4. Trending Products */}
          <Suspense fallback={<SectionFallback />}>
            <HomeProductRails />
          </Suspense>

          {/* 5. AI Shopping Experience */}
          <Suspense fallback={<SectionFallback />}>
            <HomeAIExperience />
          </Suspense>

          {/* 5b. AI Discovery */}
          <Suspense fallback={<SectionFallback />}>
            <HomeAIDiscovery />
          </Suspense>

          {/* 5c. Shopping Assistants */}
          <Suspense fallback={<SectionFallback />}>
            <AIShoppingAssistants compact />
          </Suspense>

          {/* 6. AI Picks */}
          <Suspense fallback={<SectionFallback />}>
            <HomeAIPicks />
          </Suspense>

          {/* 7. Events */}
          <Suspense fallback={<SectionFallback />}>
            {isBannerVisible ? (
              <HomeEventsBanner />
            ) : (
              <HomeEventsSection isMobile={isMobile} />
            )}
          </Suspense>

          {/* 8. Verified Vendors */}
          <Suspense fallback={<SectionFallback />}>
            <HomeVerifiedVendors />
          </Suspense>

          {/* 9. Customer Reviews */}
          <Suspense fallback={<SectionFallback />}>
            <HomeReviews />
          </Suspense>

          {isAuthenticated && (
            <Suspense fallback={<SectionFallback />}>
              <HomeRecentlyViewed />
            </Suspense>
          )}

          {/* 10. Newsletter */}
          <Suspense fallback={<SectionFallback />}>
            <HomeNewsletter />
          </Suspense>
        </main>

        {/* 11. Footer */}
        <Suspense fallback={null}>
          <HomeFooter />
        </Suspense>
      </div>
    </>
  );
};

export default HomePage;
