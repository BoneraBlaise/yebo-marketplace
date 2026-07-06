import { mergeOrchestrationConfig } from "./ProviderConfig";

/** Binds orchestration context — read-only upstream engines */
export class ProviderContext {
  constructor({ memoryEngine, decisionEngine, intelligenceEngine, config } = {}) {
    this.memoryEngine = memoryEngine;
    this.decisionEngine = decisionEngine;
    this.intelligenceEngine = intelligenceEngine;
    this.config = mergeOrchestrationConfig(config);
    this.scope = "homepage";
  }

  getMemorySnapshot() {
    return this.memoryEngine?.getSnapshot?.() || {};
  }

  getDecisionSnapshot(scope) {
    return this.decisionEngine?.getRecommendations?.(scope || this.scope) || [];
  }

  getIntelligenceSnapshot(scope) {
    return this.intelligenceEngine?.getRankedRecommendations?.(scope || this.scope) || [];
  }

  setScope(scope) {
    this.scope = scope;
    return this;
  }

  buildPipelineContext() {
    return {
      scope: this.scope,
      memory: this.getMemorySnapshot(),
      decisions: this.getDecisionSnapshot(),
      intelligence: this.getIntelligenceSnapshot(),
      mock: true,
    };
  }
}

export default ProviderContext;
