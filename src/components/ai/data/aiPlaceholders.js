/** Presentation-only placeholder data — public brand: YEBO, platform: YIP. */

export const AI_WELCOME_MESSAGE =
  "Hi! I'm YEBO — your Yebone shopping companion. Ask me anything about products, styles, or deals across Africa. Powered by YIP.";

export const AI_SUGGESTED_PROMPTS = [
  "Find white sneakers under 50,000 RWF",
  "Best gifts for her under 30,000 RWF",
  "Trending fashion this week",
  "Compare similar laptops",
];

export const AI_QUICK_ACTIONS = [
  { id: "search", label: "Smart search", icon: "search" },
  { id: "tryon", label: "Virtual try-on", icon: "eye" },
  { id: "budget", label: "Budget helper", icon: "wallet" },
  { id: "style", label: "Style guide", icon: "sparkles" },
];

export const AI_CONVERSATION_HISTORY = [
  { id: "h1", title: "Sneakers under 50K", date: "Today" },
  { id: "h2", title: "Gift ideas for birthday", date: "Yesterday" },
  { id: "h3", title: "Office outfit suggestions", date: "Mar 28" },
];

export const TRENDING_SEARCHES = [
  "White sneakers under 50000 RWF",
  "Black leather bag",
  "Affordable gym equipment",
  "Samsung phone deals",
  "Ankara fashion",
];

export const SMART_SUGGESTIONS = [
  "Summer essentials in Kigali",
  "Electronics with free delivery",
  "Verified vendor picks",
  "Wholesale fashion bundles",
];

export const RECENTLY_SEARCHED = [
  "Running shoes",
  "Laptop bags",
  "Skincare sets",
];

export const NATURAL_LANGUAGE_EXAMPLES = [
  "I need white sneakers under 50000 RWF",
  "Find a black leather bag",
  "Show affordable gym equipment",
];

export const SHOPPING_ASSISTANTS = [
  { id: "budget", title: "Budget Helper", description: "Stay within budget with smart picks", tag: "Save more" },
  { id: "gift", title: "Gift Finder", description: "Perfect gifts for any occasion", tag: "Occasions" },
  { id: "size", title: "Size Guide", description: "Find your best fit instantly", tag: "Fashion" },
  { id: "style", title: "Style Guide", description: "Build complete looks effortlessly", tag: "Styling" },
  { id: "best", title: "Best Choice", description: "Top-rated products for you", tag: "Top picks" },
  { id: "trending", title: "Trending Now", description: "What's hot across Yebone", tag: "Trending" },
];

export const CART_AI_SUGGESTIONS = [
  { id: "also-buy", title: "People also buy", description: "Popular add-ons with your cart items", savings: null },
  { id: "save", title: "Save money", description: "Bundle deal — save up to 12% on similar items", savings: "12%" },
  { id: "bundle", title: "Bundle suggestion", description: "Complete your look with matching accessories", savings: null },
  { id: "alt", title: "Better alternative", description: "Similar quality at a lower price point", savings: "8%" },
];

export const CHECKOUT_AI_INSIGHTS = [
  { id: "shipping", title: "Shipping suggestion", value: "Express delivery available", confidence: 91 },
  { id: "delivery", title: "Delivery estimate", value: "2–4 business days", confidence: 88 },
  { id: "confidence", title: "Purchase confidence", value: "High — verified seller", confidence: 94 },
  { id: "protection", title: "Protection recommendation", value: "Buyer protection included", confidence: 96 },
];

export const CUSTOMER_AI_INSIGHTS = [
  { id: "recs", title: "Recommended products", value: "12 picks based on your taste", icon: "sparkles" },
  { id: "habits", title: "Shopping habits", value: "Most active on weekends", icon: "chart" },
  { id: "budget", title: "Budget analysis", value: "Avg. order RWF 45,000", icon: "wallet" },
  { id: "categories", title: "Favorite categories", value: "Fashion · Electronics · Home", icon: "tag" },
  { id: "insights", title: "Purchase insights", value: "3 items in wishlist match trends", icon: "lightbulb" },
];

export const VENDOR_AI_INSIGHTS = [
  { id: "trending", title: "Trending products", value: "Wireless earbuds +24% this week", metric: "+24%" },
  { id: "restock", title: "Restock suggestions", value: "2 SKUs running low", metric: "2 items" },
  { id: "pricing", title: "Pricing suggestions", value: "Adjust 1 product for better margin", metric: "1 tip" },
  { id: "demand", title: "Demand prediction", value: "Peak expected Friday evening", metric: "Fri PM" },
  { id: "selling", title: "Best selling time", value: "6 PM – 9 PM local time", metric: "Peak" },
];

export const ADMIN_AI_METRICS = [
  { id: "usage", label: "AI usage", value: "—", sub: "Sessions today" },
  { id: "prompts", label: "Popular prompts", value: "—", sub: "Top 5 queries" },
  { id: "searches", label: "Trending searches", value: "—", sub: "Last 7 days" },
  { id: "recs", label: "Recommendation analytics", value: "—", sub: "Click-through rate" },
];

export const ADMIN_AI_MODELS = [
  { id: "openai", name: "OpenAI", status: "Not connected" },
  { id: "gemini", name: "Google Gemini", status: "Not connected" },
  { id: "claude", name: "Anthropic Claude", status: "Not connected" },
  { id: "yip", name: "YIP Native (future)", status: "Planned" },
];

export const ADMIN_FEATURE_FLAGS = [
  { id: "ai-search", label: "AI Search", enabled: false },
  { id: "ai-recs", label: "AI Recommendations", enabled: true },
  { id: "ai-tryon", label: "Virtual Try-On", enabled: false },
  { id: "ai-assistant", label: "YEBO Assistant", enabled: true },
  { id: "ai-vendor", label: "Vendor AI Insights", enabled: false },
  { id: "ai-admin", label: "Admin AI Control", enabled: true },
];

export const PRODUCT_AI_SECTIONS = {
  similar: { title: "Similar products", count: 4 },
  alternatives: { title: "Alternative products", count: 4 },
  boughtTogether: { title: "Frequently bought together", count: 3 },
  accessories: { title: "Recommended accessories", count: 4 },
  style: { title: "Style suggestions", count: 3 },
};

export const MOCK_AI_RESPONSES = {
  default:
    "YEBO can help you discover products across Yebone. Powered by YIP — real provider integration coming soon.",
  search:
    "Based on your query, YEBO would surface matching products from verified sellers. Connect a YIP provider when ready.",
  style:
    "For a complete look, YEBO would suggest complementary accessories. Full styling AI launches through YIP soon.",
};
