import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { FaLayerGroup, FaList, FaPeopleCarry, FaSalesforce } from "react-icons/fa";
import classNames from "classnames";

const DashboardSideBar = ({ active }) => {
  // Utility to determine the active class for a given item
  const getActiveClass = (id) =>
    classNames({
      "text-[#29625d]": active === id,  // Active color for text
      "text-[#7c7c7c]": active !== id,  // Inactive color for text
    });

  const getActiveColor = (id) => (active === id ? "#29625d" : "#7c7c7c");

  const menuItems = [
    { to: "/dashboard", icon: <RxDashboard />, label: "Dashboard", id: 1 },
    { to: "/dashboard-orders", icon: <FiShoppingBag />, label: "All Orders", id: 2 },
    { to: "/dashboard-products", icon: <FiPackage />, label: "All Products", id: 3 },
    { to: "/dashboard-create-product", icon: <AiOutlineFolderAdd />, label: "Create Product", id: 4 },
    { to: "/dashboard-events", icon: <MdOutlineLocalOffer />, label: "All Events", id: 5 },
    { to: "/dashboard-create-event", icon: <VscNewFile />, label: "Create Event", id: 6 },
    { to: "/dashboard-withdraw-money", icon: <CiMoneyBill />, label: "Withdraw Money", id: 7 },
    { to: "/dashboard-messages", icon: <BiMessageSquareDetail />, label: "Shop Inbox", id: 8 },
    { to: "/dashboard-coupouns", icon: <AiOutlineGift />, label: "Discount Codes", id: 9 },
    { to: "/dashboard-refunds", icon: <HiOutlineReceiptRefund />, label: "Refunds", id: 10 },
    { to: "/settings", icon: <CiSettings />, label: "Settings", id: 11 },
    { to: "/dashboard-create-flashsale", icon: <FaSalesforce />, label: "Create FlashSale", id: 12 },
    { to: "/dashboard-flashsales", icon: <FaList />, label: "All Flash sales", id: 13 },
    { to: "/dashboard-bids", icon: <FaPeopleCarry />, label: "My Auctions", id: 14 },
    { to: "/dashboard-start-auction", icon: <FaLayerGroup />, label: "Start Auction", id: 15 },
  ];

  return (
    <div className="w-full max-h-screen min-h-screen bg-white dark:bg-[#1f1f1f] shadow-sm overflow-y-scroll hide-scrollbar sticky top-0 left-0 z-10">
      {menuItems.map((item) => (
        <div key={item.id} className="w-full flex items-center p-4">
          <Link to={item.to} className="w-full flex items-center">
            <div className="flex items-center">
              {React.cloneElement(item.icon, {
                size: 20,
                color: getActiveColor(item.id), // Set icon color dynamically
              })}
              <h5 className={`hidden 800px:block pl-2 text-[18px] font-[400] ${getActiveClass(item.id)}`}>
                {item.label}
              </h5>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DashboardSideBar;
