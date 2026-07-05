import React from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import AllEvents from "../components/Admin/AllEvents";
import BottomNav from "../components/Layout/BottomNav";

const AdminDashboardEvents = () => {
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  }
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={6} />
          </div>
          <AllEvents />
        </div>
      </div>
      {/* Conditionally render BottomNav only on smaller screens */}
      {isSmallScreen() && <BottomNav />}
    </div>
  );
};

export default AdminDashboardEvents;
