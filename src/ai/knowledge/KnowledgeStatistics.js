/** Knowledge platform statistics — mock only */
export const computeStatistics = (registry) => {
  const docs = registry.getAllDocuments();
  const byDomain = {};
  docs.forEach((d) => {
    byDomain[d.domain] = (byDomain[d.domain] || 0) + 1;
  });
  return {
    totalDocuments: docs.length,
    totalDomains: registry.listDomains().length,
    byDomain,
    avgConfidence: Math.round(docs.reduce((s, d) => s + d.confidence, 0) / docs.length),
    mock: true,
  };
};

export default { computeStatistics };
