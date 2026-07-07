import React from "react";
import { CustomerLayout } from "../../design-system/layouts";
import { BottomNav } from "../../design-system/navigation";
import { GlobalNavigation } from "../navigation/GlobalNavigation";
import { customerNavItems, customerBottomNav } from "../navigation/NavigationConfig";
import { logShellDiagnostics } from "../diagnostics/ShellDiagnostics";

/** Customer portal layout shell — Phase 8H.1 */
export const CustomerLayoutShell = ({
  children,
  title = "YEBO Marketplace",
  activeNavId = "home",
  breadcrumbs = [],
  profileName = "Customer",
  notificationCount = 0,
  footer,
  className = "",
}) => {
  logShellDiagnostics("layout", { layout: "customer" });

  const header = (
    <>
      <GlobalNavigation
        variant="customer"
        title={title}
        activeId={activeNavId}
        breadcrumbs={breadcrumbs}
        profileName={profileName}
        notificationCount={notificationCount}
        chromeOnly
      />
      <div className="flex gap-2 px-4 py-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto" role="navigation" aria-label="Shopping shortcuts">
        {customerNavItems.slice(0, 4).map((item) => (
          <span key={item.id} className="text-xs whitespace-nowrap px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{item.label}</span>
        ))}
      </div>
    </>
  );

  const mobileNav = <BottomNav items={customerBottomNav} activeId={activeNavId} />;

  return (
    <CustomerLayout
      className={className}
      header={header}
      footer={
        <>
          {mobileNav}
          {footer || (
            <footer className="border-t border-gray-200 dark:border-gray-700 px-4 py-6 text-center text-sm text-gray-500 pb-20 lg:pb-6" role="contentinfo">
              © YEBO Marketplace
            </footer>
          )}
        </>
      }
    >
      <div id="main-content" tabIndex={-1}>
        {children}
      </div>
    </CustomerLayout>
  );
};

export default CustomerLayoutShell;
