/** Application shell route categories — Phase 8H.1 */

export const ROUTE_SCOPE = {
  PUBLIC: "public",
  AUTHENTICATED: "authenticated",
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ADMIN: "admin",
  ERROR: "error",
};

export const routeConfig = {
  public: [
    { id: "home", path: "/", scope: ROUTE_SCOPE.PUBLIC, lazy: true },
    { id: "products", path: "/products", scope: ROUTE_SCOPE.PUBLIC, lazy: true },
    { id: "login", path: "/login", scope: ROUTE_SCOPE.PUBLIC, lazy: true },
  ],
  authenticated: [
    { id: "profile", path: "/profile", scope: ROUTE_SCOPE.AUTHENTICATED, lazy: true },
    { id: "checkout", path: "/checkout", scope: ROUTE_SCOPE.AUTHENTICATED, lazy: true },
  ],
  customer: [
    { id: "orders", path: "/orders", scope: ROUTE_SCOPE.CUSTOMER, lazy: true },
    { id: "inbox", path: "/inbox", scope: ROUTE_SCOPE.CUSTOMER, lazy: true },
  ],
  vendor: [
    { id: "shop-dashboard", path: "/shop/dashboard", scope: ROUTE_SCOPE.VENDOR, lazy: true },
    { id: "shop-products", path: "/shop/products", scope: ROUTE_SCOPE.VENDOR, lazy: true },
  ],
  admin: [
    { id: "admin-dashboard", path: "/admin/dashboard", scope: ROUTE_SCOPE.ADMIN, lazy: true },
    { id: "admin-users", path: "/admin/users", scope: ROUTE_SCOPE.ADMIN, lazy: true },
  ],
  error: [
    { id: "not-found", path: "*", scope: ROUTE_SCOPE.ERROR, lazy: false },
    { id: "forbidden", path: "/403", scope: ROUTE_SCOPE.ERROR, lazy: false },
  ],
};

export const getRoutesByScope = (scope) => {
  const all = Object.values(routeConfig).flat();
  return scope ? all.filter((r) => r.scope === scope) : all;
};

export default routeConfig;
