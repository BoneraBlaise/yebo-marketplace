import React from "react";
import { ApplicationShell, AdminRouteShell } from "../../application";
import { AdminLayout } from "../../design-system/layouts";
import { Sidebar, TopNav, Breadcrumbs, NavNotifications, ThemeToggle } from "../../design-system/navigation";
import { Badge, Button } from "../../design-system/components";
import { PageContainer } from "../../ui-polish";
import { adminControlNavItems } from "../navigation/AdminNavigationConfig";
import { adminDiagnosticsShortcuts } from "../../application/navigation/NavigationConfig";
import { logAdminUIDiagnostics } from "../diagnostics/AdminUIDiagnostics";

/** Admin page wrapper — Application Shell + Control Center nav — Phase 8H.4 */
export const AdminPageShell = ({
  children,
  title = "YEBONE Control Center",
  activeNavId = "dashboard",
  breadcrumbs = [],
  pageName,
  systemStatus = "operational",
  notificationCount = 3,
}) => {
  logAdminUIDiagnostics("console", { page: pageName, activeNavId });

  const statusVariant = systemStatus === "operational" ? "success" : systemStatus === "degraded" ? "warning" : "error";
  const sidebar = <Sidebar items={adminControlNavItems} activeId={activeNavId} />;
  const header = (
    <>
      <TopNav
        title={title}
        actions={
          <>
            <div role="status" aria-label={`System status: ${systemStatus}`}>
              <Badge variant={statusVariant}>{systemStatus}</Badge>
            </div>
            <NavNotifications count={notificationCount} />
            <ThemeToggle />
            <div className="hidden lg:flex gap-1" role="toolbar" aria-label="Diagnostics shortcuts">
              {adminDiagnosticsShortcuts.map((item) => (
                <Button key={item.id} size="sm" variant="ghost">{item.label}</Button>
              ))}
            </div>
            <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 text-xs" aria-label="Monitoring area">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Monitoring active
            </div>
          </>
        }
      />
      {breadcrumbs.length > 0 && <Breadcrumbs items={breadcrumbs} className="px-4 py-2" />}
    </>
  );

  return (
    <ApplicationShell routingScope="admin">
      <AdminRouteShell>
        <AdminLayout header={header} sidebar={sidebar}>
          <PageContainer id="main-content" tabIndex={-1} className="yebone-premium-screen">{children}</PageContainer>
        </AdminLayout>
      </AdminRouteShell>
    </ApplicationShell>
  );
};

export default AdminPageShell;
