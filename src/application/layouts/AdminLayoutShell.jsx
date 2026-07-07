import React from "react";
import { AdminLayout } from "../../design-system/layouts";
import { Sidebar, TopNav } from "../../design-system/navigation";
import { Badge, Button } from "../../design-system/components";
import { adminNavItems, adminDiagnosticsShortcuts } from "../navigation/NavigationConfig";
import { logShellDiagnostics } from "../diagnostics/ShellDiagnostics";

/** Admin workspace layout shell — Phase 8H.1 */
export const AdminLayoutShell = ({
  children,
  title = "Admin Console",
  activeNavId = "dashboard",
  systemStatus = "operational",
  className = "",
}) => {
  logShellDiagnostics("layout", { layout: "admin", systemStatus });

  const statusVariant =
    systemStatus === "operational" ? "success" :
    systemStatus === "degraded" ? "warning" : "error";

  const sidebar = (
    <Sidebar items={adminNavItems} activeId={activeNavId} />
  );

  const header = (
    <TopNav
      title={title}
      actions={
        <>
          <div className="flex items-center gap-2" role="status" aria-label={`System status: ${systemStatus}`}>
            <Badge variant={statusVariant}>{systemStatus}</Badge>
          </div>
          <div className="flex gap-1" role="toolbar" aria-label="Diagnostics shortcuts">
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
  );

  return (
    <AdminLayout className={className} header={header} sidebar={sidebar}>
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
    </AdminLayout>
  );
};

export default AdminLayoutShell;
