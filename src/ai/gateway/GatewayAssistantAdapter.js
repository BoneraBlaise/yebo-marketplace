import { BaseAdapter } from "../providers/BaseAdapter";
import { YIPGatewayClient } from "./YIPGatewayClient";

const GATEWAY_INDICATOR = {
  label: "YEBO Gateway",
  emoji: "🟡",
  key: "gateway_mock",
};

/** Routes assistant traffic through backend AI gateway — no browser LLM keys */
export class GatewayAssistantAdapter extends BaseAdapter {
  constructor() {
    super("gateway", "YEBO AI Gateway");
    this.connected = false;
    this.providerState = GATEWAY_INDICATOR;
  }

  async connect() {
    try {
      const health = await YIPGatewayClient.health();
      this.connected = health?.success === true;
      this.providerState = health?.data?.mockProviderActive
        ? GATEWAY_INDICATOR
        : { label: "YEBO Gateway Live", emoji: "🟢", key: "gateway_live" };
    } catch {
      this.connected = true;
      this.providerState = GATEWAY_INDICATOR;
    }
    return this.connected;
  }

  isAvailable() {
    return this.connected;
  }

  async complete(input, options = {}) {
    const response = await YIPGatewayClient.chat(input, {
      sessionId: options.sessionId || options.config?.session?.id || null,
      scope: options.scope,
      region: options.region,
      language: options.language,
    });
    const payload = response?.data || {};
    const recommendations = Array.isArray(payload.recommendations)
      ? payload.recommendations.map((entry) => ({
          _id: entry.searchPreview?.id || entry.product?._id,
          name: entry.searchPreview?.name || entry.product?.name,
          discountPrice: entry.searchPreview?.discountPrice ?? entry.product?.discountPrice,
          images: entry.searchPreview?.images || entry.product?.images,
          reason: (entry.reasons || []).join("; "),
        }))
      : [];
    return {
      content: payload.message || "YEBO gateway response unavailable.",
      placeholder: payload.provider?.mock !== false,
      metadata: {
        provider: payload.provider?.id || "gateway",
        requestId: payload.requestId,
        toolId: payload.toolId,
        recommendations,
        intent: payload.intent,
      },
    };
  }

  async *stream(input, options = {}) {
    yield* YIPGatewayClient.streamChat(input, {
      sessionId: options.sessionId || options.config?.session?.id || null,
      scope: options.scope,
      region: options.region,
      language: options.language,
    });
  }

  getSuggestedPrompts() {
    return [
      "Find white sneakers under 50,000 RWF",
      "Best gifts for her under 30,000 RWF",
      "Trending fashion this week",
    ];
  }

  getQuickActions() {
    return [
      { id: "search", label: "Smart search", icon: "search" },
      { id: "budget", label: "Budget helper", icon: "wallet" },
    ];
  }

  getConversationHistory() {
    return [];
  }

  getProviderIndicator() {
    return this.providerState;
  }
}

export default GatewayAssistantAdapter;
