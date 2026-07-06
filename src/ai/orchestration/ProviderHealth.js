import { PROVIDER_STATUS } from "./ProviderTypes";
import { isProviderUsable, normalizeHealth } from "./ProviderHelpers";
import { providerEvents, PROVIDER_EVENT } from "./ProviderEvents";

/** Mock health monitor — tracks provider availability */
export class ProviderHealth {
  constructor() {
    this.statuses = new Map();
  }

  register(providerId, status) {
    const normalized = normalizeHealth(status);
    this.statuses.set(providerId, normalized);
    providerEvents.emit(PROVIDER_EVENT.HEALTH_CHANGE, { providerId, status: normalized });
    return normalized;
  }

  get(providerId) {
    return this.statuses.get(providerId) ?? PROVIDER_STATUS.OFFLINE;
  }

  getAll() {
    return Object.fromEntries(this.statuses.entries());
  }

  isUsable(providerId) {
    return isProviderUsable(this.get(providerId));
  }

  snapshot() {
    return {
      providers: this.getAll(),
      healthyCount: [...this.statuses.values()].filter((s) => s === PROVIDER_STATUS.HEALTHY).length,
      mock: true,
    };
  }
}

export const createProviderHealth = () => new ProviderHealth();

export default ProviderHealth;
