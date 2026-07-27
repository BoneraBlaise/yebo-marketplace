/** YEBO AI capabilities — shown via composer (+) attachment menu, not permanent grid */
export const YEBO_CAPABILITIES = [
  { id: "search", icon: "✨", title: "Smart Search", desc: "Find products instantly", mode: "search" },
  { id: "visual", icon: "📷", title: "Visual Search", desc: "Search with photos", mode: "visual" },
  { id: "tryon", icon: "👕", title: "Virtual Try-On", desc: "Preview before you buy", mode: "visual" },
  { id: "compare", icon: "⚖", title: "Compare Products", desc: "Side-by-side picks", mode: "compare" },
  { id: "budget", icon: "💰", title: "Budget Assistant", desc: "Shop within your range", mode: "budget" },
  { id: "property", icon: "🏠", title: "Property Assistant", desc: "Homes, land & rentals", action: "property" },
  { id: "vehicle", icon: "🚗", title: "Vehicle Finder", desc: "Cars & mobility", mode: "search" },
];

export const YEBO_WELCOME_MESSAGE = `Welcome to YEBO

Your AI shopping assistant for Africa.

Search products, compare offers, discover better deals, and preview items before you buy.

Ask me anything to get started.`;

export default YEBO_CAPABILITIES;
