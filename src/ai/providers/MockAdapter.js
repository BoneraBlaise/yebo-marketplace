import { BaseAdapter } from "./BaseAdapter";

const delay = (ms = 800) => new Promise((r) => setTimeout(r, ms));

const MOCK_RESPONSES = {
  default:
    "I can help you discover products from verified sellers across Yebone. Try asking for a category, brand, or budget.",
  search:
    "I'll surface matching products from verified sellers. Try being specific — for example, \"wireless earbuds under RWF 50,000\".",
  style:
    "For a complete look, tell me the occasion or items you already have — I'll suggest complementary pieces from trusted sellers.",
};

export class MockAdapter extends BaseAdapter {
  constructor() {
    super("mock", "Mock Adapter");
    this.connected = true;
  }

  async connect() {
    this.connected = true;
    return true;
  }

  async complete(input) {
    await delay(900 + Math.random() * 400);
    const lower = (input || "").toLowerCase();
    let content = MOCK_RESPONSES.default;
    if (lower.includes("search") || lower.includes("find") || lower.includes("need")) {
      content = MOCK_RESPONSES.search;
    } else if (lower.includes("style") || lower.includes("outfit")) {
      content = MOCK_RESPONSES.style;
    }
    return { content, placeholder: true, metadata: { provider: "mock" } };
  }

  async *stream(input) {
    const { content } = await this.complete(input);
    const words = content.split(" ");
    for (const word of words) {
      await delay(80);
      yield `${word} `;
    }
  }

  isAvailable() {
    return true;
  }

  getSuggestedPrompts() {
    return [
      "Find white sneakers under 50,000 RWF",
      "Best gifts for her under 30,000 RWF",
      "Trending fashion this week",
      "Compare similar laptops",
    ];
  }

  getQuickActions() {
    return [
      { id: "search", label: "Smart search", icon: "search" },
      { id: "tryon", label: "Virtual try-on", icon: "eye" },
      { id: "budget", label: "Budget helper", icon: "wallet" },
      { id: "style", label: "Style guide", icon: "sparkles" },
    ];
  }

  getConversationHistory() {
    return [
      { id: "h1", title: "Sneakers under 50K", date: "Today" },
      { id: "h2", title: "Gift ideas for birthday", date: "Yesterday" },
      { id: "h3", title: "Office outfit suggestions", date: "Mar 28" },
    ];
  }
}

export default MockAdapter;
