import React from "react";
import { logDesignSystemDiagnostics } from "../diagnostics/DesignSystemDiagnostics";

const shellClass = "min-h-screen bg-[var(--yebone-bg,#F6F6F5)] text-[var(--yebone-fg,#313131)] dark:bg-[#1f1f1f] dark:text-gray-100";

const makeLayout = (name) =>
  function Layout({ header, sidebar, footer, children, className = "" }) {
    logDesignSystemDiagnostics("layout", { layout: name });
    return (
      <div className={`${shellClass} ${className}`} data-layout={name}>
        {header}
        <div className="flex flex-col lg:flex-row">
          {sidebar}
          <main className="flex-1 p-4 md:p-6 lg:p-8" role="main">
            {children}
          </main>
        </div>
        {footer}
      </div>
    );
  };

export const CustomerLayout = makeLayout("customer");
export const VendorLayout = makeLayout("vendor");
export const AdminLayout = makeLayout("admin");
export const AuthLayout = ({ children, className = "" }) => (
  <div className={`${shellClass} flex items-center justify-center p-4 ${className}`} data-layout="auth">
    <div className="w-full max-w-md">{children}</div>
  </div>
);
export const SettingsLayout = makeLayout("settings");
export const DashboardLayout = makeLayout("dashboard");
export const ResponsiveLayout = ({ children, className = "" }) => (
  <div className={`${shellClass} w-full ${className}`} data-layout="responsive">
    {children}
  </div>
);

export default { CustomerLayout, VendorLayout, AdminLayout, AuthLayout, SettingsLayout, DashboardLayout, ResponsiveLayout };
