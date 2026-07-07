import { createProductKnowledge } from "./ProductKnowledge";
import { createOrganizationKnowledge } from "./OrganizationKnowledge";
import { createFAQKnowledge } from "./FAQKnowledge";
import { logKnowledgeDiagnostics } from "./KnowledgeDiagnostics";

/** Knowledge search abstraction and retrieval pipeline — Phase 8C */
export class KnowledgeRetrieval {
  constructor({ engine = null } = {}) {
    this.engine = engine;
    const search = engine?.search || engine?.manager?.search || null;
    this.pipeline = engine?.pipeline || engine?.manager?.pipeline || null;
    this.product = createProductKnowledge({ search });
    this.organization = createOrganizationKnowledge({ search });
    this.faq = createFAQKnowledge({ search });
  }

  async retrieve(query = "", options = {}) {
    const startedAt = Date.now();
    const q = String(query || "");

    let pipelineResult = null;
    if (this.pipeline?.execute) {
      pipelineResult = await this.pipeline.execute(q, options);
    } else if (this.engine?.searchKnowledge) {
      pipelineResult = this.engine.searchKnowledge(q, options);
    }

    const product = this.product.retrieve(q, options);
    const organization = this.organization.retrieve(q, options);
    const faq = this.faq.retrieve(q, options);

    const mergedResults = [
      ...(pipelineResult?.results || []),
      ...product.results,
      ...organization.results,
      ...faq.results,
    ];

    const seen = new Set();
    const deduped = mergedResults.filter((doc) => {
      const key = doc.id || doc.title || JSON.stringify(doc);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const limit = options.limit ?? 5;
    const result = {
      query: q,
      results: deduped.slice(0, limit),
      count: Math.min(deduped.length, limit),
      domains: {
        product: product.count,
        organization: organization.count,
        faq: faq.count,
      },
      pipeline: pipelineResult?.pipeline || ["product", "organization", "faq", "rank"],
      upstream: pipelineResult?.upstream || null,
    };

    logKnowledgeDiagnostics({
      query: q.slice(0, 40),
      resultCount: result.count,
      productHits: product.count,
      organizationHits: organization.count,
      faqHits: faq.count,
      elapsedMs: Date.now() - startedAt,
    });

    return result;
  }
}

export const createKnowledgeRetrieval = (deps) => new KnowledgeRetrieval(deps);

export default KnowledgeRetrieval;
