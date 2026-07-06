/** Intelligence context — binds memory + decision read-only */
export class IntelligenceContext {
  constructor({ memoryEngine, decisionEngine } = {}) {
    this.memoryEngine = memoryEngine;
    this.decisionEngine = decisionEngine;
    this.scope = "homepage";
  }

  getMemory() {
    return this.memoryEngine?.getSnapshot?.() || {};
  }

  getDecisions(scope) {
    return this.decisionEngine?.getRecommendations?.(scope) || [];
  }

  setScope(scope) {
    this.scope = scope;
    return this;
  }

  getSnapshot() {
    return {
      scope: this.scope,
      memory: this.getMemory(),
      decisionSnapshot: this.decisionEngine?.getSnapshot?.() || null,
    };
  }
}

export const createIntelligenceContext = (deps) => new IntelligenceContext(deps);

export default IntelligenceContext;
