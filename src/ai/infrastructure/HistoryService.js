import { HISTORY_SCOPE } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

/** AI History Service — Phase 8E */
export class HistoryService {
  constructor({ pageSize = 20 } = {}) {
    this.entries = [];
    this.pageSize = pageSize;
  }

  record({
    scope,
    actorId = null,
    organizationId = null,
    feature = null,
    action = null,
    metadata = {},
  } = {}) {
    const entry = {
      id: `hist-${Date.now()}-${this.entries.length}`,
      scope,
      actorId,
      organizationId,
      feature,
      action,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.entries.push(entry);
    logInfrastructureDiagnostics("history", { scope, action, feature });
    return entry;
  }

  query({
    scope = null,
    actorId = null,
    organizationId = null,
    feature = null,
    since = null,
    page = 1,
    pageSize = this.pageSize,
  } = {}) {
    let filtered = [...this.entries];

    if (scope) filtered = filtered.filter((e) => e.scope === scope);
    if (actorId) filtered = filtered.filter((e) => e.actorId === actorId);
    if (organizationId) filtered = filtered.filter((e) => e.organizationId === organizationId);
    if (feature) filtered = filtered.filter((e) => e.feature === feature);
    if (since) {
      const ts = new Date(since).getTime();
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() >= ts);
    }

    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const items = filtered.slice(start, start + pageSize);

    return {
      items,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize) || 1,
        hasMore: start + pageSize < total,
      },
    };
  }

  getCustomerHistory(actorId, options = {}) {
    return this.query({ ...options, scope: HISTORY_SCOPE.CUSTOMER, actorId });
  }

  getVendorHistory(actorId, options = {}) {
    return this.query({ ...options, scope: HISTORY_SCOPE.VENDOR, actorId });
  }

  getOrganizationHistory(organizationId, options = {}) {
    return this.query({ ...options, scope: HISTORY_SCOPE.ORGANIZATION, organizationId });
  }

  getPreviewHistory(options = {}) {
    return this.query({ ...options, scope: HISTORY_SCOPE.PREVIEW, feature: "preview" });
  }

  getGenerationHistory(options = {}) {
    return this.query({ ...options, scope: HISTORY_SCOPE.GENERATION });
  }
}

export const createHistoryService = (options) => new HistoryService(options);

export default HistoryService;
