import React from "react";
import { focusRingClass, a11yProps } from "../accessibility";
import { motionClasses } from "../motion/MotionSystem";
import { polishClasses } from "../../ui-polish/polishClasses";
import { ThemeToggle } from "./ThemeToggle";

export const Sidebar = ({ items = [], activeId, onSelect, className = "" }) => (
  <aside className={`w-full lg:w-64 xl:w-72 shrink-0 border-r border-gray-200 dark:border-gray-700 p-4 lg:p-5 bg-white/50 dark:bg-gray-900/50 ${className}`} {...a11yProps.navigation("Sidebar")}>
    <nav className="space-y-1">
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelect?.(item.id)}
          className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium ${focusRingClass} ${motionClasses.micro} ${
            activeId === item.id
              ? "bg-yebone-primary text-white shadow-sm"
              : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          }`}
        >
          {item.label}
        </button>
      ))}
    </nav>
  </aside>
);

export const TopNav = ({ title, actions, className = "" }) => (
  <header className={`sticky top-0 z-[1100] flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 dark:border-gray-700 ${polishClasses.navGlass} ${className}`}>
    <h1 className="font-Poppins text-lg md:text-xl font-semibold tracking-tight truncate">{title}</h1>
    <div className="flex items-center gap-2 md:gap-3 shrink-0">{actions}</div>
  </header>
);

export const BottomNav = ({ items = [], activeId, onSelect, className = "" }) => (
  <nav className={`fixed bottom-0 inset-x-0 flex justify-around bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden z-[1100] ${className}`} {...a11yProps.navigation("Bottom navigation")}>
    {items.map((item) => (
      <button
        key={item.id}
        type="button"
        onClick={() => onSelect?.(item.id)}
        className={`flex flex-col items-center gap-0.5 text-[10px] md:text-xs px-2 py-1 rounded-lg ${focusRingClass} ${motionClasses.micro} ${
          activeId === item.id ? "text-yebone-primary font-semibold" : "text-gray-500"
        }`}
        aria-current={activeId === item.id ? "page" : undefined}
      >
        {item.icon}
        <span>{item.label}</span>
      </button>
    ))}
  </nav>
);

export const Breadcrumbs = ({ items = [], className = "" }) => (
  <nav aria-label="Breadcrumb" className={`text-sm text-gray-500 dark:text-gray-400 px-4 md:px-6 py-2 ${className}`}>
    {items.map((item, i) => (
      <span key={item.id || i}>
        {i > 0 && <span aria-hidden="true" className="mx-1.5">/</span>}
        <span className={i === items.length - 1 ? "text-yebone-primary font-medium" : ""}>{item.label}</span>
      </span>
    ))}
  </nav>
);

export const NavSearch = ({ placeholder = "Search...", value, onChange, className = "" }) => (
  <input type="search" placeholder={placeholder} value={value} onChange={onChange} className={`px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm min-w-[140px] md:min-w-[200px] ${focusRingClass} ${className}`} aria-label="Search" />
);

export const CommandPalette = ({ open, children }) => open ? (
  <div role="dialog" aria-modal="true" aria-label="Command palette" className={`fixed inset-0 z-[1400] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[15vh] md:pt-[20vh] ${motionClasses.dialog}`}>
    <div className="w-full max-w-lg mx-4 rounded-2xl shadow-yebo-lg overflow-hidden">{children}</div>
  </div>
) : null;

export const NavNotifications = ({ count = 0, onClick }) => (
  <button type="button" onClick={onClick} className={`relative p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${focusRingClass}`} aria-label={`Notifications${count ? `, ${count} unread` : ""}`}>
    <span aria-hidden="true">🔔</span>
    {count > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[1rem] h-4 px-1 flex items-center justify-center">{count}</span>}
  </button>
);

export const ProfileMenu = ({ name, onLogout }) => (
  <div className="flex items-center gap-2 md:gap-3">
    <span className="text-sm font-medium hidden sm:inline truncate max-w-[120px]">{name}</span>
    <button type="button" onClick={onLogout} className={`text-sm text-gray-500 hover:text-yebone-primary ${focusRingClass}`}>Logout</button>
  </div>
);

export const OrganizationSwitcher = ({ organizations = [], current, onChange }) => (
  <select value={current} onChange={(e) => onChange?.(e.target.value)} className={`text-sm border border-gray-300 dark:border-gray-600 rounded-xl px-3 py-1.5 bg-white dark:bg-gray-800 ${focusRingClass}`} aria-label="Switch organization">
    {organizations.map((org) => <option key={org.id} value={org.id}>{org.name}</option>)}
  </select>
);

export { ThemeToggle };

export default { Sidebar, TopNav, BottomNav, Breadcrumbs, NavSearch, CommandPalette, NavNotifications, ProfileMenu, OrganizationSwitcher, ThemeToggle };
