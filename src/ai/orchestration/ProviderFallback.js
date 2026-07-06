import { FALLBACK_CHAIN } from "./ProviderPriority";
import { isProviderUsable } from "./ProviderHelpers";
import { providerEvents, PROVIDER_EVENT } from "./ProviderEvents";

/** Automatic provider fallback chain — architecture only */
export class ProviderFallback {
  constructor({ health, chain = FALLBACK_CHAIN } = {}) {
    this.health = health;
    this.chain = chain;
  }

  resolve(preferredId, fallbackEnabled = true) {
    const candidates = fallbackEnabled
      ? [preferredId, ...this.chain.filter((id) => id !== preferredId)]
      : [preferredId];

    for (const id of candidates) {
      if (this.health.isUsable(id)) {
        if (id !== preferredId) {
          providerEvents.emit(PROVIDER_EVENT.FALLBACK, { from: preferredId, to: id });
        }
        return id;
      }
    }

    providerEvents.emit(PROVIDER_EVENT.FALLBACK, { from: preferredId, to: "mock" });
    return "mock";
  }
}

export const createProviderFallback = (deps) => new ProviderFallback(deps);

export default ProviderFallback;
