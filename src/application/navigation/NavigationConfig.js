/** Global navigation configuration — Phase 8H.1 */

export const customerNavItems = [
  { id: "home", label: "Home", path: "/" },
  { id: "products", label: "Products", path: "/products" },
  { id: "orders", label: "Orders", path: "/orders" },
  { id: "profile", label: "Profile", path: "/profile" },
];

export const customerBottomNav = [
  { id: "home", label: "Home", icon: "🏠" },
  { id: "search", label: "Search", icon: "🔍" },
  { id: "cart", label: "Cart", icon: "🛒" },
  { id: "profile", label: "Profile", icon: "👤" },
];

export const vendorNavItems = [
  { id: "dashboard", label: "Dashboard", path: "/shop/dashboard" },
  { id: "products", label: "Products", path: "/shop/products" },
  { id: "orders", label: "Orders", path: "/shop/orders" },
  { id: "settings", label: "Settings", path: "/shop/settings" },
];

export const vendorQuickActions = [
  { id: "add-product", label: "Add Product" },
  { id: "view-orders", label: "View Orders" },
  { id: "analytics", label: "Analytics" },
];

export const adminNavItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/dashboard" },
  { id: "users", label: "Users", path: "/admin/users" },
  { id: "sellers", label: "Sellers", path: "/admin/sellers" },
  { id: "orders", label: "Orders", path: "/admin/orders" },
  { id: "system", label: "System", path: "/admin/system" },
];

export const adminDiagnosticsShortcuts = [
  { id: "health", label: "Health Check" },
  { id: "logs", label: "View Logs" },
  { id: "metrics", label: "Metrics" },
];

export default {
  customerNavItems,
  customerBottomNav,
  vendorNavItems,
  vendorQuickActions,
  adminNavItems,
  adminDiagnosticsShortcuts,
};
