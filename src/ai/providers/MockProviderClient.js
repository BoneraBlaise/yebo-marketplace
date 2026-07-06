import { delay, mockResponse, estimateTokens } from "./ProviderHelpers";

/** Mock HTTP client — no real network calls */
export class MockProviderClient {
  constructor(providerId) {
    this.providerId = providerId;
    this.requestCount = 0;
  }

  async request(endpoint, payload = {}) {
    await delay(40 + Math.random() * 60);
    this.requestCount += 1;
    const input = payload.messages?.[0]?.content || payload.prompt || "";
    return {
      ok: true,
      endpoint,
      providerId: this.providerId,
      content: mockResponse(this.providerId, input),
      tokens: estimateTokens(input) + 32,
      mock: true,
    };
  }

  getRequestCount() {
    return this.requestCount;
  }
}

export default MockProviderClient;
