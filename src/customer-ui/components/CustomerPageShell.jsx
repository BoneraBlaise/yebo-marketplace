import React from "react";
import { ApplicationShell } from "../../application";
import { CustomerLayoutShell } from "../../application";
import { CustomerRouteShell } from "../../application";
import { logCustomerUIDiagnostics } from "../diagnostics/CustomerUIDiagnostics";

/** Page wrapper — Application Shell + Customer Layout — Phase 8H.2 */
export const CustomerPageShell = ({
  children,
  title,
  activeNavId = "home",
  breadcrumbs = [],
  pageName,
}) => {
  logCustomerUIDiagnostics("page", { page: pageName, activeNavId });

  return (
    <ApplicationShell routingScope="customer">
      <CustomerRouteShell>
        <CustomerLayoutShell title={title} activeNavId={activeNavId} breadcrumbs={breadcrumbs}>
          {children}
        </CustomerLayoutShell>
      </CustomerRouteShell>
    </ApplicationShell>
  );
};

export default CustomerPageShell;
