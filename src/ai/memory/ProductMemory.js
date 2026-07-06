import { pushUnique } from "./MemoryHelpers";
import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/** Product memory — views, comparisons, summaries. */
export class ProductMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("products")) {
      this.storage.set("products", { viewed: [], compared: [], summaries: [] });
    }
  }

  get() {
    return this.storage.get("products", { viewed: [], compared: [], summaries: [] });
  }

  seed({ viewed = [], compared = [] } = {}) {
    this.storage.set("products", { viewed, compared, summaries: [] });
    return this.get();
  }

  addView(product) {
    const data = this.get();
    data.viewed = pushUnique(data.viewed || [], product, "id", 25);
    this.storage.set("products", data);
    MemoryEvents.emit(MEMORY_EVENT.PRODUCT_VIEW, product);
    return data.viewed;
  }

  addComparison(pair) {
    const data = this.get();
    data.compared = [{ ...pair, comparedAt: Date.now() }, ...(data.compared || [])].slice(0, 10);
    this.storage.set("products", data);
    MemoryEvents.emit(MEMORY_EVENT.COMPARE, pair);
    return data.compared;
  }

  getRecentlyViewed(limit = 5) {
    return (this.get().viewed || []).slice(0, limit);
  }

  getRecentlyCompared(limit = 3) {
    return (this.get().compared || []).slice(0, limit);
  }

  getSnapshot() {
    const p = this.get();
    return {
      viewed: [...(p.viewed || [])],
      compared: [...(p.compared || [])],
      summaries: [...(p.summaries || [])],
    };
  }

  clear() {
    this.storage.set("products", { viewed: [], compared: [], summaries: [] });
  }
}

export const createProductMemory = (storage) => new ProductMemory(storage);

export default ProductMemory;
