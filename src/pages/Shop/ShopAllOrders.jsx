import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllOrders from "../../components/Shop/AllOrders";
import BottomNav from '../../components/Layout/BottomNav';

const ShopAllOrders = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  };

  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px] mb-10">
          <DashboardSideBar active={2} />
        </div>
        <div className="w-full justify-center flex mb-10">
          <AllOrders />
        </div>
      </div>
      {/* Conditionally render BottomNav only on smaller screens */}
      {isSmallScreen() && <BottomNav />}
    </div>
  )
}

export default ShopAllOrders