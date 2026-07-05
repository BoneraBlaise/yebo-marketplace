import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineBell, HiOutlineSearch, HiOutlineChevronDown } from "react-icons/hi";
import { useSelector } from "react-redux";
import { resolveAdminTier } from "./admin/adminRoleConfig";

const AdminTopbar = ({ onSearch, collapsed, onToggleSidebar }) => (
  <div className="admin-topbar flex flex-wrap items-center gap-2 sm:gap-3">
    {onToggleSidebar && (
      <button
        type="button"
        onClick={onToggleSidebar}
        className="hidden lg:flex p-2 rounded-xl yebone-surface text-xs font-medium text-gray-500 hover:text-yebone-primary"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? "→" : "←"}
      </button>
    )}
    <div className="relative flex-1 min-w-[140px] max-w-xs hidden md:block">
      <HiOutlineSearch
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={16}
      />
      <input
        type="search"
        placeholder="Search platform…"
        onChange={(e) => onSearch?.(e.target.value)}
        className="admin-search-input w-full pl-9 pr-3 py-2 rounded-xl yebone-surface text-sm dark:text-white"
      />
    </div>
    <AdminTopbarActions />
  </div>
);

export const AdminTopbarActions = () => {
  const { user } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(false);
  const tier = resolveAdminTier(user);

  return (
    <>
      <button
        type="button"
        className="p-2.5 rounded-xl yebone-surface relative"
        aria-label="Notifications"
      >
        <HiOutlineBell size={20} className="text-yebone-primary" />
        <span className="absolute top-2 right-2 w-2 h-2 bg-yebone-accent rounded-full" />
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-xl yebone-surface"
        >
          <img
            src={user?.avatar?.url}
            alt=""
            className="w-8 h-8 rounded-full object-cover border border-yebone-primary/20"
          />
          <span className="hidden sm:block text-sm font-medium dark:text-white max-w-[100px] truncate">
            {user?.name?.split(" ")[0]}
          </span>
          <HiOutlineChevronDown size={16} className="text-gray-400" />
        </button>
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-hidden />
            <div className="absolute right-0 top-full mt-2 w-48 z-50 dashboard-section yebone-surface shadow-xl py-2">
              <p className="px-4 py-2 text-xs text-gray-400 uppercase tracking-wide">
                {tier === "super" ? "Super Admin" : "Assistant Admin"}
              </p>
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-yebone-primary/5 dark:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
              <Link
                to="/admin/dashboard"
                className="block px-4 py-2 text-sm hover:bg-yebone-primary/5 dark:text-white"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminTopbar;
