/**
 * YIP Shopping Intelligence — mock data & generators (Phase 7C).
 * No external APIs. Provider-independent via YIP.
 */

export const SMART_SEARCH_EXAMPLES = [
  "I need white sneakers under 50000 RWF",
  "Find a black office chair",
  "Best running shoes",
  "Affordable phone with good camera",
  "Gift for my girlfriend",
];

export const PROACTIVE_SUGGESTIONS = [
  { id: "viewed-shoes", message: "You've viewed several running shoes.", action: "Need help choosing?" },
  { id: "bundle", message: "These items work well together.", action: "See bundle suggestion" },
  { id: "save", message: "You can save money with this bundle.", action: "View savings" },
  { id: "interests", message: "This product matches your previous interests.", action: "Why YEBO recommends this" },
];

export const SHOPPING_INSIGHT_TYPES = [
  { id: "trending", title: "Trending this week", value: "Wireless earbuds +32%", tag: "Hot" },
  { id: "nearby", title: "Popular near you", value: "Fashion & electronics", tag: "Local" },
  { id: "also-viewed", title: "Customers also viewed", value: "12 related items", tag: "Social" },
  { id: "best-value", title: "Best value", value: "Top rated under 50K", tag: "Value" },
  { id: "most-saved", title: "Most saved", value: "Added to wishlist often", tag: "Saved" },
  { id: "limited", title: "Limited stock", value: "Only a few left", tag: "Urgent" },
  { id: "confidence", title: "High confidence", value: "94% match score", tag: "YEBO" },
];

export const GIFT_CATEGORIES = [
  { id: "him", label: "Gift for him" },
  { id: "her", label: "Gift for her" },
  { id: "birthday", label: "Birthday" },
  { id: "wedding", label: "Wedding" },
  { id: "sports", label: "Sports" },
  { id: "technology", label: "Technology" },
  { id: "fashion", label: "Fashion" },
  { id: "kids", label: "Kids" },
  { id: "business", label: "Business" },
];

export const BUDGET_OPTIONS = {
  ranges: ["Under 20,000 RWF", "20,000 – 50,000 RWF", "50,000 – 100,000 RWF", "100,000+ RWF"],
  categories: ["Fashion", "Electronics", "Home", "Sports", "Beauty", "Any"],
  purposes: ["Daily use", "Gift", "Work", "Special occasion", "Upgrade"],
};

export const MOCK_COMPARISON = (products = []) => {
  const items = (products.length ? products : [null, null]).slice(0, 2).map((p, i) => ({
    id: p?._id || `mock-${i}`,
    name: p?.name || (i === 0 ? "Premium Choice" : "Budget Pick"),
    price: p?.discountPrice || (i === 0 ? 45000 : 28000),
    rating: p?.ratings || (i === 0 ? 4.8 : 4.2),
    popularity: i === 0 ? "High" : "Rising",
    features: i === 0 ? ["Verified seller", "Free delivery", "2-year warranty"] : ["Best value", "Fast shipping"],
    pros: i === 0 ? ["Top rated", "Premium build"] : ["Affordable", "Great reviews"],
    cons: i === 0 ? ["Higher price"] : ["Fewer color options"],
    bestFor: i === 0 ? "Quality-focused buyers" : "Budget-conscious shoppers",
    yebonRecommendation: i === 0,
  }));
  return {
    items,
    yebonPick: items.find((x) => x.yebonRecommendation)?.name || items[0]?.name,
    summary: "YEBO recommends the premium choice for long-term value. The budget pick is ideal if price is your priority.",
  };
};

export const MOCK_SMART_SEARCH = (query, products = []) => {
  const pool = products.length ? products : [];
  const results = pool.slice(0, 4).map((p, i) => ({
    ...p,
    _id: p._id || `mock-result-${i}`,
    name: p.name || `Match for "${query?.slice(0, 20)}..."`,
    discountPrice: p.discountPrice || 25000 + i * 8000,
    matchScore: 92 - i * 4,
    reason: i === 0 ? "Best price match" : i === 1 ? "Top rated" : "Trending nearby",
  }));

  if (!results.length) {
    return {
      query,
      parsedIntent: detectIntent(query),
      results: [
        { _id: "m1", name: "White Running Sneakers", discountPrice: 42000, matchScore: 94, reason: "Budget match" },
        { _id: "m2", name: "Classic White Trainers", discountPrice: 38000, matchScore: 89, reason: "Popular choice" },
        { _id: "m3", name: "Sport Lite Sneakers", discountPrice: 45000, matchScore: 86, reason: "Verified seller" },
      ],
      tips: ["Use header search for live catalog results", "Refine budget in YEBO Budget Assistant"],
    };
  }

  return {
    query,
    parsedIntent: detectIntent(query),
    results,
    tips: ["Mock results via YIP · Header search unchanged"],
  };
};

const detectIntent = (query = "") => {
  const q = query.toLowerCase();
  if (q.includes("gift")) return { type: "gift", budget: extractBudget(q) };
  if (q.includes("under") || q.includes("affordable")) return { type: "budget", budget: extractBudget(q) };
  if (q.includes("best") || q.includes("compare")) return { type: "comparison" };
  return { type: "search", category: guessCategory(q) };
};

const extractBudget = (q) => {
  const match = q.match(/(\d[\d,]*)\s*(rwf|k)?/i);
  return match ? match[0] : null;
};

const guessCategory = (q) => {
  if (/shoe|sneaker|running/i.test(q)) return "Footwear";
  if (/phone|camera|laptop/i.test(q)) return "Electronics";
  if (/chair|office/i.test(q)) return "Home & Office";
  if (/gift|her|him/i.test(q)) return "Gifts";
  return "General";
};

export const MOCK_BUDGET_ADVICE = ({ budget, category, purpose }) => ({
  headline: `YEBO shopping advice for ${purpose || "your needs"}`,
  budget: budget || "Flexible",
  category: category || "Any",
  tips: [
    "Prioritize verified sellers for buyer protection",
    "Compare 2–3 options before checkout",
    "Watch for bundle deals to save up to 12%",
    "Check delivery estimates for your region",
  ],
  picks: ["Best value pick · RWF 35,000", "Premium pick · RWF 48,000", "Budget pick · RWF 22,000"],
});

export const MOCK_GIFT_RESULTS = (categoryId) => ({
  category: GIFT_CATEGORIES.find((c) => c.id === categoryId)?.label || "Gift ideas",
  message: `YEBO curated mock gifts for ${categoryId || "any occasion"}.`,
  picks: [
    { name: "Premium Gift Set", price: 35000, confidence: 91 },
    { name: "Trending Choice", price: 28000, confidence: 87 },
    { name: "Best Seller", price: 42000, confidence: 85 },
  ],
});

export const PRODUCT_INTELLIGENCE_EXTRAS = {
  considerations: [
    "Check seller ratings and return policy",
    "Compare delivery time for your region",
    "Verify size guide for fashion items",
  ],
  pros: ["Competitive pricing", "Verified seller", "Strong buyer reviews"],
  cons: ["Limited color options", "Standard delivery only"],
  confidenceExplanation:
    "YEBO assigns 87% confidence based on price competitiveness, seller trust, and category trends — mock scoring via YIP.",
  similarInterests:
    "Customers with similar interests also bought accessories and complementary items in this category.",
};

export const CART_INTELLIGENCE_EXTRAS = [
  { id: "bundle", title: "Bundle discount", description: "Add matching accessory — save 10%", savings: "10%" },
  { id: "accessories", title: "Recommended accessories", description: "Complete your purchase", savings: null },
  { id: "upgrade", title: "Upgrade option", description: "Premium variant for RWF 5,000 more", savings: null },
  { id: "alt", title: "Alternative product", description: "Similar quality, lower price", savings: "8%" },
  { id: "save", title: "Save money", description: "Apply bundle at checkout preview", savings: "12%" },
];

export const CHECKOUT_INTELLIGENCE_EXTRAS = [
  { id: "confidence", title: "Purchase confidence", value: "High — verified seller", confidence: 94 },
  { id: "shipping", title: "Shipping suggestion", value: "Standard delivery recommended", confidence: 91 },
  { id: "protection", title: "Protection suggestion", value: "Buyer protection included", confidence: 96 },
  { id: "delivery", title: "Delivery estimate", value: "2–4 business days", confidence: 88 },
  { id: "summary", title: "Buying summary", value: "Great choice for your cart items", confidence: 90 },
];

export const CUSTOMER_SHOPPING_INSIGHTS = [
  { id: "categories", title: "Favorite categories", value: "Fashion · Electronics · Home" },
  { id: "habits", title: "Shopping habits", value: "Most active on weekends" },
  { id: "spending", title: "Monthly spending", value: "Avg. RWF 45,000 / month" },
  { id: "viewed", title: "Most viewed products", value: "12 items this month" },
  { id: "explored", title: "Recently explored", value: "Running shoes · Phone cases" },
  { id: "recs", title: "YEBO recommendations", value: "6 picks match your taste" },
];

export const VENDOR_SHOPPING_INSIGHTS = [
  { id: "trending-searches", title: "Trending searches", value: "Wireless earbuds · Sneakers", metric: "Hot" },
  { id: "compare", title: "Products customers compare most", value: "Your top 2 SKUs", metric: "2 items" },
  { id: "bundled", title: "Frequently bundled", value: "Accessory + main product", metric: "Bundle" },
  { id: "interests", title: "Customer interests", value: "Fashion · Tech accessories", metric: "Trend" },
  { id: "restock", title: "Restock opportunity", value: "1 SKU trending up", metric: "+18%" },
];

export const ADMIN_SHOPPING_INTELLIGENCE = [
  { id: "searched", label: "Most searched products", value: "Sneakers · Phones · Bags" },
  { id: "brands", label: "Most requested brands", value: "—", sub: "Placeholder" },
  { id: "trends", label: "Shopping trends", value: "Electronics ↑ · Fashion steady" },
  { id: "performance", label: "Recommendation performance", value: "—", sub: "CTR mock" },
  { id: "metrics", label: "Future AI metrics", value: "—", sub: "YIP analytics" },
];

export const SHOPPING_TIPS = [
  "Compare prices across verified sellers before buying",
  "Check bundle deals in your cart for extra savings",
  "Use YEBO Gift Finder for occasion-based picks",
  "Review seller ratings and delivery estimates",
];

export const SHOPPING_HISTORY_INSIGHTS = [
  { label: "Last 7 days", value: "8 products explored" },
  { label: "Top category", value: "Fashion" },
  { label: "Avg. session", value: "4 min browsing" },
];
