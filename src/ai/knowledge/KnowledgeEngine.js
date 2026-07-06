import { createKnowledgeManager } from "./KnowledgeManager";
import { mergeKnowledgeConfig } from "./KnowledgeConfig";
import { knowledgeEvents, KNOWLEDGE_EVENT } from "./KnowledgeEvents";

/** Read-only bind to upstream YIP layers */
export class KnowledgeContext {
  constructor({ memoryEngine, decisionEngine, intelligenceEngine, orchestrator, config } = {}) {
    this.memoryEngine = memoryEngine;
    this.decisionEngine = decisionEngine;
    this.intelligenceEngine = intelligenceEngine;
    this.orchestrator = orchestrator;
    this.config = mergeKnowledgeConfig(config);
    this.scope = "homepage";
  }

  setScope(scope) {
    this.scope = scope;
    return this;
  }

  buildUpstreamContext() {
    return {
      scope: this.scope,
      memory: this.memoryEngine?.getSnapshot?.() || {},
      decisions: this.decisionEngine?.getRecommendations?.(this.scope) || [],
      intelligence: this.intelligenceEngine?.getRankedRecommendations?.(this.scope) || [],
      orchestration: this.orchestrator?.getSnapshot?.() || null,
      mock: true,
    };
  }
}

/** Main knowledge engine — single source for all future AI providers */
export class KnowledgeEngine {
  constructor(deps = {}) {
    this.context = new KnowledgeContext(deps);
    this.manager = createKnowledgeManager(deps.config);
    this.registry = this.manager.registry;
    this.index = this.manager.index;
    this.search = this.manager.search;
    this.router = this.manager.router;
    this.pipeline = this.manager.pipeline;
    this.cache = this.manager.cache;
  }

  searchKnowledge(query, options = {}) {
    const upstream = this.context.buildUpstreamContext();
    const result = this.manager.searchKnowledge(query, options);
    return {
      ...(Array.isArray(result) ? { results: result, count: result.length } : result),
      upstream,
      mock: true,
    };
  }

  getKnowledge(id) {
    return this.manager.getKnowledge(id);
  }

  getKnowledgeDomains() {
    return this.manager.getDomains();
  }

  getSnapshot() {
    const snapshot = {
      index: this.index.snapshot(),
      cache: this.cache.snapshot(),
      domains: this.getKnowledgeDomains(),
      upstream: this.context.buildUpstreamContext(),
      mock: true,
    };
    knowledgeEvents.emit(KNOWLEDGE_EVENT.SNAPSHOT, snapshot);
    return snapshot;
  }
}

export const createKnowledgeEngine = (deps) => new KnowledgeEngine(deps);

export default KnowledgeEngine;
