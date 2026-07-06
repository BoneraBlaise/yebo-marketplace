/** Decision provider registry — no real AI integration yet. */

export const DECISION_PROVIDERS = {
  SHOPPING: "shopping",
  VENDOR: "vendor",
  ADMIN: "admin",
  FUTURE_OPENAI: "future-openai",
  FUTURE_GEMINI: "future-gemini",
  FUTURE_LOCAL: "future-local-model",
};

const REGISTRY = {
  [DECISION_PROVIDERS.SHOPPING]: { status: "active", label: "Shopping decisions" },
  [DECISION_PROVIDERS.VENDOR]: { status: "active", label: "Vendor decisions" },
  [DECISION_PROVIDERS.ADMIN]: { status: "active", label: "Admin decisions" },
  [DECISION_PROVIDERS.FUTURE_OPENAI]: { status: "planned", label: "OpenAI provider" },
  [DECISION_PROVIDERS.FUTURE_GEMINI]: { status: "planned", label: "Gemini provider" },
  [DECISION_PROVIDERS.FUTURE_LOCAL]: { status: "planned", label: "Local model" },
};

export class DecisionRegistry {
  static get(id) {
    return REGISTRY[id] || null;
  }

  static list() {
    return { ...REGISTRY };
  }

  static isActive(id) {
    return REGISTRY[id]?.status === "active";
  }
}

export default DecisionRegistry;
