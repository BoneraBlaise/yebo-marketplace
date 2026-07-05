import React from "react";
import { FiShoppingBag } from "react-icons/fi";
import {GrWorkshop} from "react-icons/gr";
import { RxDashboard } from "react-icons/rx";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { Link } from "react-router-dom";
import { HiOutlineUserGroup } from "react-icons/hi";
import { BsHandbag } from "react-icons/bs";
import { MdOutlineLocalOffer } from "react-icons/md";
import { AiOutlineSetting } from "react-icons/ai";

const AdminSideBar = ({ active }) => {
  return (
    <div title="Dashboard" className="w-full h-[90vh] bg-white dark:bg-[#1f1f1f] shadow-sm overflow-y-scroll hide-scrollbar sticky top-0 left-0 z-10">
      {/* single item */}
      <div className="w-full flex items-center p-4">
        <Link to="/admin/dashboard" className="w-full flex items-center">
          <RxDashboard 
            size={20}
            color={`${active === 1 ? "#29625d" : "#8f8f8f"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 1 ? "text-green-900" : "text-[#8f8f8f]"
            }`}
          >
            Dashboard
          </h5>
        </Link>
      </div>

      <div title="All Orders" className="w-full flex items-center p-4">
        <Link to="/admin-orders" className="w-full flex items-center">
          <FiShoppingBag 
            size={20}
            color={`${active === 2 ? "#29625d" : "#8f8f8f"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 2 ? "text-green-900" : "text-[#8f8f8f]"
            }`}
          >
            All Orders
          </h5>
        </Link>
      </div>

      <div title="All Sellers" className="w-full flex items-center p-4">
      <Link to="/admin-sellers" className="w-full flex items-center">
        <GrWorkshop 
          size={20}
          style={{ color: active === 3 ? "#29625d" : "#8f8f8f" }}
        />
        <h5
          className={`hidden sm:block pl-2 text-[18px] font-[400] ${
            active === 3 ? "text-green-900" : "text-[#8f8f8f]"
          }`}
        >
          All Sellers
        </h5>
      </Link>
    </div>

      <div title="All Users" className="w-full flex items-center p-4">
        <Link to="/admin-users" className="w-full flex items-center">
          <HiOutlineUserGroup
            size={20}
            color={`${active === 4 ? "#29625d" : "#8f8f8f"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 4 ? "text-green-900" : "text-[#8f8f8f]"
            }`}
          >
            All Users
          </h5>
        </Link>
      </div>

      <div title="All Products" className="w-full flex items-center p-4">
        <Link to="/admin-products" className="w-full flex items-center">
          <BsHandbag 
            size={20}
            color={`${active === 5 ? "#29625d" : "#8f8f8f"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 5 ? "text-green-900" : "text-[#8f8f8f]"
            }`}
          >
            All Products
          </h5>
        </Link>
      </div>

      <div title="All Events" className="w-full flex items-center p-4">
        <Link to="/admin-events" className="w-full flex items-center">
          <MdOutlineLocalOffer 
            size={20}
            color={`${active === 6 ? "#29625d" : "#8f8f8f"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 6 ? "text-green-900" : "text-[#8f8f8f]"
            }`}
          >
            All Events
          </h5>
        </Link>
      </div>



      <div title="Withdraw Request" className="w-full flex items-center p-4">
        <Link
          to="/admin-withdraw-request"
          className="w-full flex items-center"
        >
          <CiMoneyBill 
            size={20}
            color={`${active === 7 ? "#29625d" : "#8f8f8f"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 7 ? "text-green-900" : "text-[#8f8f8f]"
            }`}
          >
            Withdraw Requests
          </h5>
        </Link>
      </div>

      <div title="Settings" className="w-full flex items-center p-4">
        <Link
          to="/profile"
          className="w-full flex items-center"
        >
          <AiOutlineSetting 
            size={20}
            color={`${active === 8 ? "#29625d" : "#8f8f8f"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 8 ? "text-green-900" : "text-[#8f8f8f]"
            }`}
          >
            Settings
          </h5>
        </Link>
      </div>

    </div>
  );
};

export default AdminSideBar;
