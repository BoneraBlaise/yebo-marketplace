/** Read-only bridge to Intelligence Layer */
export class AgentIntelligenceBridge {
  constructor(intelligenceEngine, scope = "homepage") {
    this.intelligenceEngine = intelligenceEngine;
    this.scope = scope;
  }

  getRanked(scope) {
    return this.intelligenceEngine?.getRankedRecommendations?.(scope || this.scope) || [];
  }

  getContext(scope) {
    return { intelligence: this.getRanked(scope), mock: true };
  }
}

export default AgentIntelligenceBridge;
