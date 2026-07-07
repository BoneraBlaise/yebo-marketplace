/** Injects existing Memory Engine data into conversation context */
export class MemoryInjector {
  constructor(memoryEngine = null) {
    this.memoryEngine = memoryEngine;
  }

  inject(context) {
    if (!this.memoryEngine) {
      return { ...context, memory: null, memoryInjected: false };
    }

    try {
      let memory = null;
      if (typeof this.memoryEngine.getSnapshot === "function") {
        memory = this.memoryEngine.getSnapshot();
      } else if (typeof this.memoryEngine.export === "function") {
        memory = this.memoryEngine.export();
      }

      return {
        ...context,
        memory,
        memoryInjected: Boolean(memory),
        metadata: {
          ...context.metadata,
          memoryAvailable: Boolean(memory),
        },
      };
    } catch {
      return { ...context, memory: null, memoryInjected: false };
    }
  }
}

export const createMemoryInjector = (memoryEngine) => new MemoryInjector(memoryEngine);

export default MemoryInjector;
