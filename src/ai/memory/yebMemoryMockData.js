/** Mock session memory seed data — presentation only (Phase 7D). */

export const MOCK_VISITED_PRODUCTS = [
  { id: "p1", name: "Nike Air Zoom Pegasus", category: "Running Shoes", price: 89000, viewedAt: Date.now() - 3600000 },
  { id: "p2", name: "Samsung Galaxy A54", category: "Electronics", price: 420000, viewedAt: Date.now() - 7200000 },
  { id: "p3", name: "Ergonomic Office Chair", category: "Furniture", price: 185000, viewedAt: Date.now() - 86400000 },
  { id: "p4", name: "Leather Crossbody Bag", category: "Fashion", price: 65000, viewedAt: Date.now() - 172800000 },
];

export const MOCK_VIEWED_CATEGORIES = [
  { id: "running", label: "Running Shoes", count: 5 },
  { id: "electronics", label: "Electronics", count: 3 },
  { id: "furniture", label: "Office Furniture", count: 2 },
  { id: "fashion", label: "Fashion", count: 4 },
];

export const MOCK_RECENT_SEARCHES = [
  "white sneakers under 50000 RWF",
  "best running shoes",
  "affordable phone camera",
  "office chair black",
  "gift for girlfriend",
];

export const MOCK_COMPARED_PRODUCTS = [
  { id: "cmp1", names: ["Nike Pegasus", "Adidas Ultraboost"], comparedAt: Date.now() - 5400000 },
  { id: "cmp2", names: ["Galaxy A54", "iPhone SE"], comparedAt: Date.now() - 86400000 },
];

export const MOCK_RECENT_VENDORS = [
  { id: "v1", name: "Kigali Sports Hub", category: "Sports", visitedAt: Date.now() - 3600000 },
  { id: "v2", name: "TechZone Rwanda", category: "Electronics", visitedAt: Date.now() - 7200000 },
];

export const MOCK_SHOPPING_GOAL = {
  id: "goal1",
  label: "Find running shoes under 100,000 RWF",
  progress: 65,
  startedAt: Date.now() - 86400000,
};

export const MOCK_CONVERSATION_STATE = {
  lastIntent: "product_comparison",
  lastTopic: "running shoes",
  turnCount: 4,
  summary: "User exploring athletic footwear with budget constraints.",
};

export const MOCK_PREFERENCES = {
  favoriteCategories: ["Running Shoes", "Electronics", "Fashion"],
  favoriteBrands: ["Nike", "Samsung", "Apple"],
  favoriteColors: ["Black", "White", "Navy"],
  favoriteSizes: ["42", "M", "L"],
  budgetRange: { min: 20000, max: 150000, currency: "RWF" },
  shoppingInterests: ["Fitness", "Tech gadgets", "Home office"],
  language: "en",
  country: "RW",
  currency: "RWF",
};

export const MOCK_SMART_REMINDERS = [
  { id: "continue-shopping", type: "continue", title: "Continue Shopping", message: "Pick up where you left off with running shoes.", action: "Continue", priority: 1 },
  { id: "previously-viewed", type: "viewed", title: "Previously Viewed", message: "Nike Air Zoom Pegasus — still trending this week.", action: "View again", priority: 2 },
  { id: "recently-compared", type: "compare", title: "Recently Compared", message: "Nike Pegasus vs Adidas Ultraboost — need help deciding?", action: "Compare again", priority: 3 },
  { id: "still-available", type: "available", title: "Still Available", message: "Samsung Galaxy A54 is in stock at TechZone Rwanda.", action: "Check product", priority: 4 },
  { id: "price-dropped", type: "price", title: "Price Dropped", message: "Office chair you viewed is now 15% off.", action: "See deal", priority: 5 },
  { id: "low-stock", type: "stock", title: "Low Stock Reminder", message: "Leather bag — only 3 left in your size.", action: "Buy now", priority: 6 },
];

export const MOCK_SHOPPING_TIMELINE = [
  { id: "t1", label: "Viewed Nike Pegasus", time: "1h ago", icon: "eye" },
  { id: "t2", label: "Compared running shoes", time: "2h ago", icon: "compare" },
  { id: "t3", label: "Searched white sneakers", time: "3h ago", icon: "search" },
  { id: "t4", label: "Opened TechZone vendor", time: "5h ago", icon: "store" },
  { id: "t5", label: "Asked YEBO about gifts", time: "Yesterday", icon: "chat" },
];

export const MOCK_SHOPPING_JOURNEY = [
  { step: 1, title: "Discover", description: "Browsed running shoes on homepage", status: "complete" },
  { step: 2, title: "Compare", description: "Compared Nike vs Adidas models", status: "complete" },
  { step: 3, title: "Shortlist", description: "Saved 2 items to wishlist", status: "active" },
  { step: 4, title: "Decide", description: "YEBO budget advice pending", status: "upcoming" },
];

export const MOCK_SAVED_INTERESTS = [
  { id: "i1", label: "Marathon training gear", confidence: 88 },
  { id: "i2", label: "Home office setup", confidence: 74 },
  { id: "i3", label: "Smartphone upgrades", confidence: 91 },
];

export const MOCK_RECOMMENDATION_HISTORY = [
  { id: "r1", product: "Nike Pegasus", reason: "Matches your running interest", at: "2h ago" },
  { id: "r2", product: "Wireless earbuds", reason: "Frequently bought with phones", at: "Yesterday" },
];

export const MOCK_CROSS_PAGE_MESSAGES = [
  { id: "welcome", message: "Welcome back — YEBO remembers your running shoe search.", action: "Continue" },
  { id: "viewed", message: "You recently viewed Nike Air Zoom Pegasus and Samsung Galaxy A54.", action: "See history" },
  { id: "compared", message: "You compared Nike Pegasus vs Adidas Ultraboost.", action: "Compare again" },
  { id: "continue", message: "Continue shopping for athletic footwear under 100,000 RWF.", action: "Resume" },
  { id: "also-like", message: "You may also like wireless earbuds and running socks.", action: "Explore" },
];

export const MOCK_CUSTOMER_MEMORY = {
  summary: "Active shopper · 4 sessions this week",
  favoriteInterests: MOCK_SAVED_INTERESTS,
  journey: MOCK_SHOPPING_JOURNEY,
  wishlistHistory: ["Nike Pegasus", "Galaxy A54", "Office Chair"],
  monthlySpending: "RWF 245,000 (mock)",
};

export const MOCK_VENDOR_MEMORY = {
  recentInterests: ["Running shoes", "Phone accessories", "Office chairs"],
  popularProducts: ["Nike Pegasus", "Galaxy A54", "USB-C Hub"],
  frequentlyCompared: ["Pegasus vs Ultraboost", "A54 vs iPhone SE"],
  restockHint: "Wireless earbuds — high demand this week",
};

export const MOCK_ADMIN_MEMORY = {
  trendingInterests: ["Running shoes", "Smartphones", "Gift sets"],
  popularSearches: ["white sneakers", "affordable phone", "office chair"],
  platformTrend: "+18% athletic footwear searches this week",
  recommendationPerformance: "87% mock confidence score",
  futureMetrics: ["Intent detection", "Cross-sell accuracy", "Session recall rate"],
};

export const MOCK_CONVERSATION_MEMORY = [
  { id: "q1", role: "user", content: "Best running shoes under 100k?", intent: "product_search", at: Date.now() - 7200000 },
  { id: "a1", role: "assistant", content: "Nike Pegasus and Adidas Ultraboost fit your budget.", intent: "recommendation", at: Date.now() - 7190000 },
  { id: "q2", role: "user", content: "Compare them for me", intent: "comparison", at: Date.now() - 5400000 },
  { id: "a2", role: "assistant", content: "Pegasus offers better value; Ultraboost has premium cushioning.", intent: "comparison_result", at: Date.now() - 5390000 },
];

export default {
  MOCK_VISITED_PRODUCTS,
  MOCK_VIEWED_CATEGORIES,
  MOCK_RECENT_SEARCHES,
  MOCK_COMPARED_PRODUCTS,
  MOCK_RECENT_VENDORS,
  MOCK_SHOPPING_GOAL,
  MOCK_CONVERSATION_STATE,
  MOCK_PREFERENCES,
  MOCK_SMART_REMINDERS,
  MOCK_SHOPPING_TIMELINE,
  MOCK_SHOPPING_JOURNEY,
  MOCK_SAVED_INTERESTS,
  MOCK_RECOMMENDATION_HISTORY,
  MOCK_CROSS_PAGE_MESSAGES,
  MOCK_CUSTOMER_MEMORY,
  MOCK_VENDOR_MEMORY,
  MOCK_ADMIN_MEMORY,
  MOCK_CONVERSATION_MEMORY,
};
