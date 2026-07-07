import React from "react";
import { ApplicationShell, VendorRouteShell } from "../../application";
import { VendorLayout } from "../../design-system/layouts";
import { Sidebar, TopNav, Breadcrumbs, NavNotifications, OrganizationSwitcher, ThemeToggle } from "../../design-system/navigation";
import { Button } from "../../design-system/components";
import { PageContainer } from "../../ui-polish";
import { useBrand } from "../../design-system/brand/BrandProvider";
import { vendorWorkspaceNavItems, vendorQuickActions } from "../navigation/VendorNavigationConfig";
import { logVendorUIDiagnostics } from "../diagnostics/VendorUIDiagnostics";

/** Vendor page wrapper — Application Shell + extended workspace nav — Phase 8H.3 */
export const VendorPageShell = ({
  children,
  title = "Vendor Workspace",
  activeNavId = "dashboard",
  breadcrumbs = [],
  pageName,
  notificationCount = 0,
}) => {
  const brandCtx = useBrand();
  const brand = brandCtx?.brand || {};

  logVendorUIDiagnostics("workspace", { page: pageName, activeNavId, brand: brand.name });

  const sidebar = <Sidebar items={vendorWorkspaceNavItems} activeId={activeNavId} />;
  const header = (
    <>
      <TopNav
        title={title}
        actions={
          <>
            <NavNotifications count={notificationCount} />
            <ThemeToggle />
            <OrganizationSwitcher organizations={[{ id: "org-1", name: brand.name || "My Store" }]} current="org-1" />
            <div className="hidden md:flex gap-1" role="toolbar" aria-label="Quick actions">
              {vendorQuickActions.map((a) => <Button key={a.id} size="sm" variant="ghost">{a.label}</Button>)}
            </div>
          </>
        }
      />
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="px-4 py-2" />}
    </>
  );

  return (
    <ApplicationShell routingScope="vendor" brand={brand}>
      <VendorRouteShell>
        <VendorLayout header={header} sidebar={sidebar}>
          <PageContainer id="main-content" tabIndex={-1} className="yebone-premium-screen">{children}</PageContainer>
        </VendorLayout>
      </VendorRouteShell>
    </ApplicationShell>
  );
};

export default VendorPageShell;
