import React from "react";
import { ApplicationShell } from "../../application";
import { CustomerLayoutShell } from "../../application";
import { CustomerRouteShell } from "../../application";
import { ExperienceChrome, brandCopy, MARKETPLACE_NAME } from "../../ui-polish";
import { logCustomerUIDiagnostics } from "../diagnostics/CustomerUIDiagnostics";

/** Page wrapper — Application Shell + Customer Layout — Phase 8H.2 / 8I polish */
export const CustomerPageShell = ({
  children,
  title = MARKETPLACE_NAME,
  activeNavId = "home",
  breadcrumbs = [],
  pageName,
  showThemeToggle = true,
}) => {
  logCustomerUIDiagnostics("page", { page: pageName, activeNavId });

  const brandedFooter = (
    <footer className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 text-center text-sm text-gray-500" role="contentinfo">
      {brandCopy.marketplaceFooter} · Powered by YEBO AI
    </footer>
  );

  return (
    <ApplicationShell routingScope="customer">
      <CustomerRouteShell>
        <CustomerLayoutShell title={title} activeNavId={activeNavId} breadcrumbs={breadcrumbs} footer={brandedFooter}>
          <ExperienceChrome showThemeToggle={showThemeToggle} className="yebone-stack-flow">{children}</ExperienceChrome>
        </CustomerLayoutShell>
      </CustomerRouteShell>
    </ApplicationShell>
  );
};

export default CustomerPageShell;
