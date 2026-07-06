import { resolveRelationships } from "./KnowledgeHelpers";

/** Knowledge pipeline — sources → normalize → relationships → rank → search */
export class KnowledgePipeline {
  constructor({ registry, search, index, config }) {
    this.registry = registry;
    this.search = search;
    this.index = index;
    this.config = config;
  }

  async execute(query, options = {}) {
    const normalizedQuery = (query || "").trim().toLowerCase();

    const rawResults = options.domain
      ? this.search._search(normalizedQuery, { domain: options.domain }, options.limit)
      : this.search.search(normalizedQuery, options);

    const enriched = rawResults.map((doc) => ({
      ...doc,
      relationships: this.config.relationshipsEnabled
        ? resolveRelationships(doc, this.registry.documents)
        : [],
    }));

    return {
      query: normalizedQuery,
      results: enriched,
      count: enriched.length,
      pipeline: ["sources", "normalization", "relationships", "ranking", "search"],
      mock: true,
    };
  }
}

export const createKnowledgePipeline = (deps) => new KnowledgePipeline(deps);

export default KnowledgePipeline;
