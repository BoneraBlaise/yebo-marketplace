import { createAdminDTO } from "./ExperienceDTOs";
import { logExperienceDiagnostics } from "./ExperienceDiagnostics";

/** Admin Experience Service — Phase 8F */
export class AdminExperienceService {
  constructor({
    commerce = null,
    infrastructure = null,
    providerFactory = null,
    permissions = null,
  } = {}) {
    this.commerce = commerce;
    this.infrastructure = infrastructure;
    this.providerFactory = providerFactory;
    this.permissions = permissions;
  }

  _check(permission) {
    return this.permissions?.check({
      role: "platform_admin",
      permission,
    }) || { allowed: true };
  }

  getProviderMonitoring() {
    this._check("admin:providers");
    const providers = [];

    if (this.providerFactory?.getSnapshot) {
      const snap = this.providerFactory.getSnapshot();
      providers.push(...(snap.providers || []).map((p) => ({ ...p, source: "ProviderFactory" })));
    } else if (this.providerFactory?.registry) {
      providers.push({
        activeId: this.providerFactory.registry.activeId,
        source: "ProviderFactory",
      });
    }

    const lastSelection = this.commerce?.providerSelection?.getLastSelection?.();
    if (lastSelection) providers.push({ lastSelection });

    logExperienceDiagnostics("service", { service: "admin", action: "getProviderMonitoring" });
    return providers;
  }

  getJobMonitoring() {
    this._check("admin:jobs");
    return this.infrastructure?.jobs?.snapshot() || { total: 0 };
  }

  getInfrastructureHealth() {
    this._check("admin:infrastructure");
    return this.infrastructure?.getSnapshot() || { initialized: false };
  }

  getCostMonitoring() {
    this._check("admin:costs");
    const wallet = this.commerce?.wallet?.getSnapshot() || {};
    const usage = this.commerce?.usage?.getUsageByService() || {};
    return {
      creditsConsumed: wallet.consumedCredits || 0,
      creditsRemaining: wallet.remainingCredits || 0,
      usageByService: usage,
      creditPolicy: this.commerce?.creditPolicy?.getAllPolicies() || {},
    };
  }

  getUsageMonitoring() {
    this._check("admin:usage");
    return {
      commerce: this.commerce?.analytics?.getAnalytics() || {},
      infrastructure: {
        historyEntries: this.infrastructure?.history?.entries?.length || 0,
        assetCount: this.infrastructure?.assets?.snapshot()?.count || 0,
      },
    };
  }

  getDiagnostics() {
    this._check("admin:diagnostics");
    return createAdminDTO({
      providers: this.getProviderMonitoring(),
      jobs: this.getJobMonitoring(),
      infrastructure: this.getInfrastructureHealth(),
      costs: this.getCostMonitoring(),
      usage: this.getUsageMonitoring(),
      diagnostics: {
        commerceInitialized: this.commerce?._initialized || false,
        infrastructureInitialized: this.infrastructure?._initialized || false,
      },
    });
  }
}

export const createAdminExperienceService = (options) => new AdminExperienceService(options);

export default AdminExperienceService;
