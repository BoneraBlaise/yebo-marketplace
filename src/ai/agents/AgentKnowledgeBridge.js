/** Read-only bridge to Knowledge Platform */
export class AgentKnowledgeBridge {
  constructor(knowledgeEngine) {
    this.knowledgeEngine = knowledgeEngine;
  }

  search(query, options = {}) {
    return this.knowledgeEngine?.searchKnowledge?.(query, options) || { results: [], mock: true };
  }

  getDocument(id) {
    return this.knowledgeEngine?.getKnowledge?.(id) || null;
  }

  getContext(query) {
    return { knowledge: this.search(query), mock: true };
  }
}

export default AgentKnowledgeBridge;
