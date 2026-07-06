import { computeStatistics } from "./KnowledgeStatistics";

/** Immutable knowledge snapshot for providers */
export const createKnowledgeSnapshot = (engine) => ({
  timestamp: new Date().toISOString(),
  index: engine.index.snapshot(),
  statistics: computeStatistics(engine.registry),
  domains: engine.getKnowledgeDomains(),
  mock: true,
});

export default { createKnowledgeSnapshot };
