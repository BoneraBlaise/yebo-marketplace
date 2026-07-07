/** Context block prioritization — Phase 8C */

const DEFAULT_WEIGHTS = {
  user: 1,
  history: 0.9,
  knowledge: 0.85,
  memory: 0.8,
  reasoning: 0.75,
  system: 0.7,
};

export class ContextPrioritizer {
  constructor({ weights = null } = {}) {
    this.weights = weights || DEFAULT_WEIGHTS;
  }

  prioritize(context = {}) {
    const blocks = [];

    if (context.user) blocks.push({ key: "user", weight: this.weights.user, data: context.user });
    if (context.history?.length) {
      blocks.push({ key: "history", weight: this.weights.history, data: context.history });
    }
    if (context.knowledge) {
      blocks.push({ key: "knowledge", weight: this.weights.knowledge, data: context.knowledge });
    }
    if (context.memory) {
      blocks.push({ key: "memory", weight: this.weights.memory, data: context.memory });
    }
    if (context.reasoning) {
      blocks.push({ key: "reasoning", weight: this.weights.reasoning, data: context.reasoning });
    }
    if (context.system) {
      blocks.push({ key: "system", weight: this.weights.system, data: context.system });
    }

    return blocks.sort((a, b) => b.weight - a.weight);
  }

  apply(context = {}) {
    const prioritized = this.prioritize(context);
    return {
      ...context,
      prioritizedBlocks: prioritized,
      metadata: {
        ...(context.metadata || {}),
        prioritizedBlockCount: prioritized.length,
      },
    };
  }
}

export const createContextPrioritizer = (options) => new ContextPrioritizer(options);

export default ContextPrioritizer;
