/** Injects existing Knowledge Engine data into conversation context */
export class KnowledgeInjector {
  constructor(knowledgeEngine = null) {
    this.knowledgeEngine = knowledgeEngine;
  }

  async inject(context, input = "") {
    if (!this.knowledgeEngine) {
      return { ...context, knowledge: null, knowledgeInjected: false };
    }

    try {
      let knowledge = null;
      const query = String(input || "");

      if (typeof this.knowledgeEngine.searchKnowledge === "function") {
        knowledge = this.knowledgeEngine.searchKnowledge(query, { limit: 3 });
      } else if (typeof this.knowledgeEngine.search === "function") {
        knowledge = await this.knowledgeEngine.search(query, { limit: 3 });
      } else if (typeof this.knowledgeEngine.getSnapshot === "function") {
        knowledge = this.knowledgeEngine.getSnapshot();
      }

      return {
        ...context,
        knowledge,
        knowledgeInjected: Boolean(knowledge),
        metadata: {
          ...context.metadata,
          knowledgeAvailable: Boolean(knowledge),
        },
      };
    } catch {
      return { ...context, knowledge: null, knowledgeInjected: false };
    }
  }
}

export const createKnowledgeInjector = (knowledgeEngine) =>
  new KnowledgeInjector(knowledgeEngine);

export default KnowledgeInjector;
