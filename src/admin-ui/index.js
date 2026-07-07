/** YEBO Control Center (Admin Console) — Phase 8H.4 */

/* Pages */
export { default as AdminDashboardPage } from "./pages/AdminDashboardPage";
export { default as AdminUsersPage } from "./pages/AdminUsersPage";
export { default as AdminVendorsPage } from "./pages/AdminVendorsPage";
export { default as AdminAIPage } from "./pages/AdminAIPage";
export { default as AdminInfrastructurePage } from "./pages/AdminInfrastructurePage";
export { default as AdminCommercePage } from "./pages/AdminCommercePage";
export { default as AdminMonitoringPage } from "./pages/AdminMonitoringPage";
export { default as AdminFeaturesPage } from "./pages/AdminFeaturesPage";
export { default as AdminSecurityPage } from "./pages/AdminSecurityPage";
export { default as AdminAnnouncementsPage } from "./pages/AdminAnnouncementsPage";
export { default as AdminAnalyticsPage } from "./pages/AdminAnalyticsPage";

/* Routes */
export { AdminUIRoutes } from "./routes/AdminUIRoutes";

/* Shell */
export { AdminPageShell } from "./components/AdminPageShell";

/* Centers */
export { ExecutiveDashboard } from "./components/dashboard/ExecutiveDashboard";
export { UserManagement } from "./components/users/UserManagement";
export { VendorManagement } from "./components/vendors/VendorManagement";
export { AIControlCenter } from "./components/ai/AIControlCenter";
export { InfrastructureCenter } from "./components/infrastructure/InfrastructureCenter";
export { CommerceCenter } from "./components/commerce/CommerceCenter";
export { MonitoringCenter } from "./components/monitoring/MonitoringCenter";
export { FeatureFlagCenter } from "./components/features/FeatureFlagCenter";
export { SecurityCenter } from "./components/security/SecurityCenter";
export { AnnouncementCenter } from "./components/announcements/AnnouncementCenter";
export { AnalyticsCenter } from "./components/analytics/AnalyticsCenter";

/* Navigation & hooks */
export { adminControlNavItems } from "./navigation/AdminNavigationConfig";
export { useAdminExperience } from "./hooks/useAdminExperience";
export * from "./data/mockAdminData";
export { logAdminUIDiagnostics } from "./diagnostics/AdminUIDiagnostics";
