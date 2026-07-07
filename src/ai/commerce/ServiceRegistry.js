import { AI_SERVICE } from "./CommerceTypes";

/** AI Service Registry — Phase 8D */
export class ServiceRegistry {
  constructor() {
    this.services = new Map();
    this._registerDefaults();
  }

  _registerDefaults() {
    const defaults = [
      { id: AI_SERVICE.PREVIEW, label: "AI Preview", category: "visual" },
      { id: AI_SERVICE.DESCRIPTION, label: "Product Description", category: "content" },
      { id: AI_SERVICE.TRANSLATION, label: "Translation", category: "content" },
      { id: AI_SERVICE.BACKGROUND_REMOVAL, label: "Background Removal", category: "visual" },
      { id: AI_SERVICE.PRODUCT_VIDEO, label: "Product Video", category: "visual" },
      { id: AI_SERVICE.SEARCH, label: "AI Search", category: "discovery" },
      { id: AI_SERVICE.CUSTOMER_SUPPORT, label: "Customer Support", category: "support" },
      { id: AI_SERVICE.RECOMMENDATIONS, label: "Recommendations", category: "intelligence" },
      { id: AI_SERVICE.ANALYTICS, label: "Analytics", category: "intelligence" },
    ];
    defaults.forEach((s) => this.register(s));
  }

  register(service) {
    if (!service?.id) throw new Error("ServiceRegistry: service requires id");
    this.services.set(service.id, { ...service, registeredAt: new Date().toISOString() });
    return service;
  }

  unregister(id) {
    return this.services.delete(id);
  }

  get(id) {
    return this.services.get(id) || null;
  }

  list() {
    return [...this.services.values()];
  }

  listByCategory(category) {
    return this.list().filter((s) => s.category === category);
  }
}

export const createServiceRegistry = () => new ServiceRegistry();

export default ServiceRegistry;
