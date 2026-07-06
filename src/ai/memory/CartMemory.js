import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/** Cart memory — session cart context mirror (presentation only). */
export class CartMemory {
  constructor(storage) {
    this.storage = storage;
    if (!this.storage.get("cart")) {
      this.storage.set("cart", { items: [], lastSyncedAt: null });
    }
  }

  get() {
    return this.storage.get("cart", { items: [], lastSyncedAt: null });
  }

  sync(items = []) {
    const snapshot = {
      items: Array.isArray(items) ? items.slice(0, 50) : [],
      lastSyncedAt: Date.now(),
    };
    this.storage.set("cart", snapshot);
    MemoryEvents.emit(MEMORY_EVENT.CART_SYNC, snapshot);
    return snapshot;
  }

  getItemCount() {
    return (this.get().items || []).length;
  }

  getSnapshot() {
    const c = this.get();
    return { items: [...(c.items || [])], lastSyncedAt: c.lastSyncedAt };
  }

  clear() {
    this.storage.set("cart", { items: [], lastSyncedAt: null });
  }
}

export const createCartMemory = (storage) => new CartMemory(storage);

export default CartMemory;
