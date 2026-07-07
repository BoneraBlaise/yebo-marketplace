/** Placeholder admin UI data — no business logic — Phase 8H.4 */

export const mockPlatformStats = {
  revenue: 284500,
  orders: 12450,
  customers: 8920,
  vendors: 342,
  organizations: 128,
  aiUsage: 45600,
};

export const mockUsers = [
  { id: "u-1", name: "Jane Customer", email: "jane@example.com", role: "customer", status: "active", verified: true },
  { id: "u-2", name: "TechHub Store", email: "vendor@techhub.com", role: "vendor", status: "active", verified: true },
  { id: "u-3", name: "Platform Admin", email: "admin@yebo.com", role: "platform_admin", status: "active", verified: true },
  { id: "u-4", name: "Acme Org", email: "org@acme.com", role: "organization", status: "pending", verified: false },
];

export const mockVendors = [
  { id: "v-1", name: "TechHub", health: 92, aiReadiness: 85, subscription: "business", credits: 450, revenue: 12450, status: "active" },
  { id: "v-2", name: "StyleCo", health: 78, aiReadiness: 62, subscription: "starter", credits: 120, revenue: 8900, status: "active" },
  { id: "v-3", name: "GreenLiving", health: 65, aiReadiness: 45, subscription: "starter", credits: 0, status: "suspended" },
];

export const mockFeatureFlags = [
  { id: "ai_preview", label: "AI Preview", enabled: true },
  { id: "room_preview", label: "Room Preview", enabled: true },
  { id: "virtual_tryon", label: "Virtual Try-On", enabled: true },
  { id: "providers", label: "Providers", enabled: true },
  { id: "models", label: "Models", enabled: true },
  { id: "experimental", label: "Experimental Features", enabled: false },
  { id: "maintenance", label: "Maintenance Mode", enabled: false },
];

export const mockAnnouncements = [
  { id: "a-1", audience: "customer", title: "Summer Sale Live", status: "published" },
  { id: "a-2", audience: "vendor", title: "New AI Preview Types", status: "published" },
  { id: "a-3", audience: "platform", title: "Scheduled Maintenance", status: "draft" },
];

export const mockSecurityAlerts = [
  { id: "s-1", type: "login_attempt", message: "Multiple failed login attempts", severity: "warning" },
  { id: "s-2", type: "api_key", message: "API key rotation due", severity: "info" },
];

export default {
  mockPlatformStats, mockUsers, mockVendors, mockFeatureFlags, mockAnnouncements, mockSecurityAlerts,
};
