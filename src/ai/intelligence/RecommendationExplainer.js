/** Recommendation explainability — answers why this/now/vendor/size/color/bundle */
export class RecommendationExplainer {
  static explain(recommendation = {}, profile = {}, intent = {}) {
    const title = recommendation.title || "this item";
    return {
      whyThis: `Because ${title} matches your ${profile.preferredCategories?.[0] || "interests"}.`,
      whyNow: intent.urgency === "high" ? "Because you have items in cart and may checkout soon." : "Because it aligns with your current browsing session.",
      whyVendor: profile.favoriteVendors?.[0] ? `Because ${profile.favoriteVendors[0]} is a vendor you trust.` : "Because this vendor has strong reputation on Yebone.",
      whySize: profile.preferredSizes?.[0] ? `Because size ${profile.preferredSizes[0]} is in your profile.` : "Because this size fits common preferences in your category.",
      whyColor: profile.preferredColors?.[0] ? `Because ${profile.preferredColors[0]} matches your color preference.` : "Because this color is trending in your region.",
      whyBundle: recommendation.type === "bundle" ? "Because bundled items save money together." : "Because complementary items pair well with your cart.",
    };
  }
}

export default RecommendationExplainer;
