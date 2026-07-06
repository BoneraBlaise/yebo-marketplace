import { sortByRelevance } from "./KnowledgeHelpers";

/** Rank knowledge results — mock scoring only */
export const rankResults = (docs, query, config = {}) => {
  if (!config.rankingEnabled) return docs;
  return sortByRelevance(docs, query);
};

export const rankByPriority = (docs) =>
  [...docs].sort((a, b) => b.priority - a.priority || b.confidence - a.confidence);

export default { rankResults, rankByPriority };
