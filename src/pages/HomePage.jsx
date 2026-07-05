import React, { useState, useEffect } from 'react';
import Header from "../components/Layout/Header";
import Hero from "../components/Route/Hero/Hero";
import Categories from "../components/Route/Categories/Categories";
import BestDeals from "../components/Route/BestDeals/BestDeals";
import FeaturedProduct from "../components/Route/FeaturedProduct/FeaturedProduct";
import Events from "../components/Events/Events";
import Footer from "../components/Layout/Footer";
import EventsBanner from '../components/Events/EventsBanner';
import RecentlyViewed from '../components/Route/Recent/RecentlyViewed';
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";


const HomePage = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.user);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsBannerVisible(width > 900);
    };

    // Set initial value
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex flex-col min-h-screen dark:bg-[#1f1f1f]">
      <Header activeHeading={1} />
      <div className={`flex-grow ${isMobile ? 'px-2' : 'px-4'}`}>
        <Hero />
        <Categories />
        <BestDeals />
        {isBannerVisible ? (
          <EventsBanner />
        ) : (
          <Events isMobile={isMobile} /> 
        )}
        <FeaturedProduct />
        {isAuthenticated && <RecentlyViewed />}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
