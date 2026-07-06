import { PROVIDER_STATUS } from "./ProviderTypes";

/** Mock usage tracker per provider */
export class ProviderUsageTracker {
  constructor() {
    this.metrics = new Map();
  }

  _ensure(providerId) {
    if (!this.metrics.has(providerId)) {
      this.metrics.set(providerId, {
        provider: providerId,
        estimatedTokens: 0,
        estimatedCost: 0,
        latencyMs: [],
        durationMs: [],
        requestCount: 0,
        streamingActive: false,
        lastUpdated: null,
      });
    }
    return this.metrics.get(providerId);
  }

  recordRequest(providerId, { tokens = 0, latencyMs = 0, durationMs = 0, streaming = false } = {}) {
    const m = this._ensure(providerId);
    m.estimatedTokens += tokens;
    m.estimatedCost += tokens * 0.000002;
    m.latencyMs.push(latencyMs);
    m.durationMs.push(durationMs);
    m.requestCount += 1;
    m.streamingActive = streaming;
    m.lastUpdated = new Date().toISOString();
    return { ...m };
  }

  setStreaming(providerId, active) {
    const m = this._ensure(providerId);
    m.streamingActive = active;
    return { ...m };
  }

  getUsage(providerId) {
    const m = this._ensure(providerId);
    const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
    return {
      ...m,
      avgLatencyMs: Math.round(avg(m.latencyMs)),
      avgDurationMs: Math.round(avg(m.durationMs)),
    };
  }

  getAllUsage() {
    return Array.from(this.metrics.keys()).map((id) => this.getUsage(id));
  }

  reset(providerId) {
    if (providerId) this.metrics.delete(providerId);
    else this.metrics.clear();
  }
}

export const createUsageTracker = () => new ProviderUsageTracker();

export default ProviderUsageTracker;
