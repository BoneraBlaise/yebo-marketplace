import { ACCESS_ROLE } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** AI Asset Access Control — Phase 8E */
export class AssetAccessControl {
  constructor() {
    this.policies = new Map();
  }

  setPolicy(assetId, policy = {}) {
    this.policies.set(assetId, {
      owner: policy.owner || null,
      vendor: policy.vendor || null,
      organization: policy.organization || null,
      roles: policy.roles || [],
      customers: policy.customers || [],
    });
    return this.policies.get(assetId);
  }

  getPolicy(assetId) {
    return this.policies.get(assetId) || null;
  }

  canAccess({ assetId, userId, role = null, organizationId = null } = {}) {
    const policy = this.getPolicy(assetId);
    if (!policy) {
      logInfrastructureDiagnostics("access", { assetId, allowed: false, reason: "no_policy" });
      return { allowed: false, reason: "no_policy" };
    }

    if (policy.owner && policy.owner === userId) {
      return { allowed: true, reason: ACCESS_ROLE.OWNER };
    }

    if (role === ACCESS_ROLE.VENDOR && policy.vendor === userId) {
      return { allowed: true, reason: ACCESS_ROLE.VENDOR };
    }

    if (role === ACCESS_ROLE.ORG_ADMIN && policy.organization === organizationId) {
      return { allowed: true, reason: ACCESS_ROLE.ORG_ADMIN };
    }

    if (role === ACCESS_ROLE.CUSTOMER && policy.customers?.includes(userId)) {
      return { allowed: true, reason: ACCESS_ROLE.CUSTOMER };
    }

    if (role === ACCESS_ROLE.ADMIN || policy.roles?.includes(role)) {
      return { allowed: true, reason: ACCESS_ROLE.ADMIN };
    }

    logInfrastructureDiagnostics("access", { assetId, allowed: false, userId, role });
    return { allowed: false, reason: "forbidden" };
  }
}

export const createAssetAccessControl = () => new AssetAccessControl();

export default AssetAccessControl;
