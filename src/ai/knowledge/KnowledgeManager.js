import { createKnowledgeRegistry } from "./KnowledgeRegistry";
import { createKnowledgeIndex } from "./KnowledgeIndex";
import { createKnowledgeCache } from "./KnowledgeCache";
import { createKnowledgeSearch } from "./KnowledgeSearch";
import { createKnowledgePipeline } from "./KnowledgePipeline";
import { createKnowledgeRouter } from "./KnowledgeRouter";
import { mergeKnowledgeConfig } from "./KnowledgeConfig";

/** Manages knowledge platform lifecycle */
export class KnowledgeManager {
  constructor(config = {}) {
    this.config = mergeKnowledgeConfig(config);
    this.registry = createKnowledgeRegistry();
    this.index = createKnowledgeIndex(this.registry);
    this.cache = createKnowledgeCache(this.config);
    this.search = createKnowledgeSearch({
      registry: this.registry,
      cache: this.cache,
      config: this.config,
    });
    this.pipeline = createKnowledgePipeline({
      registry: this.registry,
      search: this.search,
      index: this.index,
      config: this.config,
    });
    this.router = createKnowledgeRouter({
      pipeline: this.pipeline,
      search: this.search,
    });
  }

  getKnowledge(id) {
    return this.registry.getDocument(id);
  }

  getDomains() {
    return this.registry.listDomains();
  }

  searchKnowledge(query, options) {
    return this.router.route(query, options);
  }
}

export const createKnowledgeManager = (config) => new KnowledgeManager(config);

export default KnowledgeManager;
