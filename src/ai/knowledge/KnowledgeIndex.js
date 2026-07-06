import { createKnowledgeRegistry } from "./KnowledgeRegistry";

/** Central knowledge index — single query surface for AI providers */
export class KnowledgeIndex {
  constructor(registry) {
    this.registry = registry || createKnowledgeRegistry();
  }

  query(filters = {}) {
    let docs = this.registry.getAllDocuments();
    if (filters.domain) {
      docs = docs.filter((d) => d.domain === filters.domain);
    }
    if (filters.id) {
      const doc = this.registry.getDocument(filters.id);
      return doc ? [doc] : [];
    }
    return docs;
  }

  getByDomain(domainId) {
    const domain = this.registry.getDomain(domainId);
    return domain ? domain.getDocuments() : [];
  }

  getRelationships(documentId) {
    const doc = this.registry.getDocument(documentId);
    if (!doc) return [];
    return (doc.relationships || []).map((rel) => ({
      ...rel,
      resolved: this.registry.getDocument(rel.targetId) || null,
    }));
  }

  snapshot() {
    return this.registry.getIndex();
  }
}

export const createKnowledgeIndex = (registry) => new KnowledgeIndex(registry);

export default KnowledgeIndex;
