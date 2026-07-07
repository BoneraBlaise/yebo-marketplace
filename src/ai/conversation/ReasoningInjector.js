import { createReasoningPipeline } from "../reasoning";

/** Injects AI reasoning into conversation context — Phase 8C */
export class ReasoningInjector {
  constructor(reasoningPipeline = null) {
    this.reasoningPipeline = reasoningPipeline || createReasoningPipeline();
  }

  inject(context, input = "") {
    try {
      const reasoning = this.reasoningPipeline.reason({ input, context });
      return {
        ...context,
        reasoning,
        reasoningInjected: true,
        metadata: {
          ...context.metadata,
          reasoningAvailable: true,
          reasoningConfidence: reasoning.confidence,
        },
      };
    } catch {
      return { ...context, reasoning: null, reasoningInjected: false };
    }
  }
}

export const createReasoningInjector = (pipeline) => new ReasoningInjector(pipeline);

export default ReasoningInjector;
