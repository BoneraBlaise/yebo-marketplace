import { EXPERIENCE_ROLE } from "./ExperienceTypes";
import { logExperienceDiagnostics } from "./ExperienceDiagnostics";

const ROLE_PERMISSIONS = {
  [EXPERIENCE_ROLE.CUSTOMER]: [
    "preview:read",
    "preview:history",
    "asset:read",
    "asset:download",
    "job:read",
  ],
  [EXPERIENCE_ROLE.VENDOR]: [
    "dashboard:read",
    "credits:read",
    "subscription:read",
    "billing:read",
    "roi:read",
    "analytics:read",
    "recommendations:read",
    "usage:read",
  ],
  [EXPERIENCE_ROLE.ORG_ADMIN]: [
    "dashboard:read",
    "credits:read",
    "subscription:read",
    "billing:read",
    "analytics:read",
    "usage:read",
    "org:manage",
  ],
  [EXPERIENCE_ROLE.PLATFORM_ADMIN]: [
    "admin:providers",
    "admin:jobs",
    "admin:infrastructure",
    "admin:costs",
    "admin:usage",
    "admin:diagnostics",
  ],
};

/** Permission Gateway — Phase 8F */
export class PermissionGateway {
  constructor() {
    this.customRoles = new Map();
  }

  registerRole(roleId, permissions = []) {
    this.customRoles.set(roleId, permissions);
    return permissions;
  }

  getPermissions(role) {
    return this.customRoles.get(role) || ROLE_PERMISSIONS[role] || [];
  }

  check({ role, permission, userId = null, resourceOwnerId = null } = {}) {
    const permissions = this.getPermissions(role);
    const allowed = permissions.includes(permission);

    if (allowed && resourceOwnerId && userId && resourceOwnerId !== userId) {
      const ownerOverride = role === EXPERIENCE_ROLE.PLATFORM_ADMIN || role === EXPERIENCE_ROLE.ORG_ADMIN;
      if (!ownerOverride && !permissions.includes("resource:override")) {
        logExperienceDiagnostics("permission", { role, permission, allowed: false, reason: "not_owner" });
        return { allowed: false, reason: "not_owner" };
      }
    }

    logExperienceDiagnostics("permission", { role, permission, allowed });
    return { allowed, reason: allowed ? "granted" : "denied" };
  }

  require(context) {
    const result = this.check(context);
    if (!result.allowed) {
      throw new Error(`PermissionGateway: denied — ${context.permission}`);
    }
    return result;
  }
}

export const createPermissionGateway = () => new PermissionGateway();

export default PermissionGateway;
