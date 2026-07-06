/** Knowledge platform configuration — no env vars, no persistence */
export const defaultKnowledgeConfig = {
  cacheEnabled: true,
  cacheTtlMs: 300000,
  maxResults: 20,
  defaultVisibility: "public",
  rankingEnabled: true,
  relationshipsEnabled: true,
  mockMode: true,
};

export const mergeKnowledgeConfig = (partial = {}) => ({
  ...defaultKnowledgeConfig,
  ...partial,
});

export default defaultKnowledgeConfig;
