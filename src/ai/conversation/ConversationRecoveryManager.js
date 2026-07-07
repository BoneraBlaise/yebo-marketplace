/** Pipeline recovery — retry metadata and incomplete execution detection */

export class ConversationRecoveryManager {
  constructor({ maxRetries = 0 } = {}) {
    this.maxRetries = maxRetries;
    this.retryCount = 0;
    this.lastFailure = null;
    this.pipelineState = null;
  }

  captureState(state) {
    this.pipelineState = state ? { ...state, stagesCompleted: [...(state.stagesCompleted || [])] } : null;
    return this.pipelineState;
  }

  detectIncomplete(state = this.pipelineState) {
    if (!state) return false;
    return Boolean(state.startedAt && !state.completedAt && (state.stagesCompleted?.length || 0) > 0);
  }

  async retryStage(stageFn, stageName) {
    if (this.retryCount >= this.maxRetries) {
      throw new Error(`ConversationRecoveryManager: max retries reached for ${stageName}`);
    }
    this.retryCount += 1;
    return stageFn();
  }

  recover(failure = null, state = this.pipelineState) {
    if (failure) {
      this.lastFailure = failure;
    }
    return {
      recovered: false,
      incomplete: this.detectIncomplete(state),
      retryCount: this.retryCount,
      maxRetries: this.maxRetries,
      error: failure?.message || null,
      canRetry: this.retryCount < this.maxRetries,
    };
  }

  reset() {
    this.retryCount = 0;
    this.lastFailure = null;
    this.pipelineState = null;
  }
}

export const createConversationRecoveryManager = (options) =>
  new ConversationRecoveryManager(options);

export default ConversationRecoveryManager;
