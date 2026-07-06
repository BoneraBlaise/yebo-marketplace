import { VISIBILITY } from "./KnowledgeTypes";

/** Create a normalized knowledge document */
export const createKnowledgeDocument = ({
  id,
  domain,
  title,
  summary,
  content,
  keywords = [],
  tags = [],
  relationships = [],
  metadata = {},
  lastUpdated = new Date().toISOString(),
  confidence = 85,
  priority = 50,
  visibility = VISIBILITY.PUBLIC,
}) => ({
  id,
  domain,
  title,
  summary,
  content,
  keywords,
  tags,
  relationships,
  metadata,
  lastUpdated,
  confidence,
  priority,
  visibility,
  mock: true,
});

export const matchesQuery = (doc, query) => {
  const q = (query || "").toLowerCase().trim();
  if (!q) return true;
  const haystack = [doc.title, doc.summary, doc.content, ...doc.keywords, ...doc.tags]
    .join(" ")
    .toLowerCase();
  return q.split(/\s+/).every((term) => haystack.includes(term));
};

export const sortByRelevance = (docs, query) => {
  const q = (query || "").toLowerCase();
  return [...docs].sort((a, b) => {
    const scoreA = relevanceScore(a, q);
    const scoreB = relevanceScore(b, q);
    return scoreB - scoreA || b.priority - a.priority;
  });
};

const relevanceScore = (doc, q) => {
  if (!q) return doc.priority;
  let score = doc.priority;
  if (doc.title.toLowerCase().includes(q)) score += 30;
  if (doc.summary.toLowerCase().includes(q)) score += 15;
  doc.keywords.forEach((k) => {
    if (k.toLowerCase().includes(q)) score += 10;
  });
  return score;
};

export const resolveRelationships = (doc, index) =>
  (doc.relationships || [])
    .map((rel) => index.get(rel.targetId) || { id: rel.targetId, domain: rel.domain, title: rel.label, mock: true })
    .filter(Boolean);

export default { createKnowledgeDocument, matchesQuery, sortByRelevance, resolveRelationships };
