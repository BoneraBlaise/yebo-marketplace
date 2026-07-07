/**
 * YEBO Memory Engine — composes all memory modules.
 * Architecture only; mock session seeding for presentation.
 */
import { MemoryStorage, createMemoryStorage } from "./MemoryStorage";
import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";
import { createSessionMemory } from "./SessionMemory";
import { createPreferenceMemory } from "./PreferenceMemory";
import { createConversationMemory } from "./ConversationMemory";
import { createSearchMemory } from "./SearchMemory";
import { createProductMemory } from "./ProductMemory";
import { createCartMemory } from "./CartMemory";
import { createWishlistMemory } from "./WishlistMemory";
import { createRecentlyViewedMemory } from "./RecentlyViewedMemory";
import { createRecommendationMemory } from "./RecommendationMemory";
import { createShoppingMemory } from "./ShoppingMemory";
import { YIPMemory } from "./YIPMemory";
import { createMemoryRetrieval } from "./MemoryRetrieval";
import {
  MOCK_VISITED_PRODUCTS,
  MOCK_VIEWED_CATEGORIES,
  MOCK_RECENT_SEARCHES,
  MOCK_COMPARED_PRODUCTS,
  MOCK_RECENT_VENDORS,
  MOCK_SHOPPING_GOAL,
  MOCK_CONVERSATION_STATE,
  MOCK_PREFERENCES,
  MOCK_SMART_REMINDERS,
  MOCK_CONVERSATION_MEMORY,
  MOCK_SAVED_INTERESTS,
  MOCK_RECOMMENDATION_HISTORY,
  MOCK_SHOPPING_TIMELINE,
  MOCK_SHOPPING_JOURNEY,
  MOCK_CUSTOMER_MEMORY,
  MOCK_VENDOR_MEMORY,
  MOCK_ADMIN_MEMORY,
  MOCK_CROSS_PAGE_MESSAGES,
} from "./yebMemoryMockData";

export class YEBOMemoryEngine {
  constructor(options = {}) {
    this.storage = createMemoryStorage(options);
    this.events = MemoryEvents;
    this.legacy = new YIPMemory();

    this.session = createSessionMemory(this.storage);
    this.preferences = createPreferenceMemory(this.storage);
    this.conversation = createConversationMemory(this.storage);
    this.search = createSearchMemory(this.storage);
    this.products = createProductMemory(this.storage);
    this.cart = createCartMemory(this.storage);
    this.wishlist = createWishlistMemory(this.storage);
    this.recentlyViewed = createRecentlyViewedMemory(this.storage);
    this.recommendations = createRecommendationMemory(this.storage);

    this.shopping = createShoppingMemory(this.storage, {
      session: this.session,
      products: this.products,
      search: this.search,
    });

    this.retrieval = createMemoryRetrieval({ engine: this });

    this._mockMeta = {
      timeline: MOCK_SHOPPING_TIMELINE,
      journey: MOCK_SHOPPING_JOURNEY,
      customer: MOCK_CUSTOMER_MEMORY,
      vendor: MOCK_VENDOR_MEMORY,
      admin: MOCK_ADMIN_MEMORY,
      crossPage: MOCK_CROSS_PAGE_MESSAGES,
    };
  }

  /** Seed mock session data for presentation preview */
  seedMockSession() {
    this.session.seed({
      visitedProducts: MOCK_VISITED_PRODUCTS,
      viewedCategories: MOCK_VIEWED_CATEGORIES,
      recentVendors: MOCK_RECENT_VENDORS,
      shoppingGoal: MOCK_SHOPPING_GOAL,
      conversationState: MOCK_CONVERSATION_STATE,
    });
    this.preferences.seed(MOCK_PREFERENCES);
    this.search.seed(MOCK_RECENT_SEARCHES);
    this.products.seed({
      viewed: MOCK_VISITED_PRODUCTS,
      compared: MOCK_COMPARED_PRODUCTS,
    });
    this.recentlyViewed.seed(MOCK_VISITED_PRODUCTS);
    this.conversation.seed(MOCK_CONVERSATION_MEMORY);
    this.recommendations.seed({
      history: MOCK_RECOMMENDATION_HISTORY,
      interests: MOCK_SAVED_INTERESTS,
    });
    this.shopping.seedReminders(MOCK_SMART_REMINDERS);

    MOCK_RECENT_SEARCHES.forEach((q) => this.legacy.addRecentSearch(q));
    MOCK_VISITED_PRODUCTS.forEach((p) => this.legacy.addVisitedProduct(p));

    MemoryEvents.emit(MEMORY_EVENT.SESSION_UPDATE, this.getSnapshot());
    return this.getSnapshot();
  }

  setActiveScope(scope) {
    return this.shopping.setActiveScope(scope);
  }

  /** Bridge to legacy YIPMemory API */
  pushConversation(entry) {
    this.legacy.pushConversation(entry);
    this.conversation.addTurn({ role: entry.role, content: entry.title, intent: entry.intent });
  }

  addRecentSearch(query) {
    this.legacy.addRecentSearch(query);
    this.search.addSearch(query);
  }

  addVisitedProduct(product) {
    const normalized = { id: product.id || product._id, name: product.name, ...product };
    this.legacy.addVisitedProduct(normalized);
    this.session.addVisitedProduct(normalized);
    this.products.addView(normalized);
    this.recentlyViewed.add(normalized);
  }

  addComparison(pair) {
    this.products.addComparison(pair);
  }

  syncCart(items) {
    this.legacy.setCartContext(items);
    this.cart.sync(items);
  }

  syncWishlist(items) {
    this.legacy.setWishlistContext(items);
    this.wishlist.sync(items);
  }

  setPreference(key, value) {
    this.legacy.setPreference(key, value);
    this.preferences.set(key, value);
  }

  getWelcomeMessage() {
    const goal = this.session.get()?.shoppingGoal;
    if (goal?.label) {
      return `Welcome back — YEBO remembers your goal: ${goal.label}.`;
    }
    const lastSearch = this.search.getRecent(1)[0];
    if (lastSearch) {
      return `Welcome back — continue exploring "${lastSearch}".`;
    }
    return "Welcome back — YEBO remembers your shopping session.";
  }

  retrieve(query = "", options = {}) {
    return this.retrieval.retrieve(query, options);
  }

  getSnapshot() {
    return {
      session: this.session.getSnapshot(),
      preferences: this.preferences.getSnapshot(),
      conversation: this.conversation.getSnapshot(),
      search: this.search.getSnapshot(),
      products: this.products.getSnapshot(),
      cart: this.cart.getSnapshot(),
      wishlist: this.wishlist.getSnapshot(),
      recentlyViewed: this.recentlyViewed.getSnapshot(),
      recommendations: this.recommendations.getSnapshot(),
      shopping: this.shopping.getSnapshot(),
      legacy: this.legacy.getSnapshot(),
      visualization: {
        timeline: this._mockMeta.timeline,
        journey: this._mockMeta.journey,
        crossPage: this.shopping.getCrossPageMessages().length
          ? this.shopping.getCrossPageMessages()
          : this._mockMeta.crossPage,
      },
      dashboards: {
        customer: this._mockMeta.customer,
        vendor: this._mockMeta.vendor,
        admin: this._mockMeta.admin,
      },
    };
  }

  clear() {
    this.storage.clear();
    this.legacy.clear();
    MemoryEvents.emit(MEMORY_EVENT.CLEAR, { scope: "all" });
  }
}

export const createYEBOMemoryEngine = (options) => new YEBOMemoryEngine(options);

export default YEBOMemoryEngine;
