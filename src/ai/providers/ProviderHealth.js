import { PROVIDER_STATUS } from "./ProviderTypes";

/** SDK health monitor — mock only */
export class ProviderHealthMonitor {
  constructor() {
    this.status = new Map();
  }

  setStatus(providerId, status, meta = {}) {
    const entry = {
      providerId,
      status: status || PROVIDER_STATUS.HEALTHY,
      checkedAt: new Date().toISOString(),
      ...meta,
    };
    this.status.set(providerId, entry);
    return entry;
  }

  getStatus(providerId) {
    return (
      this.status.get(providerId) || {
        providerId,
        status: PROVIDER_STATUS.OFFLINE,
        checkedAt: null,
      }
    );
  }

  getAll() {
    return Array.from(this.status.values());
  }

  markHealthy(providerId) {
    return this.setStatus(providerId, PROVIDER_STATUS.HEALTHY);
  }

  markDegraded(providerId, reason) {
    return this.setStatus(providerId, PROVIDER_STATUS.DEGRADED, { reason });
  }

  markUnavailable(providerId, reason) {
    return this.setStatus(providerId, PROVIDER_STATUS.UNAVAILABLE, { reason });
  }

  markOffline(providerId) {
    return this.setStatus(providerId, PROVIDER_STATUS.OFFLINE);
  }
}

export const createHealthMonitor = () => new ProviderHealthMonitor();

export default ProviderHealthMonitor;
