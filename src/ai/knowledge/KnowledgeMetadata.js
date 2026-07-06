/** Document metadata helpers — mock only */
export const buildMetadata = (overrides = {}) => ({
  source: "mock",
  locale: "en-RW",
  currency: "RWF",
  region: "East Africa",
  version: "1.0.0-mock",
  ...overrides,
});

export const extractMetadata = (doc) => ({
  id: doc.id,
  domain: doc.domain,
  lastUpdated: doc.lastUpdated,
  confidence: doc.confidence,
  visibility: doc.visibility,
  ...doc.metadata,
});

export default { buildMetadata, extractMetadata };
