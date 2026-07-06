import { mergeAgentConfig } from "./AgentConfig";
import AgentMemoryBridge from "./AgentMemoryBridge";
import AgentDecisionBridge from "./AgentDecisionBridge";
import AgentIntelligenceBridge from "./AgentIntelligenceBridge";
import AgentKnowledgeBridge from "./AgentKnowledgeBridge";

/** Agent execution context — bridges to upstream layers (read-only) */
export class AgentContext {
  constructor(deps = {}) {
    this.config = mergeAgentConfig(deps.config);
    this.scope = deps.scope || this.config.defaultScope;
    this.memoryBridge = new AgentMemoryBridge(deps.memoryEngine);
    this.decisionBridge = new AgentDecisionBridge(deps.decisionEngine, this.scope);
    this.intelligenceBridge = new AgentIntelligenceBridge(deps.intelligenceEngine, this.scope);
    this.knowledgeBridge = new AgentKnowledgeBridge(deps.knowledgeEngine);
    this.orchestrator = deps.orchestrator;
  }

  setScope(scope) {
    this.scope = scope;
    this.decisionBridge.scope = scope;
    this.intelligenceBridge.scope = scope;
    return this;
  }

  buildBridges(query) {
    const knowledge = this.knowledgeBridge.search(query);
    return {
      memory: this.memoryBridge.getContext(),
      decisions: this.decisionBridge.getRecommendations(),
      intelligence: this.intelligenceBridge.getRanked(),
      knowledge,
      orchestration: this.orchestrator?.getSnapshot?.() || null,
      mock: true,
    };
  }
}

export default AgentContext;
