import { AGENT_ID, TASK_TYPE, AGENT_STATUS } from "./AgentTypes";
import { buildMockPlan, buildMockResponse, delay } from "./AgentHelpers";

/** Base business agent — common interface, mock only */
export class BaseBusinessAgent {
  constructor(def) {
    this.id = def.id;
    this.name = def.name;
    this.description = def.description;
    this.capabilities = def.capabilities || [];
    this.priority = def.priority ?? 50;
    this.supportedTasks = def.supportedTasks || [];
    this.supportedDomains = def.supportedDomains || [];
    this.status = AGENT_STATUS.READY;
    this._initialized = false;
    this.collaborators = def.collaborators || [];
  }

  initialize() {
    this._initialized = true;
    return { ok: true, agentId: this.id };
  }

  understand(input, taskType) {
    return { intent: taskType, input, agentId: this.id, mock: true };
  }

  plan(input, taskType) {
    return buildMockPlan(this, taskType, input);
  }

  reason(_context) {
    return { reasoning: `Mock ${this.name} reasoning — business rules applied`, mock: true };
  }

  execute(input, taskType, bridges = {}) {
    return buildMockResponse(this, taskType, input, bridges);
  }

  summarize(execution) {
    return { summary: execution.summary, confidence: execution.confidence, mock: true };
  }

  respond(execution) {
    return { message: execution.content, ...execution };
  }

  health() {
    return { status: this.status, agentId: this.id, initialized: this._initialized, mock: true };
  }

  shutdown() {
    this._initialized = false;
    return { ok: true };
  }
}

const agent = (def) => new BaseBusinessAgent(def);

/** 16 business capability agents */
export const MOCK_BUSINESS_AGENTS = [
  agent({
    id: AGENT_ID.SHOPPING,
    name: "Shopping Agent",
    description: "General shopping assistance across the marketplace",
    capabilities: ["browse", "discover", "assist"],
    priority: 90,
    supportedTasks: [TASK_TYPE.FIND_PRODUCT, TASK_TYPE.FIND_ALTERNATIVE, TASK_TYPE.IMPROVE_CART],
    supportedDomains: ["product", "marketplace", "category"],
    collaborators: [AGENT_ID.RECOMMENDATION, AGENT_ID.CHECKOUT],
  }),
  agent({
    id: AGENT_ID.FASHION,
    name: "Fashion Agent",
    description: "Style, outfit, and fashion guidance",
    capabilities: ["style", "outfit", "trends"],
    priority: 85,
    supportedTasks: [TASK_TYPE.SUGGEST_OUTFIT, TASK_TYPE.RECOMMEND_COLOR, TASK_TYPE.RECOMMEND_SIZE],
    supportedDomains: ["fashion", "product", "brand"],
    collaborators: [AGENT_ID.RECOMMENDATION],
  }),
  agent({
    id: AGENT_ID.SEARCH,
    name: "Search Agent",
    description: "Natural language product search",
    capabilities: ["search", "filter", "discover"],
    priority: 88,
    supportedTasks: [TASK_TYPE.FIND_PRODUCT, TASK_TYPE.FIND_ALTERNATIVE],
    supportedDomains: ["search", "product", "category"],
  }),
  agent({
    id: AGENT_ID.RECOMMENDATION,
    name: "Recommendation Agent",
    description: "Personalized product recommendations",
    capabilities: ["recommend", "personalize", "rank"],
    priority: 87,
    supportedTasks: [TASK_TYPE.RECOMMEND_BUNDLE, TASK_TYPE.RECOMMEND_BUDGET, TASK_TYPE.FIND_ALTERNATIVE],
    supportedDomains: ["product", "customer", "marketplace"],
    collaborators: [AGENT_ID.SHOPPING, AGENT_ID.FASHION],
  }),
  agent({
    id: AGENT_ID.COMPARISON,
    name: "Comparison Agent",
    description: "Side-by-side product comparison",
    capabilities: ["compare", "analyze", "evaluate"],
    priority: 80,
    supportedTasks: [TASK_TYPE.COMPARE_PRODUCTS],
    supportedDomains: ["product", "review"],
  }),
  agent({
    id: AGENT_ID.VENDOR,
    name: "Vendor Agent",
    description: "Vendor discovery and store insights",
    capabilities: ["vendor", "store", "seller"],
    priority: 75,
    supportedTasks: [TASK_TYPE.RECOMMEND_VENDOR, TASK_TYPE.REVIEW_STORE],
    supportedDomains: ["vendor", "marketplace"],
    collaborators: [AGENT_ID.INVENTORY, AGENT_ID.PRICING],
  }),
  agent({
    id: AGENT_ID.CUSTOMER_SUPPORT,
    name: "Customer Support Agent",
    description: "Help, FAQ, and order support",
    capabilities: ["support", "faq", "help"],
    priority: 82,
    supportedTasks: [TASK_TYPE.TRACK_ORDER, TASK_TYPE.SUGGEST_COUPON],
    supportedDomains: ["support", "faq", "shipping", "returns"],
  }),
  agent({
    id: AGENT_ID.ADMIN,
    name: "Admin Agent",
    description: "Platform administration insights",
    capabilities: ["admin", "moderate", "overview"],
    priority: 60,
    supportedTasks: [TASK_TYPE.REVIEW_STORE, TASK_TYPE.ANALYZE_INVENTORY],
    supportedDomains: ["marketplace", "policy"],
  }),
  agent({
    id: AGENT_ID.MARKETING,
    name: "Marketing Agent",
    description: "Campaigns, promotions, and insights",
    capabilities: ["marketing", "campaign", "promo"],
    priority: 70,
    supportedTasks: [TASK_TYPE.MARKETING_INSIGHT, TASK_TYPE.SUGGEST_COUPON],
    supportedDomains: ["event", "flash_sale", "marketplace"],
    collaborators: [AGENT_ID.ANALYTICS],
  }),
  agent({
    id: AGENT_ID.INVENTORY,
    name: "Inventory Agent",
    description: "Stock and availability analysis",
    capabilities: ["inventory", "stock", "availability"],
    priority: 65,
    supportedTasks: [TASK_TYPE.ANALYZE_INVENTORY, TASK_TYPE.FIND_ALTERNATIVE],
    supportedDomains: ["product", "vendor"],
    collaborators: [AGENT_ID.VENDOR, AGENT_ID.PRICING],
  }),
  agent({
    id: AGENT_ID.PRICING,
    name: "Pricing Agent",
    description: "Price optimization and budget advice",
    capabilities: ["pricing", "budget", "deals"],
    priority: 72,
    supportedTasks: [TASK_TYPE.RECOMMEND_BUDGET, TASK_TYPE.SUGGEST_COUPON],
    supportedDomains: ["product", "commission", "flash_sale"],
    collaborators: [AGENT_ID.INVENTORY],
  }),
  agent({
    id: AGENT_ID.CHECKOUT,
    name: "Checkout Agent",
    description: "Checkout flow optimization",
    capabilities: ["checkout", "payment", "order"],
    priority: 78,
    supportedTasks: [TASK_TYPE.OPTIMIZE_CHECKOUT, TASK_TYPE.SUGGEST_COUPON],
    supportedDomains: ["order", "shipping", "policy"],
    collaborators: [AGENT_ID.SHOPPING],
  }),
  agent({
    id: AGENT_ID.WISHLIST,
    name: "Wishlist Agent",
    description: "Wishlist building and curation",
    capabilities: ["wishlist", "save", "curate"],
    priority: 68,
    supportedTasks: [TASK_TYPE.BUILD_WISHLIST, TASK_TYPE.RECOMMEND_BUNDLE],
    supportedDomains: ["product", "customer"],
  }),
  agent({
    id: AGENT_ID.COMMISSION,
    name: "Commission Agent",
    description: "Commission and earnings guidance",
    capabilities: ["commission", "earnings", "tiers"],
    priority: 55,
    supportedTasks: [TASK_TYPE.MARKETING_INSIGHT],
    supportedDomains: ["commission", "referral"],
  }),
  agent({
    id: AGENT_ID.REFERRAL,
    name: "Referral Agent",
    description: "Referral program assistance",
    capabilities: ["referral", "share", "earn"],
    priority: 54,
    supportedTasks: [TASK_TYPE.MARKETING_INSIGHT],
    supportedDomains: ["referral", "commission"],
    collaborators: [AGENT_ID.COMMISSION],
  }),
  agent({
    id: AGENT_ID.ANALYTICS,
    name: "Analytics Agent",
    description: "Shopping and marketplace analytics",
    capabilities: ["analytics", "insights", "metrics"],
    priority: 58,
    supportedTasks: [TASK_TYPE.MARKETING_INSIGHT, TASK_TYPE.REVIEW_STORE],
    supportedDomains: ["marketplace", "vendor", "customer"],
    collaborators: [AGENT_ID.MARKETING],
  }),
];

export default MOCK_BUSINESS_AGENTS;
