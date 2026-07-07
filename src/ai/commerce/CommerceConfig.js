import { SUBSCRIPTION_PLAN, AI_SERVICE, AI_PREVIEW_TYPE } from "./CommerceTypes";

/** Configurable commerce defaults — Phase 8D (never hardcode in engines) */

export const defaultCreditPolicy = {
  [AI_PREVIEW_TYPE.BODY_TRYON]: 1,
  [AI_PREVIEW_TYPE.FOOT_TRYON]: 1,
  [AI_PREVIEW_TYPE.FACE_TRYON]: 1,
  [AI_PREVIEW_TYPE.WRIST_TRYON]: 1,
  [AI_PREVIEW_TYPE.NECK_TRYON]: 1,
  [AI_PREVIEW_TYPE.ROOM_PREVIEW]: 2,
  [AI_PREVIEW_TYPE.WALL_PREVIEW]: 2,
  [AI_PREVIEW_TYPE.WINDOW_PREVIEW]: 2,
  [AI_PREVIEW_TYPE.FLOOR_PREVIEW]: 2,
  [AI_SERVICE.PREVIEW]: 1,
  [AI_SERVICE.DESCRIPTION]: 0.2,
  [AI_SERVICE.TRANSLATION]: 0.1,
  [AI_SERVICE.BACKGROUND_REMOVAL]: 0.5,
  [AI_SERVICE.PRODUCT_VIDEO]: 8,
  [AI_SERVICE.SEARCH]: 0.1,
  [AI_SERVICE.CUSTOMER_SUPPORT]: 0.3,
  [AI_SERVICE.RECOMMENDATIONS]: 0.2,
  [AI_SERVICE.ANALYTICS]: 0.5,
};

export const defaultSubscriptionPlans = {
  [SUBSCRIPTION_PLAN.STARTER]: {
    id: SUBSCRIPTION_PLAN.STARTER,
    label: "Starter",
    monthlyCredits: 100,
    capabilities: [AI_SERVICE.PREVIEW, AI_SERVICE.DESCRIPTION, AI_SERVICE.TRANSLATION],
    limits: { previewsPerDay: 20, descriptionsPerDay: 50 },
    upgradePath: SUBSCRIPTION_PLAN.BUSINESS,
  },
  [SUBSCRIPTION_PLAN.BUSINESS]: {
    id: SUBSCRIPTION_PLAN.BUSINESS,
    label: "Business",
    monthlyCredits: 500,
    capabilities: [
      AI_SERVICE.PREVIEW,
      AI_SERVICE.DESCRIPTION,
      AI_SERVICE.TRANSLATION,
      AI_SERVICE.ANALYTICS,
      AI_SERVICE.RECOMMENDATIONS,
    ],
    limits: { previewsPerDay: 100, descriptionsPerDay: 200 },
    upgradePath: SUBSCRIPTION_PLAN.ENTERPRISE,
  },
  [SUBSCRIPTION_PLAN.ENTERPRISE]: {
    id: SUBSCRIPTION_PLAN.ENTERPRISE,
    label: "Enterprise",
    monthlyCredits: 2000,
    capabilities: Object.values(AI_SERVICE),
    limits: { previewsPerDay: -1, descriptionsPerDay: -1 },
    upgradePath: null,
  },
};

export const defaultCommerceConfig = {
  creditPolicy: defaultCreditPolicy,
  subscriptionPlans: defaultSubscriptionPlans,
  defaultPlan: SUBSCRIPTION_PLAN.STARTER,
  billingCycleDays: 30,
  previewCacheTtlMs: 24 * 60 * 60 * 1000,
  providerSelection: {
    defaultProviderId: null,
    serviceProviderMap: {},
  },
};

export const mergeCommerceConfig = (overrides = {}) => ({
  ...defaultCommerceConfig,
  ...overrides,
  creditPolicy: { ...defaultCommerceConfig.creditPolicy, ...(overrides.creditPolicy || {}) },
  subscriptionPlans: {
    ...defaultCommerceConfig.subscriptionPlans,
    ...(overrides.subscriptionPlans || {}),
  },
  providerSelection: {
    ...defaultCommerceConfig.providerSelection,
    ...(overrides.providerSelection || {}),
  },
});

export default defaultCommerceConfig;
