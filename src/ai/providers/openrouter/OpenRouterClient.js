import {
  getOpenRouterApiKey,
  isOpenRouterConfigured,
  logOpenRouterDebug,
} from "./OpenRouterConfig";
import { estimateTokens } from "../ProviderHelpers";

const DEFAULT_MODEL = "google/gemma-4-31b-it:free";
const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";
const OPENROUTER_REFERER = "http://localhost:3000";
const OPENROUTER_TITLE = "YEBO Development";

const buildMessages = (input) => {
  if (Array.isArray(input)) return input;
  const text = typeof input === "string" ? input : JSON.stringify(input);
  return [{ role: "user", content: text }];
};

const extractDelta = (data) => data?.choices?.[0]?.delta?.content || "";

const extractContent = (data) => data?.choices?.[0]?.message?.content || "";

const parseApiError = async (response) => {
  let detail = "";
  try {
    const body = await response.json();
    detail = body?.error?.message || body?.message || "";
  } catch {
    /* ignore parse failure */
  }
  return detail ? `${response.status}: ${detail}` : String(response.status);
};

const buildHeaders = (apiKey) => ({
  Authorization: `Bearer ${apiKey}`,
  "Content-Type": "application/json",
  "HTTP-Referer": OPENROUTER_REFERER,
  "X-Title": OPENROUTER_TITLE,
});

/** OpenRouter API client — live when REACT_APP_OPENROUTER_API_KEY is set */
export class OpenRouterClient {
  constructor(apiKeyOrConfig) {
    const config =
      typeof apiKeyOrConfig === "string" ? { apiKey: apiKeyOrConfig } : apiKeyOrConfig || {};
    this.config = config;
    this.apiKey = config.apiKey || getOpenRouterApiKey();
    this.modelName = config.openRouterModel || DEFAULT_MODEL;
    this._ready = false;
    this._activeAbort = null;
    logOpenRouterDebug("configured", {
      configured: isOpenRouterConfigured(),
      model: this.modelName,
    });
  }

  isLive() {
    return isOpenRouterConfigured() && Boolean(this.apiKey);
  }

  getApiKey() {
    return this.apiKey || getOpenRouterApiKey();
  }

  async initialize() {
    if (!this.isLive()) {
      return { configured: false, mock: true, providerId: "openrouter" };
    }
    this._ready = true;
    return { configured: true, mock: false, providerId: "openrouter", model: this.modelName };
  }

  async ensureReady() {
    if (!this.isLive()) return false;
    if (!this._ready) await this.initialize();
    return this._ready;
  }

  abort() {
    if (this._activeAbort) {
      this._activeAbort();
      this._activeAbort = null;
      logOpenRouterDebug("abort");
    }
  }

  abortActive() {
    this.abort();
  }

  async health() {
    const start = Date.now();
    const ready = await this.ensureReady();
    if (!ready) {
      logOpenRouterDebug("health", { configured: false, healthy: false });
      return { configured: false, healthy: false, providerId: "openrouter" };
    }

    try {
      const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
        method: "POST",
        headers: buildHeaders(this.getApiKey()),
        body: JSON.stringify({
          model: this.modelName,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: 4,
          temperature: 0,
        }),
      });

      const durationMs = Date.now() - start;
      logOpenRouterDebug("health", {
        httpStatus: response.status,
        durationMs,
        model: this.modelName,
      });

      if (!response.ok) {
        throw new Error(`OpenRouter health failed: ${await parseApiError(response)}`);
      }

      const data = await response.json();
      return {
        configured: true,
        healthy: true,
        providerId: "openrouter",
        model: data.model || this.modelName,
        durationMs,
        httpStatus: response.status,
      };
    } catch (err) {
      logOpenRouterDebug("health", { healthy: false, error: err.message });
      throw err;
    }
  }

  async chat(messages, options = {}) {
    const ready = await this.ensureReady();
    if (!ready) return null;

    const start = Date.now();
    const payload = buildMessages(messages);
    const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
      method: "POST",
      headers: buildHeaders(this.getApiKey()),
      body: JSON.stringify({
        model: options.model || this.modelName,
        messages: payload,
        stream: false,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.maxTokens,
      }),
    });

    const durationMs = Date.now() - start;
    logOpenRouterDebug("request", {
      httpStatus: response.status,
      durationMs,
      model: this.modelName,
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${await parseApiError(response)}`);
    }

    const data = await response.json();
    if (data?.error) {
      throw new Error(data.error.message || "OpenRouter API error");
    }

    const content = extractContent(data);
    const promptText = payload.map((m) => m.content).join(" ");

    return {
      providerId: "openrouter",
      content,
      model: data.model || this.modelName,
      tokens: estimateTokens(content) + estimateTokens(promptText),
      mock: false,
      durationMs,
      httpStatus: response.status,
    };
  }

  createStreamGenerator(messages, options = {}) {
    const controller = new AbortController();
    this._activeAbort = () => controller.abort();
    const payload = buildMessages(messages);

    const generator = (async function* streamBody() {
      const start = Date.now();
      const response = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
        method: "POST",
        headers: buildHeaders(this.getApiKey()),
        signal: controller.signal,
        body: JSON.stringify({
          model: options.model || this.modelName,
          messages: payload,
          stream: true,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens,
        }),
      });

      logOpenRouterDebug("stream", {
        httpStatus: response.status,
        model: this.modelName,
      });

      if (!response.ok) {
        throw new Error(`OpenRouter stream error: ${await parseApiError(response)}`);
      }

      if (!response.body) {
        throw new Error("OpenRouter stream error: empty response body");
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
            const text = extractDelta(data);
            if (text) yield text;
          } catch {
            /* skip malformed SSE chunk */
          }
        }
      }

      logOpenRouterDebug("stream complete", {
        durationMs: Date.now() - start,
        httpStatus: response.status,
      });
    }).bind(this)();

    return {
      generator,
      abort: () => controller.abort(),
    };
  }

  async *stream(messages, options = {}) {
    const { generator } = this.createStreamGenerator(messages, options);
    try {
      for await (const chunk of generator) {
        yield chunk;
      }
    } finally {
      this._activeAbort = null;
    }
  }
}

export default OpenRouterClient;
