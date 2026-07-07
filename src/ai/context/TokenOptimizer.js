/** Token budget estimation — Phase 8C */

const CHARS_PER_TOKEN = 4;

export const estimateTokens = (text = "") => {
  const len = String(text || "").length;
  return Math.ceil(len / CHARS_PER_TOKEN);
};

export const estimateContextTokens = (context = {}) => {
  const parts = [
    context.system?.instruction,
    ...(context.history || []).map((m) => m.content),
    context.memory ? JSON.stringify(context.memory) : "",
    context.knowledge ? JSON.stringify(context.knowledge) : "",
    context.user,
  ].filter(Boolean);

  return estimateTokens(parts.join("\n"));
};

export class TokenOptimizer {
  constructor({ maxTokens = 4096 } = {}) {
    this.maxTokens = maxTokens;
  }

  optimize(context = {}, options = {}) {
    const maxTokens = options.maxTokens ?? this.maxTokens;
    const current = estimateContextTokens(context);

    if (current <= maxTokens) {
      return { context, tokens: current, compressed: false };
    }

    const ratio = maxTokens / current;
    const history = context.history || [];
    const trimmedHistory = history.slice(Math.max(0, history.length - Math.floor(history.length * ratio)));

    return {
      context: { ...context, history: trimmedHistory },
      tokens: estimateContextTokens({ ...context, history: trimmedHistory }),
      compressed: true,
      originalTokens: current,
    };
  }
}

export const createTokenOptimizer = (options) => new TokenOptimizer(options);

export default TokenOptimizer;
