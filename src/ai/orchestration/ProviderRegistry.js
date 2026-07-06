import { getCapabilityProfile } from "./ProviderCapabilities";
import { MOCK_PROVIDER_ADAPTERS } from "./MockProviders";
import { getPriority } from "./ProviderPriority";
import { PROVIDER_STATUS } from "./ProviderTypes";

/** Registry of available AI providers — metadata only */
export class ProviderRegistry {
  constructor() {
    this.entries = new Map();
    this._seed();
  }

  _seed() {
    Object.values(MOCK_PROVIDER_ADAPTERS).forEach((adapter) => {
      const caps = getCapabilityProfile(adapter.id);
      this.register({
        id: adapter.id,
        name: adapter.name,
        version: adapter.version,
        status: adapter._health ?? PROVIDER_STATUS.HEALTHY,
        priority: getPriority(adapter.id),
        capabilities: caps.label,
        supportsVision: caps.supportsVision,
        supportsStreaming: caps.supportsStreaming,
        supportsEmbeddings: caps.supportsEmbeddings,
        supportsFunctionCalling: caps.supportsFunctionCalling,
        supportsReasoning: caps.supportsReasoning,
        supportsImages: caps.supportsImages,
        supportsFiles: caps.supportsFiles,
      });
    });
  }

  register(entry) {
    this.entries.set(entry.id, { ...entry });
    return entry;
  }

  get(id) {
    return this.entries.get(id) || null;
  }

  list() {
    return [...this.entries.values()].sort((a, b) => b.priority - a.priority);
  }

  updateStatus(id, status) {
    const entry = this.entries.get(id);
    if (!entry) return null;
    entry.status = status;
    this.entries.set(id, entry);
    return entry;
  }
}

export const createProviderRegistry = () => new ProviderRegistry();

export default ProviderRegistry;
