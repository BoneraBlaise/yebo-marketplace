/** Mock reasoning templates — explains WHY a decision was made. */

const TEMPLATES = {
  viewed: (item) => `Because you viewed ${item || "similar items"}.`,
  size: (size) => `Because your preferred size is ${size || "a common fit"}.`,
  category: (cat) => `Because this ${cat || "category"} matches your interests.`,
  similar: () => "Because similar customers bought this.",
  matches: (trait) => `Because this item matches your ${trait || "preferences"}.`,
  budget: (range) => `Because it fits your budget range (${range || "mock range"}).`,
  trending: () => "Because this is trending this week.",
  vendor: (name) => `Because ${name || "this vendor"} has strong reputation.`,
  cart: () => "Because items in your cart pair well together.",
  wishlist: () => "Because it complements your wishlist.",
  search: (q) => `Because you searched for "${q || "related items"}".`,
};

export const DecisionReasoning = {
  fromRule(ruleId, memory = {}) {
    const prefs = memory.preferences || {};
    switch (ruleId) {
      case "recently_viewed":
        return TEMPLATES.viewed(memory.session?.visitedProducts?.[0]?.name);
      case "preferred_size":
        return TEMPLATES.size(prefs.favoriteSizes?.[0]);
      case "favorite_brands":
        return TEMPLATES.matches(`brand preference (${prefs.favoriteBrands?.[0] || "Nike"})`);
      case "favorite_colors":
        return TEMPLATES.matches(`color preference (${prefs.favoriteColors?.[0] || "Black"})`);
      case "budget":
        return TEMPLATES.budget(
          prefs.budgetRange
            ? `${prefs.budgetRange.min}-${prefs.budgetRange.max} ${prefs.budgetRange.currency || "RWF"}`
            : null
        );
      case "cart":
        return TEMPLATES.cart();
      case "wishlist":
        return TEMPLATES.wishlist();
      case "trending":
        return TEMPLATES.trending();
      case "vendor_reputation":
        return TEMPLATES.vendor(memory.session?.recentVendors?.[0]?.name);
      default:
        return TEMPLATES.matches("shopping profile");
    }
  },

  forSearch(query) {
    return TEMPLATES.search(query);
  },

  forCategory(category) {
    return TEMPLATES.category(category);
  },
};

export default DecisionReasoning;
