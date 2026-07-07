/** YEBO Application Shell — Phase 8H.1 */

/* Root shell */
export { ApplicationShell } from "./shell/ApplicationShell";
export { initializeApplicationShell, useApplicationBootstrap } from "./shell/ApplicationBootstrap";

/* Routing */
export { RoutingShell, RouteOutlet, LazyRouteFallback } from "./routing/RoutingShell";
export { routeConfig, ROUTE_SCOPE, getRoutesByScope } from "./routing/routeConfig";
export {
  RouteGuard,
  PublicRouteShell,
  AuthenticatedRouteShell,
  CustomerRouteShell,
  VendorRouteShell,
  AdminRouteShell,
  ErrorRouteShell,
} from "./routing/RouteGuard";

/* Layouts */
export {
  AuthLayoutShell,
  LoginLayoutShell,
  RegisterLayoutShell,
  ForgotPasswordLayoutShell,
  ResetPasswordLayoutShell,
  EmailVerificationLayoutShell,
  MultiStepAuthLayoutShell,
} from "./layouts/AuthLayoutShell";
export { CustomerLayoutShell } from "./layouts/CustomerLayoutShell";
export { VendorLayoutShell } from "./layouts/VendorLayoutShell";
export { AdminLayoutShell } from "./layouts/AdminLayoutShell";

/* Navigation */
export { GlobalNavigation } from "./navigation/GlobalNavigation";
export {
  customerNavItems,
  customerBottomNav,
  vendorNavItems,
  vendorQuickActions,
  adminNavItems,
  adminDiagnosticsShortcuts,
} from "./navigation/NavigationConfig";

/* State hosts */
export { StateHostProvider, useStateHosts } from "./hosts/StateHostProvider";
export {
  ModalHost,
  DrawerHost,
  SheetHost,
  ToastHost,
  NotificationHost,
  CommandPaletteHost,
  LoadingHost,
  ProgressOverlayHost,
  GlobalHosts,
} from "./hosts/GlobalHosts";

/* Responsive & accessibility */
export { ResponsiveShell } from "./responsive/ResponsiveShell";
export { SkipLink } from "./accessibility/SkipLink";

/* Diagnostics */
export { logShellDiagnostics } from "./diagnostics/ShellDiagnostics";
