import { KNOWLEDGE_DOMAIN } from "./KnowledgeTypes";
import { matchesQuery } from "./KnowledgeHelpers";
import { applyFilters } from "./KnowledgeFilters";
import { rankResults } from "./KnowledgeRanking";
import { knowledgeEvents, KNOWLEDGE_EVENT } from "./KnowledgeEvents";

/** Reusable knowledge search interfaces — mock structured results */
export class KnowledgeSearch {
  constructor({ registry, cache, config }) {
    this.registry = registry;
    this.cache = cache;
    this.config = config;
  }

  _search(query, filters = {}, limit) {
    const cacheKey = JSON.stringify({ query, filters });
    const cached = this.cache?.get("search", cacheKey);
    if (cached) {
      knowledgeEvents.emit(KNOWLEDGE_EVENT.CACHE_HIT, { query });
      return cached;
    }

    knowledgeEvents.emit(KNOWLEDGE_EVENT.SEARCH, { query, filters });
    let docs = this.registry.getAllDocuments();
    docs = docs.filter((d) => matchesQuery(d, query));
    docs = applyFilters(docs, filters);
    docs = rankResults(docs, query, this.config);
    const results = docs.slice(0, limit ?? this.config.maxResults).map((doc) => ({
      ...doc,
      score: doc.priority,
      mock: true,
    }));

    this.cache?.set("search", cacheKey, results);
    knowledgeEvents.emit(KNOWLEDGE_EVENT.RESULT, { query, count: results.length });
    return results;
  }

  search(query, options = {}) {
    return this._search(query, options.filters, options.limit);
  }

  searchProducts(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.PRODUCT }, options.limit);
  }

  searchVendors(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.VENDOR }, options.limit);
  }

  searchPolicies(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.POLICY }, options.limit);
  }

  searchFAQ(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.FAQ }, options.limit);
  }

  searchMarketplace(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.MARKETPLACE }, options.limit);
  }

  searchFashion(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.FASHION }, options.limit);
  }

  searchShipping(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.SHIPPING }, options.limit);
  }

  searchCommission(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.COMMISSION }, options.limit);
  }

  searchEvents(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.EVENT }, options.limit);
  }

  searchAuctions(query, options = {}) {
    return this._search(query, { ...options.filters, domain: KNOWLEDGE_DOMAIN.AUCTION }, options.limit);
  }
}

export const createKnowledgeSearch = (deps) => new KnowledgeSearch(deps);

export default KnowledgeSearch;
