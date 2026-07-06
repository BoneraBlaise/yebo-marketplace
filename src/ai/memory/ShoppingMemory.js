import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/**
 * Unified shopping memory — aggregates session signals for YEBO.
 * Presentation-only; no business logic.
 */
export class ShoppingMemory {
  constructor(storage, modules) {
    this.storage = storage;
    this.modules = modules;
    if (!this.storage.get("shopping")) {
      this.storage.set("shopping", { activeScope: "homepage", reminders: [] });
    }
  }

  get() {
    return this.storage.get("shopping", { activeScope: "homepage", reminders: [] });
  }

  setActiveScope(scope) {
    const data = this.get();
    data.activeScope = scope;
    data.scopeChangedAt = Date.now();
    this.storage.set("shopping", data);
    MemoryEvents.emit(MEMORY_EVENT.CONTEXT_CHANGE, { scope });
    return data;
  }

  seedReminders(reminders = []) {
    const data = this.get();
    data.reminders = reminders;
    this.storage.set("shopping", data);
    return data.reminders;
  }

  getReminders(limit = 6) {
    return (this.get().reminders || []).slice(0, limit);
  }

  getCrossPageMessages() {
    const { session, products, search } = this.modules;
    const sessionSnap = session?.getSnapshot?.() || {};
    const viewed = products?.getRecentlyViewed?.(2) || sessionSnap.visitedProducts?.slice(0, 2) || [];
    const compared = products?.getRecentlyCompared?.(1) || [];
    const recentSearch = search?.getRecent?.(1)?.[0];

    const messages = [];
    if (viewed.length) {
      messages.push({
        id: "viewed",
        message: `You recently viewed ${viewed.map((p) => p.name).join(" and ")}.`,
        action: "See history",
      });
    }
    if (compared.length) {
      const c = compared[0];
      messages.push({
        id: "compared",
        message: `You compared ${(c.names || []).join(" vs ")}.`,
        action: "Compare again",
      });
    }
    if (recentSearch) {
      messages.push({
        id: "continue",
        message: `Continue shopping for "${recentSearch}".`,
        action: "Resume",
      });
    }
    return messages;
  }

  getSnapshot() {
    const s = this.get();
    return {
      activeScope: s.activeScope,
      scopeChangedAt: s.scopeChangedAt,
      reminders: [...(s.reminders || [])],
    };
  }

  clear() {
    this.storage.set("shopping", { activeScope: "homepage", reminders: [] });
  }
}

export const createShoppingMemory = (storage, modules) => new ShoppingMemory(storage, modules);

export default ShoppingMemory;
