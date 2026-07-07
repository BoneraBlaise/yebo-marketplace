import React from "react";
import { VendorLayout } from "../../design-system/layouts";
import { Sidebar, TopNav, OrganizationSwitcher } from "../../design-system/navigation";
import { Button } from "../../design-system/components";
import { useBrand } from "../../design-system/brand/BrandProvider";
import { vendorNavItems, vendorQuickActions } from "../navigation/NavigationConfig";
import { logShellDiagnostics } from "../diagnostics/ShellDiagnostics";

/** Vendor workspace layout shell — Phase 8H.1 */
export const VendorLayoutShell = ({
  children,
  title = "Vendor Workspace",
  activeNavId = "dashboard",
  organizations = [],
  currentOrg,
  onOrgChange,
  className = "",
}) => {
  const brandCtx = useBrand();
  const brand = brandCtx?.brand || {};
  logShellDiagnostics("layout", { layout: "vendor", brandLoaded: !!brand.primaryColor });

  const sidebar = (
    <Sidebar items={vendorNavItems} activeId={activeNavId} />
  );

  const header = (
    <TopNav
      title={title}
      actions={
        <>
          {organizations.length > 0 && (
            <OrganizationSwitcher organizations={organizations} current={currentOrg} onChange={onOrgChange} />
          )}
          <div className="flex gap-1" role="toolbar" aria-label="Quick actions">
            {vendorQuickActions.map((action) => (
              <Button key={action.id} size="sm" variant="ghost">{action.label}</Button>
            ))}
          </div>
        </>
      }
    />
  );

  return (
    <VendorLayout className={className} header={header} sidebar={sidebar}>
      <div id="main-content" className="workspace-area" tabIndex={-1} data-org-brand={brand.name || "default"}>
        {children}
      </div>
    </VendorLayout>
  );
};

export default VendorLayoutShell;
