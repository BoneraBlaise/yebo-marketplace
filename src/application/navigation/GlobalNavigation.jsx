import React, { useState } from "react";
import {
  Sidebar,
  TopNav,
  BottomNav,
  Breadcrumbs,
  NavSearch,
  CommandPalette,
  NavNotifications,
  ProfileMenu,
  OrganizationSwitcher,
} from "../../design-system/navigation";
import { Button } from "../../design-system/components";
import { customerNavItems, customerBottomNav, vendorNavItems, adminNavItems } from "./NavigationConfig";

/** Global navigation infrastructure — Phase 8H.1 */
export const GlobalNavigation = ({
  variant = "customer",
  title = "YEBO",
  breadcrumbs = [],
  activeId,
  profileName = "User",
  notificationCount = 0,
  organizations = [],
  currentOrg,
  onOrgChange,
  onCommandPaletteOpen,
  chromeOnly = false,
  children,
}) => {
  const [search, setSearch] = useState("");
  const [cmdOpen, setCmdOpen] = useState(false);

  const navItems =
    variant === "vendor" ? vendorNavItems :
    variant === "admin" ? adminNavItems :
    customerNavItems;

  const header = (
    <TopNav
      title={title}
      actions={
        <>
          <NavSearch value={search} onChange={(e) => setSearch(e.target.value)} className="hidden md:block w-48 lg:w-64" />
          <NavNotifications count={notificationCount} />
          {organizations.length > 0 && (
            <OrganizationSwitcher organizations={organizations} current={currentOrg} onChange={onOrgChange} />
          )}
          <ProfileMenu name={profileName} />
          <Button size="sm" variant="ghost" onClick={() => { setCmdOpen(true); onCommandPaletteOpen?.(); }} aria-label="Open command palette">
            ⌘K
          </Button>
        </>
      }
    />
  );

  const sidebar = (variant === "vendor" || variant === "admin") ? (
    <Sidebar items={navItems} activeId={activeId} />
  ) : null;

  const bottomNav = variant === "customer" ? (
    <BottomNav items={customerBottomNav} activeId={activeId} />
  ) : null;

  if (chromeOnly) {
    return (
      <>
        {header}
        {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="px-4 py-2" />}
        <CommandPalette open={cmdOpen}>
          <div className="bg-white dark:bg-gray-900 rounded-xl p-4 w-full max-w-lg mx-4 shadow-xl">
            <NavSearch placeholder="Type a command..." className="w-full" />
            <button type="button" className="mt-2 text-sm text-gray-500" onClick={() => setCmdOpen(false)}>Close</button>
          </div>
        </CommandPalette>
      </>
    );
  }

  return (
    <>
      {header}
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="px-4 py-2" />}
      <div className="flex flex-col lg:flex-row flex-1">
        {sidebar}
        <div className="flex-1 pb-16 lg:pb-0">{children}</div>
      </div>
      {bottomNav}
      <CommandPalette open={cmdOpen}>
        <div className="bg-white dark:bg-gray-900 rounded-xl p-4 w-full max-w-lg mx-4 shadow-xl">
          <NavSearch placeholder="Type a command..." className="w-full" />
          <button type="button" className="mt-2 text-sm text-gray-500" onClick={() => setCmdOpen(false)}>Close</button>
        </div>
      </CommandPalette>
    </>
  );
};

export default GlobalNavigation;
