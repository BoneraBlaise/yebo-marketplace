import { KNOWLEDGE_DOMAIN } from "./KnowledgeTypes";

/** Product knowledge retrieval — Phase 8C */
export class ProductKnowledge {
  constructor({ search = null } = {}) {
    this.search = search;
  }

  retrieve(query = "", options = {}) {
    if (!this.search) return { domain: KNOWLEDGE_DOMAIN.PRODUCT, results: [], count: 0 };
    const results = this.search.searchProducts
      ? this.search.searchProducts(query, options)
      : this.search.search(query, { ...options, filters: { domain: KNOWLEDGE_DOMAIN.PRODUCT } });
    return {
      domain: KNOWLEDGE_DOMAIN.PRODUCT,
      results: results || [],
      count: (results || []).length,
    };
  }
}

export const createProductKnowledge = (deps) => new ProductKnowledge(deps);

export default ProductKnowledge;
