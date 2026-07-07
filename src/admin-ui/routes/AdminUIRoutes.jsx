import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import { LazyRouteFallback } from "../../application";

const AdminDashboardPage = lazy(() => import("../pages/AdminDashboardPage"));
const AdminUsersPage = lazy(() => import("../pages/AdminUsersPage"));
const AdminVendorsPage = lazy(() => import("../pages/AdminVendorsPage"));
const AdminAIPage = lazy(() => import("../pages/AdminAIPage"));
const AdminInfrastructurePage = lazy(() => import("../pages/AdminInfrastructurePage"));
const AdminCommercePage = lazy(() => import("../pages/AdminCommercePage"));
const AdminMonitoringPage = lazy(() => import("../pages/AdminMonitoringPage"));
const AdminFeaturesPage = lazy(() => import("../pages/AdminFeaturesPage"));
const AdminSecurityPage = lazy(() => import("../pages/AdminSecurityPage"));
const AdminAnnouncementsPage = lazy(() => import("../pages/AdminAnnouncementsPage"));
const AdminAnalyticsPage = lazy(() => import("../pages/AdminAnalyticsPage"));

/** Admin Control Center routes — opt-in, not wired to App.js — Phase 8H.4 */
export const AdminUIRoutes = () => (
  <Suspense fallback={<LazyRouteFallback />}>
    <Routes>
      <Route path="/admin-ui" element={<AdminDashboardPage />} />
      <Route path="/admin-ui/users" element={<AdminUsersPage />} />
      <Route path="/admin-ui/vendors" element={<AdminVendorsPage />} />
      <Route path="/admin-ui/ai" element={<AdminAIPage />} />
      <Route path="/admin-ui/infrastructure" element={<AdminInfrastructurePage />} />
      <Route path="/admin-ui/commerce" element={<AdminCommercePage />} />
      <Route path="/admin-ui/monitoring" element={<AdminMonitoringPage />} />
      <Route path="/admin-ui/features" element={<AdminFeaturesPage />} />
      <Route path="/admin-ui/security" element={<AdminSecurityPage />} />
      <Route path="/admin-ui/announcements" element={<AdminAnnouncementsPage />} />
      <Route path="/admin-ui/analytics" element={<AdminAnalyticsPage />} />
    </Routes>
  </Suspense>
);

export default AdminUIRoutes;
