export const delay = (ms = 100) => new Promise((r) => setTimeout(r, ms));

export const mockResponse = (providerName, input) => {
  const text = (input || "").slice(0, 80);
  return `[${providerName}] Mock response for: "${text}". No API key or SDK call was made.`;
};

export const estimateTokens = (text = "") => Math.max(1, Math.ceil((text.length || 1) / 4));

export default { delay, mockResponse, estimateTokens };
