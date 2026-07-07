/** Development-only pipeline timing metrics — Phase 8B.5 */

export class ConversationMetrics {
  constructor() {
    this.reset();
  }

  reset() {
    this.timings = {
      execution: 0,
      provider: 0,
      prompt: 0,
      memory: 0,
      knowledge: 0,
      action: 0,
      context: 0,
      reasoning: 0,
      contextOptimization: 0,
      recovery: 0,
      total: 0,
    };
    this.startedAt = null;
  }

  startPipeline() {
    this.reset();
    this.startedAt = Date.now();
  }

  record(stage, durationMs) {
    if (Object.prototype.hasOwnProperty.call(this.timings, stage)) {
      this.timings[stage] += durationMs;
    }
  }

  finish() {
    if (this.startedAt) {
      this.timings.total = Date.now() - this.startedAt;
    }
    return this.getSnapshot();
  }

  getSnapshot() {
    return { ...this.timings };
  }
}

export const createConversationMetrics = () => new ConversationMetrics();

export default ConversationMetrics;
