import { pushUnique } from "./MemoryHelpers";

/** Recommendation memory — YEBO recommendation history (mock). */
export class RecommendationMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("recommendations")) {
      this.storage.set("recommendations", { history: [], interests: [] });
    }
  }

  get() {
    return this.storage.get("recommendations", { history: [], interests: [] });
  }

  seed({ history = [], interests = [] } = {}) {
    this.storage.set("recommendations", { history, interests });
    return this.get();
  }

  addRecommendation(entry) {
    const data = this.get();
    data.history = [{ ...entry, at: Date.now() }, ...(data.history || [])].slice(0, 30);
    this.storage.set("recommendations", data);
    return data.history;
  }

  setInterests(interests) {
    const data = this.get();
    data.interests = interests;
    this.storage.set("recommendations", data);
    return data.interests;
  }

  getSnapshot() {
    const r = this.get();
    return {
      history: [...(r.history || [])],
      interests: [...(r.interests || [])],
    };
  }

  clear() {
    this.storage.set("recommendations", { history: [], interests: [] });
  }
}

export const createRecommendationMemory = (storage) => new RecommendationMemory(storage);

export default RecommendationMemory;
