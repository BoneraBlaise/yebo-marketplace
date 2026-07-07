import { createTokenOptimizer, estimateContextTokens } from "./TokenOptimizer";
import { createPromptCompressor } from "./PromptCompressor";
import { createContextPrioritizer } from "./ContextPrioritizer";

/** AI context optimization orchestrator — Phase 8C */
export class ContextOptimizer {
  constructor({ maxTokens = 4096 } = {}) {
    this.tokenOptimizer = createTokenOptimizer({ maxTokens });
    this.compressor = createPromptCompressor();
    this.prioritizer = createContextPrioritizer();
    this.lastOptimization = null;
  }

  optimize(context = {}, options = {}) {
    const startedAt = Date.now();
    const originalTokens = estimateContextTokens(context);

    let optimized = this.prioritizer.apply(context);
    optimized = this.compressor.compress(optimized);

    const tokenResult = this.tokenOptimizer.optimize(optimized, options);
    optimized = tokenResult.context;

    const result = {
      context: optimized,
      originalTokens,
      optimizedTokens: tokenResult.tokens,
      compressed: tokenResult.compressed || originalTokens > tokenResult.tokens,
      prioritizedBlockCount: optimized.prioritizedBlocks?.length || 0,
      elapsedMs: Date.now() - startedAt,
    };

    this.lastOptimization = result;
    return result;
  }
}

export const createContextOptimizer = (options) => new ContextOptimizer(options);

export default ContextOptimizer;
