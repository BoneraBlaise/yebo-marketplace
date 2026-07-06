/** Re-export YIP platform from src/ai */
export {
  YIPProvider,
  useYIP,
  useYIPOptional,
  YIPConfig,
  YIP_PUBLIC_NAME,
  YIP_PLATFORM_NAME,
} from "../../ai";

/** Backward-compatible UI bridge (AIProvider = YIPProvider) */
export { AIProvider, useAI, useAIOptional } from "./core/AIContext";

/* Legacy placeholders */
export { default as AISearch } from "./AISearch";
export { default as AITryOn } from "./AITryOn";
export { default as AIRecommendations } from "./AIRecommendations";
export { default as AIStyling } from "./AIStyling";

/* Global entry */
export { default as GlobalAIFab } from "./GlobalAIFab";
export { default as AIPanel } from "./AIPanel";

/* Primitives */
export { default as AICard } from "./primitives/AICard";
export { default as AISection } from "./primitives/AISection";
export { default as AILoading } from "./primitives/AILoading";
export { default as AIEmptyState } from "./primitives/AIEmptyState";
export { default as AIResponseCard, AIInsightResponseCard } from "./primitives/AIResponseCard";
export { default as AIConversation } from "./primitives/AIConversation";
export { default as AIActionButton } from "./primitives/AIActionButton";
export { default as AIInsightCard } from "./primitives/AIInsightCard";

/* Page sections */
export { default as HomeAIDiscovery } from "./sections/HomeAIDiscovery";
export { default as AISearchNatural } from "./sections/AISearchNatural";
export { default as AIShoppingAssistants } from "./sections/AIShoppingAssistants";
export { default as AIVirtualTryOn } from "./sections/AIVirtualTryOn";
export { default as CartAISuggestions } from "./sections/CartAISuggestions";
export { default as CheckoutAIConfidence } from "./sections/CheckoutAIConfidence";
export { default as CustomerAIInsights } from "./sections/CustomerAIInsights";
export { default as VendorAIInsights } from "./sections/VendorAIInsights";
export { default as AdminAIControlCenter } from "./sections/AdminAIControlCenter";

/* YEBO Shopping Intelligence (Phase 7C) */
export {
  YEBOPanelModes,
  YEBOPanelIntelligence,
  YEBOSmartSearchResults,
  YEBOProductComparison,
  YEBOProactiveBanner,
  YEBOBudgetAssistant,
  YEBOGiftFinder,
  YEBOShoppingInsightCards,
  YEBOProductIntelligenceExtras,
  YEBOCartIntelligence,
  YEBOCheckoutIntelligence,
  YEBOCustomerShoppingInsights,
  YEBOVendorShoppingInsights,
  YEBOAdminShoppingIntelligence,
  YEBOIntelligenceHint,
} from "./intelligence";

/* YEBO Memory Engine (Phase 7D) */
export {
  YEBOWelcomeBack,
  YEBOContinueShopping,
  YEBOSmartReminders,
  YEBOMemoryTimeline,
  YEBOMemoryJourney,
  YEBOPreferenceCards,
  YEBOShoppingHistory,
  YEBOCrossPageContinuity,
  YEBOMemoryCards,
  YEBOCustomerMemoryDashboard,
  YEBOVendorMemoryDashboard,
  YEBOAdminMemoryDashboard,
} from "./memory";

/* YEBO Decision Engine (Phase 7E) */
export { YEBODecisionHint } from "./decision";

/* YEBO AI Orchestration (Phase 7G) */
export { YEBOProviderStatus } from "./orchestration";
