import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AiOutlineLogin, AiOutlineGift, AiOutlineFolderAdd } from "react-icons/ai";
import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineArchive,
  HiOutlineUserGroup,
  HiOutlineStar,
  HiOutlineCurrencyDollar,
  HiOutlineCash,
  HiOutlineCog,
  HiOutlineSupport,
  HiOutlineReceiptRefund,
  HiOutlineHome,
} from "react-icons/hi";
import { FiMessageSquare } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { VscNewFile } from "react-icons/vsc";
import { FaLayerGroup, FaList, FaPeopleCarry, FaSalesforce } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { server } from "../../server";

export const VENDOR_NAV_PRIMARY = [
  { id: 1, label: "Dashboard", to: "/dashboard", icon: HiOutlineViewGrid },
  { id: 16, label: "Analytics", to: "/dashboard", hash: "#vendor-analytics", icon: HiOutlineChartBar },
  { id: 3, label: "Products", to: "/dashboard-products", icon: HiOutlineCube },
  { id: 17, label: "Inventory", to: "/dashboard-products", hash: "#vendor-inventory", icon: HiOutlineArchive },
  { id: 2, label: "Orders", to: "/dashboard-orders", icon: HiOutlineShoppingBag },
  { id: 18, label: "Customers", to: "/dashboard-orders", hash: "#vendor-customers", icon: HiOutlineUserGroup },
  { id: 8, label: "Messages", to: "/dashboard-messages", icon: FiMessageSquare },
  { id: 19, label: "Reviews", to: "/dashboard", hash: "#vendor-reviews", icon: HiOutlineStar },
  { id: 9, label: "Coupons", to: "/dashboard-coupouns", icon: AiOutlineGift },
  { id: 22, label: "Campaigns", to: "/dashboard-campaigns", icon: FaSalesforce },
  { id: 23, label: "Seller Operations", to: "/dashboard-seller-operations", icon: HiOutlineArchive },
  { id: 24, label: "Property & Mobility", to: "/dashboard-property-mobility", icon: HiOutlineHome },
  { id: 20, label: "Earnings", to: "/dashboard-withdraw-money", hash: "#vendor-earnings", icon: HiOutlineCurrencyDollar },
  { id: 7, label: "Withdrawals", to: "/dashboard-withdraw-money", icon: HiOutlineCash },
  { id: 11, label: "Store Settings", to: "/settings", icon: HiOutlineCog },
  { id: 21, label: "Support", to: "/faq", icon: HiOutlineSupport, external: true },
];

export const VENDOR_NAV_TOOLS = [
  { id: 4, label: "Create Product", to: "/dashboard-create-product", icon: AiOutlineFolderAdd },
  { id: 5, label: "Events", to: "/dashboard-events", icon: MdOutlineLocalOffer },
  { id: 6, label: "Create Event", to: "/dashboard-create-event", icon: VscNewFile },
  { id: 10, label: "Refunds", to: "/dashboard-refunds", icon: HiOutlineReceiptRefund },
  { id: 12, label: "Create Flash Sale", to: "/dashboard-create-flashsale", icon: FaSalesforce },
  { id: 13, label: "Flash Sales", to: "/dashboard-flashsales", icon: FaList },
  { id: 14, label: "My Auctions", to: "/dashboard-bids", icon: FaPeopleCarry },
  { id: 15, label: "Start Auction", to: "/dashboard-start-auction", icon: FaLayerGroup },
];

export const VENDOR_TITLES = {
  1: "Seller Dashboard",
  2: "Orders",
  3: "Products",
  4: "Create Product",
  5: "Events",
  6: "Create Event",
  7: "Withdrawals",
  8: "Messages",
  9: "Coupons",
  22: "Campaigns",
  23: "Seller Operations",
  24: "Property & Mobility",
  10: "Refunds",
  11: "Store Settings",
  12: "Create Flash Sale",
  13: "Flash Sales",
  14: "My Auctions",
  15: "Start Auction",
  16: "Analytics",
  17: "Inventory",
  18: "Customers",
  19: "Reviews",
  20: "Earnings",
  21: "Support",
};

const isNavActive = (item, pathname, hash) => {
  if (item.hash) {
    return pathname === item.to && hash === item.hash;
  }
  if (pathname !== item.to) return false;
  if (item.to === "/dashboard" && hash) return false;
  if (item.to === "/dashboard-products" && hash === "#vendor-inventory") return false;
  if (item.to === "/dashboard-orders" && hash === "#vendor-customers") return false;
  if (item.to === "/dashboard-withdraw-money" && hash === "#vendor-earnings") return false;
  return true;
};

const VendorSidebar = ({ active, onNavigate, className = "" }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { seller } = useSelector((state) => state.seller);

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      Cookies.remove("seller_token");
      toast.success("Logged out successfully");
      window.location.reload();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const renderItem = (item) => {
    const Icon = item.icon;
    const href = item.hash ? `${item.to}${item.hash}` : item.to;
    const isActive =
      active === item.id ||
      isNavActive(item, location.pathname, location.hash);

    if (item.external) {
      return (
        <Link
          key={item.id}
          to={href}
          onClick={onNavigate}
          className={`dashboard-nav-item mb-1 ${isActive ? "is-active" : ""}`}
        >
          <Icon className="dashboard-nav-icon" size={20} />
          <span>{item.label}</span>
        </Link>
      );
    }

    return (
      <Link
        key={item.id}
        to={href}
        onClick={onNavigate}
        className={`dashboard-nav-item mb-1 ${isActive ? "is-active" : ""}`}
      >
        <Icon className="dashboard-nav-icon" size={20} />
        <span>{item.label}</span>
      </Link>
    );
  };

  return (
    <nav className={`dashboard-sidebar yebone-surface ${className}`} aria-label="Seller navigation">
      <div className="mb-4 px-2 hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Seller workspace</p>
        <p className="text-sm font-medium truncate dark:text-white mt-0.5">{seller?.name}</p>
      </div>

      <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 hidden lg:block">
        Overview
      </p>
      {VENDOR_NAV_PRIMARY.map(renderItem)}

      <p className="px-2 mt-4 mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 hidden lg:block">
        Tools
      </p>
      {VENDOR_NAV_TOOLS.map(renderItem)}

      <button type="button" onClick={toggleTheme} className="dashboard-nav-item mt-3">
        {theme === "dark" ? (
          <MdOutlineWbSunny className="dashboard-nav-icon" size={20} />
        ) : (
          <IoMoonOutline className="dashboard-nav-icon" size={20} />
        )}
        <span>Theme</span>
      </button>

      <button
        type="button"
        onClick={logoutHandler}
        className="dashboard-nav-item mt-2 text-red-500 hover:text-red-600"
      >
        <AiOutlineLogin className="dashboard-nav-icon" size={20} />
        <span>Logout</span>
      </button>
    </nav>
  );
};

export default VendorSidebar;
