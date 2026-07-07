import { createContextOptimizer } from "../context/ContextOptimizer";

/** Applies context optimization before prompt assembly — Phase 8C */
export class ContextOptimizationInjector {
  constructor(contextOptimizer = null) {
    this.contextOptimizer = contextOptimizer || createContextOptimizer();
  }

  inject(context) {
    try {
      const optimization = this.contextOptimizer.optimize(context);
      return {
        ...optimization.context,
        contextOptimized: true,
        optimization: {
          originalTokens: optimization.originalTokens,
          optimizedTokens: optimization.optimizedTokens,
          compressed: optimization.compressed,
          prioritizedBlockCount: optimization.prioritizedBlockCount,
        },
        metadata: {
          ...context.metadata,
          ...(optimization.context.metadata || {}),
          contextOptimized: true,
          optimizedTokens: optimization.optimizedTokens,
        },
      };
    } catch {
      return { ...context, contextOptimized: false };
    }
  }
}

export const createContextOptimizationInjector = (optimizer) =>
  new ContextOptimizationInjector(optimizer);

export default ContextOptimizationInjector;
