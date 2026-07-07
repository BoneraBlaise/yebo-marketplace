/** YEBO AI Experience Platform — Phase 8H.5 */

/* Platform */
export { AIExperiencePlatform, AIExperiencePageShell } from "./components/AIExperiencePlatform";
export { default as AIExperiencePage } from "./pages/AIExperiencePage";
export { AIExperienceRoutes } from "./routes/AIExperienceRoutes";

/* Preview */
export { PreviewExperience } from "./components/preview/PreviewExperience";
export { PreviewLifecycle } from "./components/preview/PreviewLifecycle";

/* Jobs */
export { PreviewJobsPanel } from "./components/jobs/PreviewJobsPanel";

/* Assets */
export { AssetManager } from "./components/assets/AssetManager";

/* History */
export { AIHistoryPanel } from "./components/history/AIHistoryPanel";

/* Credits */
export { AICreditsExperience } from "./components/credits/AICreditsExperience";

/* Recommendations */
export { AIRecommendationsPanel } from "./components/recommendations/AIRecommendationsPanel";

/* Status & Recovery */
export { AIStatusBadge, YEBOAIBrand, AIStatusIndicator } from "./components/status/AIStatusComponents";
export { ErrorRecovery, ErrorRecoveryShowcase } from "./components/recovery/ErrorRecovery";

/* Hook & utilities */
export { useAIExperiencePlatform } from "./hooks/useAIExperiencePlatform";
export { PREVIEW_LIFECYCLE, mapStatusToLifecycleIndex } from "./constants/previewLifecycle";
export { AI_STATUS, AI_STATUS_LABELS } from "./constants/aiStatus";
export { YEBO_AI_BRAND, sanitizeForCustomer, sanitizeAsset, sanitizeJob } from "./utils/providerTransparency";

/* Diagnostics */
export { logAIExperienceDiagnostics } from "./diagnostics/AIExperienceDiagnostics";
