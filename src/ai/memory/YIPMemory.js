/** Session memory architecture — presentation-only, in-memory store. */

export class YIPMemory {
  constructor() {
    this.conversationHistory = [];
    this.visitedProducts = [];
    this.recentSearches = [];
    this.wishlistContext = [];
    this.cartContext = [];
    this.recentlyViewed = [];
    this.preferences = {};
  }

  pushConversation(entry) {
    this.conversationHistory = [{ ...entry, at: Date.now() }, ...this.conversationHistory].slice(0, 50);
  }

  addVisitedProduct(product) {
    this._pushUnique(this.visitedProducts, product, "id", 20);
  }

  addRecentSearch(query) {
    if (!query) return;
    this.recentSearches = [query, ...this.recentSearches.filter((q) => q !== query)].slice(0, 20);
  }

  setWishlistContext(items) {
    this.wishlistContext = Array.isArray(items) ? items.slice(0, 50) : [];
  }

  setCartContext(items) {
    this.cartContext = Array.isArray(items) ? items.slice(0, 50) : [];
  }

  setRecentlyViewed(items) {
    this.recentlyViewed = Array.isArray(items) ? items.slice(0, 20) : [];
  }

  setPreference(key, value) {
    this.preferences[key] = value;
  }

  getSnapshot() {
    return {
      conversationHistory: [...this.conversationHistory],
      visitedProducts: [...this.visitedProducts],
      recentSearches: [...this.recentSearches],
      wishlistContext: [...this.wishlistContext],
      cartContext: [...this.cartContext],
      recentlyViewed: [...this.recentlyViewed],
      preferences: { ...this.preferences },
    };
  }

  clear() {
    this.conversationHistory = [];
    this.visitedProducts = [];
    this.recentSearches = [];
    this.wishlistContext = [];
    this.cartContext = [];
    this.recentlyViewed = [];
    this.preferences = {};
  }

  _pushUnique(list, item, key, max) {
    const id = typeof item === "object" ? item[key] : item;
    const next = [item, ...list.filter((i) => (typeof i === "object" ? i[key] : i) !== id)];
    list.length = 0;
    list.push(...next.slice(0, max));
  }
}

export const createMemory = () => new YIPMemory();

export default YIPMemory;
