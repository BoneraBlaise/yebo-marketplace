import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/** Wishlist memory — session wishlist context mirror (presentation only). */
export class WishlistMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("wishlist")) {
      this.storage.set("wishlist", { items: [], lastSyncedAt: null });
    }
  }

  get() {
    return this.storage.get("wishlist", { items: [], lastSyncedAt: null });
  }

  sync(items = []) {
    const snapshot = {
      items: Array.isArray(items) ? items.slice(0, 50) : [],
      lastSyncedAt: Date.now(),
    };
    this.storage.set("wishlist", snapshot);
    MemoryEvents.emit(MEMORY_EVENT.WISHLIST_SYNC, snapshot);
    return snapshot;
  }

  getSnapshot() {
    const w = this.get();
    return { items: [...(w.items || [])], lastSyncedAt: w.lastSyncedAt };
  }

  clear() {
    this.storage.set("wishlist", { items: [], lastSyncedAt: null });
  }
}

export const createWishlistMemory = (storage) => new WishlistMemory(storage);

export default WishlistMemory;
