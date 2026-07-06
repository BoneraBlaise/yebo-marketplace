import { SELECTION_STRATEGY } from "./ProviderTypes";
import { sortProvidersByPriority } from "./ProviderPriority";

/** Mock provider selection strategies */
export class ProviderSelector {
  constructor({ registry, health, config }) {
    this.registry = registry;
    this.health = health;
    this.config = config;
  }

  select(strategy = this.config.selectionStrategy) {
    const providers = this.registry.list();

    switch (strategy) {
      case SELECTION_STRATEGY.MANUAL:
      case SELECTION_STRATEGY.PREFERRED:
        return this.config.preferredProvider;

      case SELECTION_STRATEGY.LOCAL_ONLY:
        return this.health.isUsable("local") ? "local" : "mock";

      case SELECTION_STRATEGY.FASTEST: {
        const usable = providers.filter((p) => this.health.isUsable(p.id));
        return usable.find((p) => p.id === "local")?.id || usable[0]?.id || "mock";
      }

      case SELECTION_STRATEGY.CHEAPEST:
        return this.health.isUsable("local") ? "local" : "mock";

      case SELECTION_STRATEGY.HIGHEST_QUALITY: {
        const ranked = sortProvidersByPriority(providers.filter((p) => this.health.isUsable(p.id)));
        return ranked[0]?.id || "mock";
      }

      case SELECTION_STRATEGY.AUTO:
      default:
        return this.config.preferredProvider;
    }
  }
}

export const createProviderSelector = (deps) => new ProviderSelector(deps);

export default ProviderSelector;
