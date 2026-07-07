import React from "react";
import { focusRingClass, a11yProps } from "../accessibility";

export const Sidebar = ({ items = [], activeId, onSelect, className = "" }) => (
  <aside className={`w-full lg:w-64 border-r border-gray-200 dark:border-gray-700 p-4 ${className}`} {...a11yProps.navigation("Sidebar")}>
    <nav className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item.id)}
          className={`w-full text-left px-3 py-2 rounded-lg text-sm ${focusRingClass} ${activeId === item.id ? "bg-yebone-primary text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  </aside>
);

export const TopNav = ({ title, actions, className = "" }) => (
  <header className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    <h1 className="font-Poppins text-lg font-semibold">{title}</h1>
    <div className="flex items-center gap-2">{actions}</div>
  </header>
);

export const BottomNav = ({ items = [], activeId, className = "" }) => (
  <nav className={`fixed bottom-0 inset-x-0 flex justify-around bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-2 lg:hidden ${className}`} {...a11yProps.navigation("Bottom navigation")}>
    {items.map((item) => (
      <button key={item.id} type="button" className={`flex flex-col items-center text-xs ${focusRingClass} ${activeId === item.id ? "text-yebone-primary" : "text-gray-500"}`}>
        {item.icon}{item.label}
      </button>
    ))}
  </nav>
);

export const Breadcrumbs = ({ items = [], className = "" }) => (
  <nav aria-label="Breadcrumb" className={`text-sm text-gray-500 ${className}`}>
    {items.map((item, i) => (
      <span key={item.id || i}>
        {i > 0 && " / "}
        <span className={i === items.length - 1 ? "text-yebone-primary font-medium" : ""}>{item.label}</span>
      </span>
    ))}
  </nav>
);

export const NavSearch = ({ placeholder = "Search...", value, onChange, className = "" }) => (
  <input type="search" placeholder={placeholder} value={value} onChange={onChange} className={`px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 ${focusRingClass} ${className}`} aria-label="Search" />
);

export const CommandPalette = ({ open, children }) => open ? <div role="dialog" aria-modal="true" className="fixed inset-0 z-[1400] bg-black/50 flex items-start justify-center pt-[20vh]">{children}</div> : null;

export const NavNotifications = ({ count = 0, onClick }) => (
  <button type="button" onClick={onClick} className={`relative p-2 rounded-lg ${focusRingClass}`} aria-label={`Notifications${count ? `, ${count} unread` : ""}`}>
    🔔
    {count > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4">{count}</span>}
  </button>
);

export const ProfileMenu = ({ name, onLogout }) => (
  <div className="flex items-center gap-2">
    <span className="text-sm font-medium">{name}</span>
    <button type="button" onClick={onLogout} className={`text-sm text-gray-500 ${focusRingClass}`}>Logout</button>
  </div>
);

export const OrganizationSwitcher = ({ organizations = [], current, onChange }) => (
  <select value={current} onChange={(e) => onChange?.(e.target.value)} className={`text-sm border rounded-lg px-2 py-1 ${focusRingClass}`} aria-label="Switch organization">
    {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
  </select>
);

export default { Sidebar, TopNav, BottomNav, Breadcrumbs, NavSearch, CommandPalette, NavNotifications, ProfileMenu, OrganizationSwitcher };
