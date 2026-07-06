import { pushUnique } from "./MemoryHelpers";
import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/** Session-scoped memory — visited products, categories, vendors, goals. */
export class SessionMemory {
  constructor(storage) {
    this.storage = storage;
    this._init();
  }

  _init() {
    if (!this.storage.get("session")) {
      this.storage.set("session", {
        visitedProducts: [],
        viewedCategories: [],
        recentVendors: [],
        shoppingGoal: null,
        conversationState: null,
        startedAt: Date.now(),
      });
    }
  }

  get() {
    return this.storage.get("session", {});
  }

  seed(mock = {}) {
    const current = this.get();
    this.storage.set("session", { ...current, ...mock, seeded: true });
    MemoryEvents.emit(MEMORY_EVENT.SESSION_UPDATE, this.get());
    return this.get();
  }

  addVisitedProduct(product) {
    const session = this.get();
    session.visitedProducts = pushUnique(session.visitedProducts || [], product, "id", 20);
    session.lastActivityAt = Date.now();
    this.storage.set("session", session);
    MemoryEvents.emit(MEMORY_EVENT.PRODUCT_VIEW, product);
    return session.visitedProducts;
  }

  addViewedCategory(category) {
    const session = this.get();
    session.viewedCategories = pushUnique(session.viewedCategories || [], category, "id", 15);
    this.storage.set("session", session);
    MemoryEvents.emit(MEMORY_EVENT.SESSION_UPDATE, session);
  }

  addRecentVendor(vendor) {
    const session = this.get();
    session.recentVendors = pushUnique(session.recentVendors || [], vendor, "id", 10);
    this.storage.set("session", session);
  }

  setShoppingGoal(goal) {
    const session = this.get();
    session.shoppingGoal = goal;
    this.storage.set("session", session);
    MemoryEvents.emit(MEMORY_EVENT.SESSION_UPDATE, session);
  }

  setConversationState(state) {
    const session = this.get();
    session.conversationState = state;
    this.storage.set("session", session);
  }

  getSnapshot() {
    const s = this.get();
    return {
      visitedProducts: [...(s.visitedProducts || [])],
      viewedCategories: [...(s.viewedCategories || [])],
      recentVendors: [...(s.recentVendors || [])],
      shoppingGoal: s.shoppingGoal,
      conversationState: s.conversationState,
      startedAt: s.startedAt,
      lastActivityAt: s.lastActivityAt,
    };
  }

  clear() {
    this._init();
    MemoryEvents.emit(MEMORY_EVENT.CLEAR, { scope: "session" });
  }
}

export const createSessionMemory = (storage) => new SessionMemory(storage);

export default SessionMemory;
