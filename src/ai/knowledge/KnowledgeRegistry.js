import { ALL_KNOWLEDGE_DOMAINS } from "./KnowledgeSources";
import { knowledgeEvents, KNOWLEDGE_EVENT } from "./KnowledgeEvents";

/** Central domain registry — future providers query ONLY this index */
export class KnowledgeRegistry {
  constructor() {
    this.domains = new Map();
    this.documents = new Map();
    this._seed();
  }

  _seed() {
    ALL_KNOWLEDGE_DOMAINS.forEach((domain) => {
      this.registerDomain(domain);
    });
  }

  registerDomain(domainModule) {
    const id = domainModule.getDomainId();
    this.domains.set(id, domainModule);
    domainModule.getDocuments().forEach((doc) => {
      this.documents.set(doc.id, doc);
    });
    knowledgeEvents.emit(KNOWLEDGE_EVENT.REGISTERED, { domainId: id });
    return domainModule;
  }

  getDomain(domainId) {
    return this.domains.get(domainId) || null;
  }

  listDomains() {
    return [...this.domains.values()].map((d) => ({
      id: d.getDomainId(),
      label: d.getLabel(),
      documentCount: d.getDocuments().length,
    }));
  }

  getDocument(id) {
    return this.documents.get(id) || null;
  }

  getAllDocuments() {
    return [...this.documents.values()];
  }

  getIndex() {
    return {
      domains: this.listDomains(),
      documentCount: this.documents.size,
      mock: true,
    };
  }
}

export const createKnowledgeRegistry = () => new KnowledgeRegistry();

export default KnowledgeRegistry;
