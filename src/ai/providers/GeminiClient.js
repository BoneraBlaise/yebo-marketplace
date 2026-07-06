import { getGeminiApiKey, isGeminiConfigured } from "./GeminiConfig";
import { estimateTokens } from "./ProviderHelpers";

const DEFAULT_MODEL = "gemini-2.0-flash";
const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

/** Gemini API client — live when REACT_APP_GEMINI_API_KEY is set */
export class GeminiClient {
  constructor(config = {}) {
    this.config = config;
    this.modelName = config.geminiModel || DEFAULT_MODEL;
    this._ready = false;
  }

  isLive() {
    return isGeminiConfigured();
  }

  getApiKey() {
    return getGeminiApiKey();
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

  async chat(input, options = {}) {
    const ready = await this.ensureReady();
    if (!ready) return null;

    const prompt = typeof input === "string" ? input : JSON.stringify(input);
    const url = `${GEMINI_API_BASE}/models/${this.modelName}:generateContent?key=${encodeURIComponent(
      getGeminiApiKey()
    )}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        ...options.generationConfig,
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const content =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") || "";

    return {
      providerId: "gemini",
      content,
      model: this.modelName,
      tokens: estimateTokens(content) + estimateTokens(prompt),
      mock: false,
    };
  }
}

export default GeminiClient;
