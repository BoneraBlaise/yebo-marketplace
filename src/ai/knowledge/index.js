/* YEBO Enterprise Knowledge Platform — Phase 7H (RAG-ready) */

export { KnowledgeEngine, KnowledgeContext, createKnowledgeEngine } from "./KnowledgeEngine";
export { ProductKnowledge, createProductKnowledge } from "./ProductKnowledge";
export { OrganizationKnowledge, createOrganizationKnowledge } from "./OrganizationKnowledge";
export { FAQKnowledge, createFAQKnowledge } from "./FAQKnowledge";
export { KnowledgeRetrieval, createKnowledgeRetrieval } from "./KnowledgeRetrieval";
export { logKnowledgeDiagnostics } from "./KnowledgeDiagnostics";
export { KnowledgeRegistry, createKnowledgeRegistry } from "./KnowledgeRegistry";
export { KnowledgeManager, createKnowledgeManager } from "./KnowledgeManager";
export { KnowledgeIndex, createKnowledgeIndex } from "./KnowledgeIndex";
export { KnowledgeSearch, createKnowledgeSearch } from "./KnowledgeSearch";
export { KnowledgePipeline, createKnowledgePipeline } from "./KnowledgePipeline";
export { KnowledgeRouter, createKnowledgeRouter } from "./KnowledgeRouter";
export { KnowledgeCache, createKnowledgeCache } from "./KnowledgeCache";
export { applyFilters, filterByDomain, filterByVisibility } from "./KnowledgeFilters";
export { rankResults, rankByPriority } from "./KnowledgeRanking";
export { ALL_KNOWLEDGE_DOMAINS, BaseKnowledgeDomain } from "./KnowledgeSources";
export { createKnowledgeSnapshot } from "./KnowledgeSnapshot";
export { computeStatistics } from "./KnowledgeStatistics";
export { KnowledgeProvider } from "./KnowledgeProvider";
export { useKnowledgeEngine, useKnowledgeEngineOptional } from "./KnowledgeHooks";
export { knowledgeEvents, KNOWLEDGE_EVENT } from "./KnowledgeEvents";
export { defaultKnowledgeConfig, mergeKnowledgeConfig } from "./KnowledgeConfig";
export { createKnowledgeDocument, matchesQuery, sortByRelevance } from "./KnowledgeHelpers";
export { buildMetadata, extractMetadata } from "./KnowledgeMetadata";
export { MOCK_KNOWLEDGE_DOCUMENTS } from "./MockKnowledge";
export * from "./KnowledgeTypes";
