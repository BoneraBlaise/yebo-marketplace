/** Read-only bridge to Decision Engine */
export class AgentDecisionBridge {
  constructor(decisionEngine, scope = "homepage") {
    this.decisionEngine = decisionEngine;
    this.scope = scope;
  }

  getRecommendations(scope) {
    return this.decisionEngine?.getRecommendations?.(scope || this.scope) || [];
  }

  getContext(scope) {
    return { decisions: this.getRecommendations(scope), mock: true };
  }
}

export default AgentDecisionBridge;
