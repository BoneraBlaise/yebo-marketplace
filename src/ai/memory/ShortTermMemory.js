/** Short-term session memory abstraction — Phase 8C */

export class ShortTermMemory {
  constructor(engine) {
    this.engine = engine;
  }

  getSnapshot() {
    if (!this.engine?.getSnapshot) return null;
    const snap = this.engine.getSnapshot();
    return {
      session: snap.session || {},
      conversation: snap.conversation || {},
      search: snap.search || {},
      cart: snap.cart || {},
      wishlist: snap.wishlist || {},
      recentlyViewed: snap.recentlyViewed || {},
      shopping: snap.shopping || {},
    };
  }

  retrieve(query = "", options = {}) {
    const snap = this.getSnapshot();
    if (!snap) return { items: [], scope: "short_term" };

    const q = String(query || "").toLowerCase();
    const limit = options.limit ?? 10;
    const items = [];

    const push = (type, data, score = 1) => {
      if (!data) return;
      const text = JSON.stringify(data).toLowerCase();
      if (!q || text.includes(q)) {
        items.push({ type, data, score, scope: "short_term" });
      }
    };

    push("session", snap.session, 0.9);
    push("conversation", snap.conversation, 0.85);
    push("search", snap.search, 0.8);
    push("cart", snap.cart, 0.75);
    push("wishlist", snap.wishlist, 0.7);
    push("recentlyViewed", snap.recentlyViewed, 0.65);
    push("shopping", snap.shopping, 0.6);

    return { items: items.slice(0, limit), scope: "short_term", count: items.length };
  }
}

export const createShortTermMemory = (engine) => new ShortTermMemory(engine);

export default ShortTermMemory;
