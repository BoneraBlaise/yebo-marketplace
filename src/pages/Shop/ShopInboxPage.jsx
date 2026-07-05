import React from 'react'
import DashboardMessages from "../../components/Shop/DashboardMessages";
const ShopInboxPage = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  };

  return (
    <div>
      <div className="flex items-start justify-center w-full">
        <div className="mb-10 w-full">
          <DashboardMessages />
        </div>
      </div>
     
    </div>
  )
}

export default ShopInboxPage