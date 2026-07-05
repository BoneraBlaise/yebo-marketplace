import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import CreateEvent from "../../components/Shop/CreateEvent";
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';
import BottomNav from '../../components/Layout/BottomNav';

const ShopCreateEvents = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  };

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full mb-20">
        <div className="w-[80px] 800px:w-[330px] mb-10">
          <DashboardSideBar active={6} />
        </div>
        <div className="w-full justify-center flex mb-10">
          <CreateEvent />
        </div>
      </div>
      <div className='mt-3'>
        {/* Conditionally render BottomNav only on smaller screens */}
        {isSmallScreen() && <BottomNav />}
      </div>
    </div>
  )
}

export default ShopCreateEvents