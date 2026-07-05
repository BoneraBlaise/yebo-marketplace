import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/DashboardHero";
import BottomNav from "../../components/Layout/BottomNav";
const ShopDashboardPage = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  };

  return (

    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full mb-10 overflow-hidden">
        <div className="w-[80px] 800px:w-[330px] mb-10">
          <DashboardSideBar active={1} />
        </div>
        <DashboardHero />
      </div>
      {/* Conditionally render BottomNav only on smaller screens */}
      {isSmallScreen() && <BottomNav />}
    </div>
  );
};

export default ShopDashboardPage;
