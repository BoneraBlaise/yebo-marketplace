import { getGeminiApiKey, isGeminiConfigured } from "./GeminiConfig";
import { estimateTokens } from "./ProviderHelpers";

const DEFAULT_MODEL = "gemini-2.0-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

const buildPrompt = (input) => (typeof input === "string" ? input : JSON.stringify(input));

const buildRequestBody = (input, options = {}) => ({
  contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
  generationConfig: {
    temperature: 0.7,
    ...(options.generationConfig || {}),
  },
});

const extractText = (data) =>
  data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

const parseApiError = async (response) => {
  let detail = "";
  try {
    const body = await response.json();
    detail = body?.error?.message || "";
  } catch {
    /* ignore parse failure */
  }
  return detail ? `${response.status}: ${detail}` : String(response.status);
};

/** Gemini API client — live when REACT_APP_GEMINI_API_KEY is set */
export class GeminiClient {
  constructor(config = {}) {
    this.config = config;
    this.modelName = config.geminiModel || DEFAULT_MODEL;
    this._ready = false;
    this._activeAbort = null;
  }

  isLive() {
    return isGeminiConfigured();
  }

  getApiKey() {
    return getGeminiApiKey();
  }

  getModelUrl(action) {
    return `${GEMINI_API_BASE}/models/${this.modelName}:${action}?key=${encodeURIComponent(
      getGeminiApiKey()
    )}`;
  }

  async initialize() {
    if (!this.isLive()) {
      return { configured: false, mock: true, providerId: "gemini" };
    }
    this._ready = true;
    return { configured: true, mock: false, providerId: "gemini", model: this.modelName };
  }

  async ensureReady() {
    if (!this.isLive()) return false;
    if (!this._ready) await this.initialize();
    return this._ready;
  }

  abortActive() {
    if (this._activeAbort) {
      this._activeAbort();
      this._activeAbort = null;
    }
  }

  async healthCheck() {
    const ready = await this.ensureReady();
    if (!ready) {
      return { configured: false, healthy: false, providerId: "gemini" };
    }

    const response = await fetch(
      `${GEMINI_API_BASE}/models/${this.modelName}?key=${encodeURIComponent(getGeminiApiKey())}`
    );

    if (!response.ok) {
      throw new Error(`Gemini health check failed: ${await parseApiError(response)}`);
    }

    const data = await response.json();
    return {
      configured: true,
      healthy: true,
      providerId: "gemini",
      model: data.name?.replace(/^models\//, "") || this.modelName,
      displayName: data.displayName || this.modelName,
    };
  }

  async chat(input, options = {}) {
    const ready = await this.ensureReady();
    if (!ready) return null;

    const prompt = buildPrompt(input);
    const response = await fetch(this.getModelUrl("generateContent"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(buildRequestBody(input, options)),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${await parseApiError(response)}`);
    }

    const data = await response.json();
    const content = extractText(data);

    return {
      providerId: "gemini",
      content,
      model: this.modelName,
      tokens: estimateTokens(content) + estimateTokens(prompt),
      mock: false,
    };
  }

  createStreamGenerator(input, options = {}) {
    const controller = new AbortController();
    this._activeAbort = () => controller.abort();

    const generator = (async function* streamBody() {
      const response = await fetch(`${this.getModelUrl("streamGenerateContent")}&alt=sse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify(buildRequestBody(input, options)),
      });

      if (!response.ok) {
        throw new Error(`Gemini stream error: ${await parseApiError(response)}`);
      }

      if (!response.body) {
        throw new Error("Gemini stream error: empty response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data:")) continue;

          const jsonStr = trimmed.slice(5).trim();
          if (!jsonStr || jsonStr === "[DONE]") continue;

          try {
            const data = JSON.parse(jsonStr);
            const text = extractText(data);
            if (text) yield text;
          } catch {
            /* skip malformed SSE chunk */
          }
        }
      }
    }).bind(this)();

    return {
      generator,
      abort: () => controller.abort(),
    };
  }

  async *streamGenerate(input, options = {}) {
    const { generator } = this.createStreamGenerator(input, options);
    try {
      for await (const chunk of generator) {
        yield chunk;
      }
    } finally {
      this._activeAbort = null;
    }
  }
}

export default GeminiClient;
