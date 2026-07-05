import React from 'react'
import AdminHeader from '../components/Layout/AdminHeader'
import AdminSideBar from '../components/Admin/Layout/AdminSideBar'
import AllWithdraw from "../components/Admin/AllWithdraw";
import BottomNav from "../components/Layout/BottomNav";
const AdminDashboardWithdraw = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  }
  return (
    <div>
    <AdminHeader />
    <div className="w-full flex">
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <AdminSideBar active={7} />
        </div>
         <AllWithdraw />
      </div>
    </div>
    {/* Conditionally render BottomNav only on smaller screens */}
    {isSmallScreen() && <BottomNav />}
  </div>
  )
}

export default AdminDashboardWithdraw