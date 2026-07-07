import { KNOWLEDGE_DOMAIN } from "./KnowledgeTypes";

/** FAQ knowledge retrieval — Phase 8C */
export class FAQKnowledge {
  constructor({ search = null } = {}) {
    this.search = search;
  }

  retrieve(query = "", options = {}) {
    if (!this.search) return { domain: KNOWLEDGE_DOMAIN.FAQ, results: [], count: 0 };
    const results = this.search.searchFAQ
      ? this.search.searchFAQ(query, options)
      : this.search.search(query, { ...options, filters: { domain: KNOWLEDGE_DOMAIN.FAQ } });
    return {
      domain: KNOWLEDGE_DOMAIN.FAQ,
      results: results || [],
      count: (results || []).length,
    };
  }
}

export const createFAQKnowledge = (deps) => new FAQKnowledge(deps);

export default FAQKnowledge;
