import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AdminDashboardMain from "../components/Admin/AdminDashboardMain";
import BottomNav from "../components/Layout/BottomNav";
const AdminDashboardPage = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  }

  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={1} />
          </div>
          <AdminDashboardMain />
        </div>
      </div>
      {/* Conditionally render BottomNav only on smaller screens */}
      {isSmallScreen() && <BottomNav />}
    </div>
  );
};

export default AdminDashboardPage;
