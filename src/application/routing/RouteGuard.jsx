import React from "react";

/** Route guard structure — no authentication logic — Phase 8H.1 */
export const RouteGuard = ({ scope, children, fallback = null }) => (
  <div data-route-guard={scope} aria-hidden="true">
    {children ?? fallback}
  </div>
);

export const PublicRouteShell = ({ children }) => <RouteGuard scope="public">{children}</RouteGuard>;
export const AuthenticatedRouteShell = ({ children }) => <RouteGuard scope="authenticated">{children}</RouteGuard>;
export const CustomerRouteShell = ({ children }) => <RouteGuard scope="customer">{children}</RouteGuard>;
export const VendorRouteShell = ({ children }) => <RouteGuard scope="vendor">{children}</RouteGuard>;
export const AdminRouteShell = ({ children }) => <RouteGuard scope="admin">{children}</RouteGuard>;
export const ErrorRouteShell = ({ children }) => <RouteGuard scope="error">{children}</RouteGuard>;

export default RouteGuard;
