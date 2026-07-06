/** Read-only bridge to Memory Engine */
export class AgentMemoryBridge {
  constructor(memoryEngine) {
    this.memoryEngine = memoryEngine;
  }

  getSnapshot() {
    return this.memoryEngine?.getSnapshot?.() || {};
  }

  getContext() {
    return { memory: this.getSnapshot(), mock: true };
  }
}

export default AgentMemoryBridge;
