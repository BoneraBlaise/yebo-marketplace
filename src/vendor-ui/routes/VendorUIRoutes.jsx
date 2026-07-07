import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyRouteFallback } from "../../application";

const VendorDashboardPage = lazy(() => import("../pages/VendorDashboardPage"));
const VendorProductsPage = lazy(() => import("../pages/VendorProductsPage"));
const VendorOrdersPage = lazy(() => import("../pages/VendorOrdersPage"));
const VendorCustomersPage = lazy(() => import("../pages/VendorCustomersPage"));
const VendorAIPage = lazy(() => import("../pages/VendorAIPage"));
const VendorFinancePage = lazy(() => import("../pages/VendorFinancePage"));
const VendorShippingPage = lazy(() => import("../pages/VendorShippingPage"));
const VendorMarketingPage = lazy(() => import("../pages/VendorMarketingPage"));
const VendorAffiliatePage = lazy(() => import("../pages/VendorAffiliatePage"));
const VendorSettingsPage = lazy(() => import("../pages/VendorSettingsPage"));

/** Vendor workspace routes — opt-in, not wired to App.js — Phase 8H.3 */
export const VendorUIRoutes = () => (
  <Suspense fallback={<LazyRouteFallback />}>
    <Routes>
      <Route path="/vendor-ui" element={<VendorDashboardPage />} />
      <Route path="/vendor-ui/products" element={<VendorProductsPage />} />
      <Route path="/vendor-ui/orders" element={<VendorOrdersPage />} />
      <Route path="/vendor-ui/customers" element={<VendorCustomersPage />} />
      <Route path="/vendor-ui/ai" element={<VendorAIPage />} />
      <Route path="/vendor-ui/finance" element={<VendorFinancePage />} />
      <Route path="/vendor-ui/shipping" element={<VendorShippingPage />} />
      <Route path="/vendor-ui/marketing" element={<VendorMarketingPage />} />
      <Route path="/vendor-ui/affiliate" element={<VendorAffiliatePage />} />
      <Route path="/vendor-ui/settings" element={<VendorSettingsPage />} />
    </Routes>
  </Suspense>
);

export default VendorUIRoutes;
