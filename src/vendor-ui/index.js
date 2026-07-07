/** YEBO Vendor Operating Workspace — Phase 8H.3 */

/* Pages */
export { default as VendorDashboardPage } from "./pages/VendorDashboardPage";
export { default as VendorProductsPage } from "./pages/VendorProductsPage";
export { default as VendorOrdersPage } from "./pages/VendorOrdersPage";
export { default as VendorCustomersPage } from "./pages/VendorCustomersPage";
export { default as VendorAIPage } from "./pages/VendorAIPage";
export { default as VendorFinancePage } from "./pages/VendorFinancePage";
export { default as VendorShippingPage } from "./pages/VendorShippingPage";
export { default as VendorMarketingPage } from "./pages/VendorMarketingPage";
export { default as VendorAffiliatePage } from "./pages/VendorAffiliatePage";
export { default as VendorSettingsPage } from "./pages/VendorSettingsPage";

/* Routes */
export { VendorUIRoutes } from "./routes/VendorUIRoutes";

/* Shell */
export { VendorPageShell } from "./components/VendorPageShell";

/* Dashboard & Health */
export { VendorDashboard } from "./components/dashboard/VendorDashboard";
export { StoreHealthPanel } from "./components/health/StoreHealthPanel";
export { AIReadinessPanel } from "./components/health/AIReadinessPanel";

/* Workspace modules */
export { ProductManagement } from "./components/products/ProductManagement";
export { OrderManagement } from "./components/orders/OrderManagement";
export { CustomerManagement } from "./components/customers/CustomerManagement";
export { AIWorkspace } from "./components/ai/AIWorkspace";
export { FinanceView } from "./components/finance/FinanceView";
export { ShippingView } from "./components/shipping/ShippingView";
export { MarketingView } from "./components/marketing/MarketingView";
export { AffiliateCenter } from "./components/affiliate/AffiliateCenter";
export { StoreSettings } from "./components/settings/StoreSettings";

/* Navigation & constants */
export { vendorWorkspaceNavItems, vendorQuickActions } from "./navigation/VendorNavigationConfig";
export { AI_PREVIEW_TYPE_OPTIONS, AI_PREVIEW_TYPE } from "./constants/aiPreviewTypes";

/* Hooks & data */
export { useVendorExperience } from "./hooks/useVendorExperience";
export * from "./data/mockVendorData";

/* Diagnostics */
export { logVendorUIDiagnostics } from "./diagnostics/VendorUIDiagnostics";
