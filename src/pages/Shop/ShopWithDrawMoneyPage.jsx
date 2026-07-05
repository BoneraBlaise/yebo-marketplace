import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import WithdrawMoney from "../../components/Shop/WithdrawMoney";
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar';
import BottomNav from '../../components/Layout/BottomNav';

const ShopWithDrawMoneyPage = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  };

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start w-full">
        <div className="w-[80px] 800px:w-[330px] mb-10">
          <DashboardSideBar active={7} />
        </div>
        <div className='mb-10 w-full'>
          <WithdrawMoney />
        </div>
      </div>
      {/* Conditionally render BottomNav only on smaller screens */}
      {isSmallScreen() && <BottomNav />}
    </div>
  )
}

export default ShopWithDrawMoneyPage