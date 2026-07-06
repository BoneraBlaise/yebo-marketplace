import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/** Search memory — recent queries and search context. */
export class SearchMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("search")) {
      this.storage.set("search", { recent: [], contexts: [] });
    }
  }

  get() {
    return this.storage.get("search", { recent: [], contexts: [] });
  }

  seed(recent = []) {
    this.storage.set("search", { recent, contexts: [] });
    MemoryEvents.emit(MEMORY_EVENT.SEARCH, this.get());
    return this.get();
  }

  addSearch(query, context = {}) {
    if (!query?.trim()) return this.get();
    const data = this.get();
    data.recent = [query, ...data.recent.filter((q) => q !== query)].slice(0, 20);
    data.contexts = [{ query, ...context, at: Date.now() }, ...(data.contexts || [])].slice(0, 20);
    this.storage.set("search", data);
    MemoryEvents.emit(MEMORY_EVENT.SEARCH, { query, context });
    return data;
  }

  getRecent(limit = 5) {
    return (this.get().recent || []).slice(0, limit);
  }

  getSnapshot() {
    const s = this.get();
    return { recent: [...(s.recent || [])], contexts: [...(s.contexts || [])] };
  }

  clear() {
    this.storage.set("search", { recent: [], contexts: [] });
  }
}

export const createSearchMemory = (storage) => new SearchMemory(storage);

export default SearchMemory;
