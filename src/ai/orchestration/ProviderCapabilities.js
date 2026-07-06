/** Capability profiles per provider — mock metadata only */

export const BASE_CAPABILITIES = {
  supportsVision: false,
  supportsStreaming: true,
  supportsEmbeddings: true,
  supportsFunctionCalling: false,
  supportsReasoning: false,
  supportsImages: false,
  supportsFiles: false,
};

export const PROVIDER_CAPABILITY_PROFILES = {
  openai: {
    ...BASE_CAPABILITIES,
    supportsVision: true,
    supportsFunctionCalling: true,
    supportsReasoning: true,
    supportsImages: true,
    supportsFiles: true,
    label: "GPT-class multimodal",
  },
  gemini: {
    ...BASE_CAPABILITIES,
    supportsVision: true,
    supportsFunctionCalling: true,
    supportsImages: true,
    label: "Google multimodal",
  },
  claude: {
    ...BASE_CAPABILITIES,
    supportsVision: true,
    supportsReasoning: true,
    supportsFiles: true,
    label: "Anthropic reasoning",
  },
  local: {
    ...BASE_CAPABILITIES,
    supportsStreaming: true,
    label: "On-device inference",
  },
  custom: {
    ...BASE_CAPABILITIES,
    supportsFunctionCalling: true,
    label: "Future custom provider",
  },
  mock: {
    ...BASE_CAPABILITIES,
    supportsStreaming: true,
    label: "Mock preview",
  },
};

export const getCapabilityProfile = (providerId) =>
  PROVIDER_CAPABILITY_PROFILES[providerId] || PROVIDER_CAPABILITY_PROFILES.mock;

export default PROVIDER_CAPABILITY_PROFILES;
