import { AGENT_ID } from "./AgentTypes";

/** Agent capability metadata */
export const AGENT_CAPABILITY_MAP = {
  [AGENT_ID.SHOPPING]: ["browse", "discover", "cart"],
  [AGENT_ID.FASHION]: ["style", "outfit", "color", "size"],
  [AGENT_ID.SEARCH]: ["natural_language", "filter"],
  [AGENT_ID.RECOMMENDATION]: ["personalize", "rank", "bundle"],
  [AGENT_ID.COMPARISON]: ["compare", "evaluate"],
  [AGENT_ID.VENDOR]: ["vendor_match", "store_review"],
  [AGENT_ID.CUSTOMER_SUPPORT]: ["faq", "track_order", "returns"],
  [AGENT_ID.ADMIN]: ["platform_overview", "moderation"],
  [AGENT_ID.MARKETING]: ["campaigns", "promotions"],
  [AGENT_ID.INVENTORY]: ["stock_check", "availability"],
  [AGENT_ID.PRICING]: ["budget", "deals", "coupons"],
  [AGENT_ID.CHECKOUT]: ["checkout_flow", "payment"],
  [AGENT_ID.WISHLIST]: ["curate", "save"],
  [AGENT_ID.COMMISSION]: ["earnings", "tiers"],
  [AGENT_ID.REFERRAL]: ["share", "refer"],
  [AGENT_ID.ANALYTICS]: ["metrics", "insights"],
};

export const getAgentCapabilities = (agentId) =>
  AGENT_CAPABILITY_MAP[agentId] || [];

export default AGENT_CAPABILITY_MAP;
