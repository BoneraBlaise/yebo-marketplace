import { KNOWLEDGE_DOMAIN } from "./KnowledgeTypes";

/** Organization / marketplace knowledge — Phase 8C */
export class OrganizationKnowledge {
  constructor({ search = null } = {}) {
    this.search = search;
  }

  retrieve(query = "", options = {}) {
    if (!this.search) return { domain: "organization", results: [], count: 0 };

    const marketplace = this.search.searchMarketplace
      ? this.search.searchMarketplace(query, options)
      : [];
    const policies = this.search.searchPolicies
      ? this.search.searchPolicies(query, options)
      : [];
    const vendors = this.search.searchVendors
      ? this.search.searchVendors(query, options)
      : [];

    const results = [...marketplace, ...policies, ...vendors].slice(0, options.limit ?? 5);

    return {
      domain: "organization",
      domains: [KNOWLEDGE_DOMAIN.MARKETPLACE, KNOWLEDGE_DOMAIN.POLICY, KNOWLEDGE_DOMAIN.VENDOR],
      results,
      count: results.length,
    };
  }
}

export const createOrganizationKnowledge = (deps) => new OrganizationKnowledge(deps);

export default OrganizationKnowledge;
