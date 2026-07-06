import { pushUnique } from "./MemoryHelpers";

/** Recently viewed memory — lightweight product view trail. */
export class RecentlyViewedMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("recentlyViewed")) {
      this.storage.set("recentlyViewed", []);
    }
  }

  get() {
    return this.storage.get("recentlyViewed", []);
  }

  seed(items = []) {
    this.storage.set("recentlyViewed", items.slice(0, 20));
    return this.get();
  }

  add(item) {
    const list = pushUnique(this.get(), item, "id", 20);
    this.storage.set("recentlyViewed", list);
    return list;
  }

  getRecent(limit = 5) {
    return this.get().slice(0, limit);
  }

  getSnapshot() {
    return [...this.get()];
  }

  clear() {
    this.storage.set("recentlyViewed", []);
  }
}

export const createRecentlyViewedMemory = (storage) => new RecentlyViewedMemory(storage);

export default RecentlyViewedMemory;
