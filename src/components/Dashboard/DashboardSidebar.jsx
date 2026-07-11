import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AiOutlineLogin } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import {
  HiOutlineReceiptRefund,
  HiOutlineShoppingBag,
  HiOutlineViewGrid,
  HiOutlineHeart,
  HiOutlineLocationMarker,
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineUserGroup,
} from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
  MdOutlineWbSunny,
} from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { RxPerson } from "react-icons/rx";
import { IoMoonOutline } from "react-icons/io5";
import { FaCreativeCommonsSamplingPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { logoutUser } from "../../config/authService";

export const DASHBOARD_NAV = [
  { id: 0, labelKey: "Dashboard", icon: HiOutlineViewGrid, fallback: "Dashboard" },
  { id: 1, labelKey: "profile.myProfile", icon: RxPerson, fallback: "Profile" },
  { id: 2, labelKey: "profile.orders", icon: HiOutlineShoppingBag, fallback: "My Orders" },
  { id: 5, labelKey: "profile.trackOrder", icon: MdOutlineTrackChanges, fallback: "Track Orders" },
  { id: 10, labelKey: "Wishlist", icon: HiOutlineHeart, fallback: "Wishlist" },
  { id: 9, labelKey: "profile.commissionDashboard", icon: FaCreativeCommonsSamplingPlus, fallback: "Commission" },
  { id: 11, labelKey: "Referrals", icon: HiOutlineUserGroup, fallback: "Referral Center" },
  { id: 7, labelKey: "profile.address", icon: HiOutlineLocationMarker, fallback: "Addresses" },
  { id: 12, labelKey: "Notifications", icon: HiOutlineBell, fallback: "Notifications" },
  { id: 4, labelKey: "profile.inbox", icon: FiMessageSquare, fallback: "Messages", external: "/inbox" },
  { id: 13, labelKey: "Settings", icon: HiOutlineCog, fallback: "Account Settings" },
  { id: 3, labelKey: "profile.refunds", icon: HiOutlineReceiptRefund, fallback: "Refunds" },
  { id: 6, labelKey: "profile.changePassword", icon: RiLockPasswordLine, fallback: "Password" },
];

export const DASHBOARD_TITLES = {
  0: "Dashboard",
  1: "My Profile",
  2: "My Orders",
  3: "Refunds",
  4: "Messages",
  5: "Track Orders",
  6: "Change Password",
  7: "Saved Addresses",
  9: "Commission Center",
  10: "Wishlist",
  11: "Referral Center",
  12: "Notifications",
  13: "Account Settings",
};

const DashboardSidebar = ({ active, setActive, onNavigate, className = "" }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const logoutHandler = async () => {
    await logoutUser();
    toast.success("Logged out");
    navigate("/login");
    window.location.reload();
  };

  const handleNav = (item) => {
    if (item.external) {
      navigate(item.external);
      onNavigate?.();
      return;
    }
    setActive(item.id);
    onNavigate?.();
  };

  return (
    <nav className={`dashboard-sidebar yebone-surface ${className}`} aria-label="Account navigation">
      <div className="mb-4 px-2 hidden lg:block">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Account</p>
        <p className="text-sm font-medium truncate dark:text-white mt-0.5">{user?.name}</p>
      </div>

      {DASHBOARD_NAV.map((item) => {
        const Icon = item.icon;
        const label = t(item.labelKey, item.fallback);
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleNav(item)}
            className={`dashboard-nav-item mb-1 ${active === item.id ? "is-active" : ""}`}
          >
            <Icon className="dashboard-nav-icon" size={20} />
            <span>{label}</span>
          </button>
        );
      })}

      <button type="button" onClick={toggleTheme} className="dashboard-nav-item mt-2">
        {theme === "dark" ? (
          <MdOutlineWbSunny className="dashboard-nav-icon" size={20} />
        ) : (
          <IoMoonOutline className="dashboard-nav-icon" size={20} />
        )}
        <span>{t("profile.theme")}</span>
      </button>

      {user?.role === "Admin" && (
        <Link to="/admin/dashboard" className="dashboard-nav-item mt-1" onClick={onNavigate}>
          <MdOutlineAdminPanelSettings className="dashboard-nav-icon" size={20} />
          <span>{t("profile.adminDashboard")}</span>
        </Link>
      )}

      <button type="button" onClick={logoutHandler} className="dashboard-nav-item mt-2 text-red-500 hover:text-red-600">
        <AiOutlineLogin className="dashboard-nav-icon" size={20} />
        <span>{t("profile.logout")}</span>
      </button>
    </nav>
  );
};

export default DashboardSidebar;
