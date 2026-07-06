/** Personalization profile from memory — mock only */
export class PersonalizationEngine {
  static buildProfile(memory = {}) {
    const prefs = memory.preferences || {};
    return {
      preferredCategories: prefs.favoriteCategories || ["Running Shoes", "Electronics"],
      preferredBrands: prefs.favoriteBrands || ["Nike", "Samsung"],
      preferredColors: prefs.favoriteColors || ["Black", "White"],
      preferredSizes: prefs.favoriteSizes || ["42", "M"],
      budget: prefs.budgetRange || { min: 20000, max: 150000, currency: "RWF" },
      shoppingFrequency: "4 sessions/week (mock)",
      favoriteVendors: (memory.session?.recentVendors || []).map((v) => v.name),
      interests: (memory.recommendations?.interests || []).map((i) => i.label),
      language: prefs.language || "en",
      region: prefs.country || "RW",
      currency: prefs.currency || "RWF",
    };
  }
}

export default PersonalizationEngine;
