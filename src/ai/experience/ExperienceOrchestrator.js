import { createPermissionGateway } from "./PermissionGateway";
import { createCustomerExperienceService } from "./CustomerExperienceService";
import { createVendorExperienceService } from "./VendorExperienceService";
import { createAdminExperienceService } from "./AdminExperienceService";
import { ALL_EXPERIENCE_CONTRACTS } from "./ExperienceContracts";
import { logExperienceDiagnostics } from "./ExperienceDiagnostics";

/**
 * Experience Orchestrator — coordinates Conversation, Commerce, Infrastructure, Provider SDK.
 * Does not modify underlying layers — Phase 8F
 */
export class ExperienceOrchestrator {
  constructor({
    commerceEngine = null,
    infrastructureEngine = null,
    conversationPipeline = null,
    providerFactory = null,
  } = {}) {
    this.commerce = commerceEngine;
    this.infrastructure = infrastructureEngine;
    this.conversation = conversationPipeline;
    this.providerFactory = providerFactory;

    this.permissions = createPermissionGateway();
    this.customer = createCustomerExperienceService({
      infrastructure: infrastructureEngine,
      commerce: commerceEngine,
      permissions: this.permissions,
    });
    this.vendor = createVendorExperienceService({
      commerce: commerceEngine,
      permissions: this.permissions,
    });
    this.admin = createAdminExperienceService({
      commerce: commerceEngine,
      infrastructure: infrastructureEngine,
      providerFactory,
      permissions: this.permissions,
    });

    this.contracts = ALL_EXPERIENCE_CONTRACTS;
    this._initialized = false;
  }

  initialize({ vendorId = "default", planId = null } = {}) {
    if (this.commerce?.initialize) {
      this.commerce.initialize(vendorId, planId);
    }
    if (this.infrastructure?.initialize) {
      this.infrastructure.initialize();
    }
    this._initialized = true;
    logExperienceDiagnostics("orchestrator", { action: "initialized", vendorId });
    return this.getSnapshot();
  }

  getContracts(role = null) {
    return role ? this.contracts[role] || {} : this.contracts;
  }

  handleRequest({ role, method, params = {} } = {}) {
    logExperienceDiagnostics("request", { role, method });

    const serviceMap = {
      customer: this.customer,
      vendor: this.vendor,
      admin: this.admin,
    };

    const service = serviceMap[role];
    if (!service || typeof service[method] !== "function") {
      return { ok: false, error: "unknown_method", role, method };
    }

    const startedAt = Date.now();
    try {
      const result = service[method](...(Array.isArray(params) ? params : [params]));
      logExperienceDiagnostics("service", {
        role,
        method,
        elapsedMs: Date.now() - startedAt,
      });
      return { ok: true, result };
    } catch (err) {
      return { ok: false, error: err.message, role, method };
    }
  }

  getSnapshot() {
    return {
      initialized: this._initialized,
      layers: {
        conversation: Boolean(this.conversation),
        commerce: Boolean(this.commerce),
        infrastructure: Boolean(this.infrastructure),
        providerFactory: Boolean(this.providerFactory),
      },
      contracts: {
        customer: Object.keys(this.contracts.customer || {}).length,
        vendor: Object.keys(this.contracts.vendor || {}).length,
        admin: Object.keys(this.contracts.admin || {}).length,
      },
    };
  }
}

export const createExperienceOrchestrator = (options) => new ExperienceOrchestrator(options);

export default ExperienceOrchestrator;
