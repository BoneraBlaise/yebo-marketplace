import React from "react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineLogin } from "react-icons/ai";
import {
  HiOutlineViewGrid,
  HiOutlineShoppingBag,
  HiOutlineUserGroup,
  HiOutlineCube,
  HiOutlineCash,
  HiOutlineChartBar,
  HiOutlineCurrencyDollar,
  HiOutlineReceiptRefund,
  HiOutlineCog,
  HiOutlineSupport,
  HiOutlineSparkles,
  HiOutlineCollection,
  HiOutlineDocumentReport,
  HiOutlineTruck,
  HiOutlineTrendingUp,
  HiOutlineClipboardList,
  HiOutlineTicket,
  HiOutlineArchive,
} from "react-icons/hi";
import { GrWorkshop } from "react-icons/gr";
import { MdOutlineLocalOffer } from "react-icons/md";
import { MdOutlineWbSunny } from "react-icons/md";
import { IoMoonOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { resolveAdminTier, isNavVisible } from "./admin/adminRoleConfig";

export const ADMIN_NAV_OVERVIEW = [
  { id: 1, label: "Dashboard", to: "/admin/dashboard", icon: HiOutlineViewGrid },
  { id: 25, label: "Reports", to: "/admin/dashboard", hash: "#admin-reports", icon: HiOutlineDocumentReport },
];

export const ADMIN_NAV_MANAGEMENT = [
  { id: 2, label: "Orders", to: "/admin-orders", icon: HiOutlineShoppingBag },
  { id: 3, label: "Vendors", to: "/admin-sellers", icon: GrWorkshop },
  { id: 4, label: "Customers", to: "/admin-users", icon: HiOutlineUserGroup },
  { id: 5, label: "Products", to: "/admin-products", icon: HiOutlineCube },
  { id: 19, label: "Categories", to: "/admin/dashboard", hash: "#admin-categories", icon: HiOutlineCollection },
  { id: 6, label: "Events", to: "/admin-events", icon: MdOutlineLocalOffer },
  { id: 7, label: "Withdrawals", to: "/admin-withdraw-request", icon: HiOutlineCash },
];

export const ADMIN_NAV_PLATFORM = [
  { id: 20, label: "Payment Center", to: "/admin/dashboard", hash: "#admin-payments", icon: HiOutlineCurrencyDollar },
  { id: 21, label: "Commission", to: "/admin/dashboard", hash: "#admin-commission", icon: HiOutlineChartBar },
  { id: 22, label: "Referrals", to: "/admin/dashboard", hash: "#admin-referrals", icon: HiOutlineReceiptRefund },
  { id: 23, label: "AI Control", to: "/admin/dashboard", hash: "#admin-ai", icon: HiOutlineSparkles },
  { id: 27, label: "Delivery Settings", to: "/admin/dashboard", hash: "#admin-delivery", icon: HiOutlineTruck },
  { id: 28, label: "Growth Settings", to: "/admin/dashboard", hash: "#admin-growth", icon: HiOutlineTrendingUp },
  { id: 29, label: "Commission Rules", to: "/admin/dashboard", hash: "#admin-commission-rules", icon: HiOutlineClipboardList },
  { id: 30, label: "Coupon Monitor", to: "/admin/dashboard", hash: "#admin-coupon-monitor", icon: HiOutlineTicket },
  { id: 31, label: "Growth Commerce", to: "/admin/growth-commerce", icon: HiOutlineTrendingUp },
  { id: 32, label: "Seller Operations", to: "/admin/seller-operations", icon: HiOutlineArchive },
  { id: 24, label: "System Settings", to: "/admin/dashboard", hash: "#admin-settings", icon: HiOutlineCog },
  { id: 26, label: "Support", to: "/admin/dashboard", hash: "#admin-support", icon: HiOutlineSupport },
];

export const ADMIN_TITLES = {
  1: "Admin Dashboard",
  2: "Order Management",
  3: "Vendor Management",
  4: "Customer Management",
  5: "Product Management",
  6: "Events",
  7: "Withdrawal Management",
  19: "Category Management",
  20: "Payment Center",
  21: "Commission Management",
  22: "Referral Management",
  23: "AI Control Center",
  27: "Delivery Settings",
  28: "Growth Settings",
  29: "Commission Rules",
  30: "Coupon Monitor",
  31: "Growth Commerce",
  32: "Seller Operations",
  24: "System Settings",
  25: "Executive Reports",
  26: "Support Center",
};

const isNavActive = (item, pathname, hash, active) => {
  if (active === item.id) return true;
  if (item.hash) return pathname === item.to && hash === item.hash;
  if (pathname !== item.to) return false;
  if (item.to === "/admin/dashboard" && hash) return false;
  return true;
};

const AdminSidebar = ({ active, onNavigate, className = "", collapsed = false }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.user);
  const tier = resolveAdminTier(user);

  const renderSection = (label, items) => {
    const visible = items.filter((item) => isNavVisible(item.id, tier));
    if (visible.length === 0) return null;

    return (
      <>
        {!collapsed && (
          <p className="px-2 mb-2 mt-3 first:mt-0 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {label}
          </p>
        )}
        {visible.map((item) => {
          const Icon = item.icon;
          const href = item.hash ? `${item.to}${item.hash}` : item.to;
          const isActive = isNavActive(item, location.pathname, location.hash, active);

          return (
            <Link
              key={item.id}
              to={href}
              onClick={onNavigate}
              title={item.label}
              className={`dashboard-nav-item mb-1 ${isActive ? "is-active" : ""} ${
                collapsed ? "justify-center !px-2" : ""
              }`}
            >
              <Icon className="dashboard-nav-icon" size={20} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </>
    );
  };

  return (
    <nav
      className={`dashboard-sidebar yebone-surface admin-sidebar ${collapsed ? "admin-sidebar-collapsed" : ""} ${className}`}
      aria-label="Admin navigation"
    >
      {!collapsed && (
        <div className="mb-4 px-2 hidden lg:block">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
            {tier === "super" ? "Super Admin" : "Assistant Admin"}
          </p>
          <p className="text-sm font-medium truncate dark:text-white mt-0.5">{user?.name}</p>
        </div>
      )}

      {renderSection("Overview", ADMIN_NAV_OVERVIEW)}
      {renderSection("Management", ADMIN_NAV_MANAGEMENT)}
      {renderSection("Platform", ADMIN_NAV_PLATFORM)}

      <button
        type="button"
        onClick={toggleTheme}
        className={`dashboard-nav-item mt-3 ${collapsed ? "justify-center !px-2" : ""}`}
        title="Theme"
      >
        {theme === "dark" ? (
          <MdOutlineWbSunny className="dashboard-nav-icon" size={20} />
        ) : (
          <IoMoonOutline className="dashboard-nav-icon" size={20} />
        )}
        {!collapsed && <span>Theme</span>}
      </button>

      <Link
        to="/"
        className={`dashboard-nav-item mt-2 text-red-500 hover:text-red-600 ${collapsed ? "justify-center !px-2" : ""}`}
        title="Exit admin"
      >
        <AiOutlineLogin className="dashboard-nav-icon" size={20} />
        {!collapsed && <span>Exit Admin</span>}
      </Link>
    </nav>
  );
};

export default AdminSidebar;
