import { AI_PREVIEW_TYPE, AI_SERVICE } from "./CommerceTypes";
import { logCommerceDiagnostics } from "./CommerceDiagnostics";

const VALID_PREVIEW_TYPES = new Set(Object.values(AI_PREVIEW_TYPE));

/** AI Preview Orchestrator — orchestration only, no image generation — Phase 8D */
export class PreviewOrchestrator {
  constructor({ previewCache = null, creditPolicy = null, capabilityEngine = null } = {}) {
    this.previewCache = previewCache;
    this.creditPolicy = creditPolicy;
    this.capabilityEngine = capabilityEngine;
    this.lastOrchestration = null;
  }

  orchestrate({
    vendorId,
    ai_preview_type,
    productId = null,
    inputs = {},
    metadata = {},
  } = {}) {
    const previewType = String(ai_preview_type || "");

    if (!VALID_PREVIEW_TYPES.has(previewType)) {
      return {
        ok: false,
        error: "invalid_preview_type",
        ai_preview_type: previewType,
        validTypes: [...VALID_PREVIEW_TYPES],
      };
    }

    if (this.capabilityEngine && !this.capabilityEngine.isEnabled(vendorId, AI_SERVICE.PREVIEW)) {
      return { ok: false, error: "capability_disabled", ai_preview_type: previewType };
    }

    const cacheKey = this.previewCache?.buildKey({ ai_preview_type: previewType, productId, inputs });
    const cached = this.previewCache?.get(cacheKey);
    if (cached) {
      logCommerceDiagnostics("previewCache", { hit: true, ai_preview_type: previewType });
      this.lastOrchestration = { ...cached, fromCache: true, creditsConsumed: 0 };
      return { ok: true, ...this.lastOrchestration };
    }

    const creditCost = this.creditPolicy?.getCost(previewType) ?? 0;

    const orchestration = {
      ok: true,
      ai_preview_type: previewType,
      productId,
      inputs,
      metadata,
      vendorId,
      service: AI_SERVICE.PREVIEW,
      creditCost,
      creditsConsumed: creditCost,
      fromCache: false,
      status: "orchestrated",
      providerIndependent: true,
      imageGeneration: false,
      orchestratedAt: new Date().toISOString(),
      pipeline: ["validate_type", "capability_check", "cache_lookup", "credit_estimate", "ready"],
    };

    this.previewCache?.set(cacheKey, orchestration);
    this.lastOrchestration = orchestration;

    logCommerceDiagnostics("previewOrchestrator", {
      ai_preview_type: previewType,
      creditCost,
      productId,
    });

    return orchestration;
  }

  getLastOrchestration() {
    return this.lastOrchestration;
  }

  listPreviewTypes() {
    return [...VALID_PREVIEW_TYPES];
  }
}

export const createPreviewOrchestrator = (options) => new PreviewOrchestrator(options);

export default PreviewOrchestrator;
