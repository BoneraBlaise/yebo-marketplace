import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AiOutlineLogin, AiOutlineGift } from "react-icons/ai";
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
  HiOutlineChevronDown,
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
import { markSellerSessionSkipped } from "../../utils/sellerSession";

export const VENDOR_NAV_GROUPS = [
  {
    id: "overview",
    label: "Overview",
    defaultOpen: true,
    items: [
      { id: 1, label: "Dashboard", to: "/dashboard", icon: HiOutlineViewGrid },
      { id: 16, label: "Analytics", to: "/dashboard", hash: "#vendor-analytics", icon: HiOutlineChartBar },
    ],
  },
  {
    id: "commerce",
    label: "Commerce",
    defaultOpen: true,
    items: [
      { id: 3, label: "Products", to: "/dashboard-products", icon: HiOutlineCube },
      { id: 2, label: "Orders", to: "/dashboard-orders", icon: HiOutlineShoppingBag },
      { id: 17, label: "Inventory", to: "/dashboard-products", hash: "#vendor-inventory", icon: HiOutlineArchive },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    defaultOpen: false,
    items: [
      { id: 24, label: "Property & Mobility", to: "/dashboard-property-mobility", icon: HiOutlineHome },
      { id: 23, label: "Seller Operations", to: "/dashboard-seller-operations", icon: HiOutlineArchive },
      { id: 5, label: "Events", to: "/dashboard-events", icon: MdOutlineLocalOffer },
      { id: 10, label: "Refunds", to: "/dashboard-refunds", icon: HiOutlineReceiptRefund },
      { id: 13, label: "Flash Sales", to: "/dashboard-flashsales", icon: FaList },
      { id: 14, label: "My Auctions", to: "/dashboard-bids", icon: FaPeopleCarry },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    defaultOpen: false,
    items: [
      { id: 22, label: "Campaigns", to: "/dashboard-campaigns", icon: FaSalesforce },
      { id: 9, label: "Coupons", to: "/dashboard-coupouns", icon: AiOutlineGift },
    ],
  },
  {
    id: "customers",
    label: "Customers",
    defaultOpen: true,
    items: [
      { id: 18, label: "Customers", to: "/dashboard-orders", hash: "#vendor-customers", icon: HiOutlineUserGroup },
      { id: 8, label: "Messages", to: "/dashboard-messages", icon: FiMessageSquare },
      { id: 19, label: "Reviews", to: "/dashboard", hash: "#vendor-reviews", icon: HiOutlineStar },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    defaultOpen: false,
    items: [
      { id: 11, label: "Store Settings", to: "/settings", icon: HiOutlineCog },
      { id: 20, label: "Earnings", to: "/dashboard-withdraw-money", hash: "#vendor-earnings", icon: HiOutlineCurrencyDollar },
      { id: 7, label: "Withdrawals", to: "/dashboard-withdraw-money", icon: HiOutlineCash },
      { id: 21, label: "Support", to: "/faq", icon: HiOutlineSupport, external: true },
    ],
  },
];

/** Flat list for backward compatibility */
export const VENDOR_NAV_PRIMARY = VENDOR_NAV_GROUPS.flatMap((g) => g.items);

export const VENDOR_NAV_TOOLS = [
  { id: 6, label: "Create Event", to: "/dashboard-create-event", icon: VscNewFile },
  { id: 12, label: "Create Flash Sale", to: "/dashboard-create-flashsale", icon: FaSalesforce },
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

  const [collapsed, setCollapsed] = useState(() =>
    Object.fromEntries(VENDOR_NAV_GROUPS.map((g) => [g.id, !g.defaultOpen]))
  );

  const logoutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, { withCredentials: true });
      Cookies.remove("seller_token");
      markSellerSessionSkipped();
      toast.success("Seller session ended");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleGroup = (groupId) => {
    setCollapsed((prev) => ({ ...prev, [groupId]: !prev[groupId] }));
  };

  const renderItem = (item) => {
    const Icon = item.icon;
    const href = item.hash ? `${item.to}${item.hash}` : item.to;
    const isActive =
      active === item.id ||
      isNavActive(item, location.pathname, location.hash);

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
      <div className="mb-5 px-2 hidden lg:block">
        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Seller workspace</p>
        <p className="text-sm font-medium truncate dark:text-white mt-1">{seller?.name}</p>
      </div>

      {VENDOR_NAV_GROUPS.map((group) => {
        const isCollapsed = collapsed[group.id];
        return (
          <div
            key={group.id}
            className={`seller-xp-sidebar-group ${isCollapsed ? "is-collapsed" : ""}`}
          >
            <button
              type="button"
              className="seller-xp-sidebar-toggle"
              onClick={() => toggleGroup(group.id)}
              aria-expanded={!isCollapsed}
            >
              <span>{group.label}</span>
              <HiOutlineChevronDown
                size={14}
                className={`transition-transform ${isCollapsed ? "" : "rotate-180"}`}
              />
            </button>
            <div className="seller-xp-sidebar-group__items">
              {group.items.map(renderItem)}
            </div>
          </div>
        );
      })}

      <button type="button" onClick={toggleTheme} className="dashboard-nav-item mt-4">
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
