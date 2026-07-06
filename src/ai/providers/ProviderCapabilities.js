import { MODEL_CATEGORY } from "./ProviderTypes";

/** SDK capability profiles per provider */
export const SDK_CAPABILITY_PROFILES = {
  gemini: {
    label: "Google Gemini",
    models: {
      [MODEL_CATEGORY.TEXT]: "gemini-2.0-flash-mock",
      [MODEL_CATEGORY.VISION]: "gemini-vision-mock",
      [MODEL_CATEGORY.EMBEDDING]: "gemini-embedding-mock",
      [MODEL_CATEGORY.IMAGE]: null,
      [MODEL_CATEGORY.AUDIO]: null,
    },
    supportsStreaming: true,
    supportsVision: true,
    supportsEmbeddings: true,
    supportsImageGeneration: false,
  },
  openai: {
    label: "OpenAI",
    models: {
      [MODEL_CATEGORY.TEXT]: "gpt-4o-mock",
      [MODEL_CATEGORY.VISION]: "gpt-4o-vision-mock",
      [MODEL_CATEGORY.EMBEDDING]: "text-embedding-mock",
      [MODEL_CATEGORY.IMAGE]: "dall-e-mock",
      [MODEL_CATEGORY.AUDIO]: "whisper-mock",
    },
    supportsStreaming: true,
    supportsVision: true,
    supportsEmbeddings: true,
    supportsImageGeneration: true,
  },
  claude: {
    label: "Anthropic Claude",
    models: {
      [MODEL_CATEGORY.TEXT]: "claude-3.5-sonnet-mock",
      [MODEL_CATEGORY.VISION]: "claude-vision-mock",
      [MODEL_CATEGORY.EMBEDDING]: null,
      [MODEL_CATEGORY.IMAGE]: null,
      [MODEL_CATEGORY.AUDIO]: null,
    },
    supportsStreaming: true,
    supportsVision: true,
    supportsEmbeddings: false,
    supportsImageGeneration: false,
  },
  fashion: {
    label: "Fashion AI",
    models: {
      [MODEL_CATEGORY.TEXT]: "fashion-style-mock",
      [MODEL_CATEGORY.IMAGE]: "fashion-lookbook-mock",
      [MODEL_CATEGORY.VISION]: "fashion-vision-mock",
      [MODEL_CATEGORY.EMBEDDING]: null,
      [MODEL_CATEGORY.AUDIO]: null,
    },
    supportsStreaming: true,
    supportsVision: true,
    supportsEmbeddings: false,
    supportsImageGeneration: true,
  },
  local: {
    label: "Local LLM",
    models: {
      [MODEL_CATEGORY.TEXT]: "llama-local-mock",
      [MODEL_CATEGORY.EMBEDDING]: "local-embed-mock",
      [MODEL_CATEGORY.VISION]: null,
      [MODEL_CATEGORY.IMAGE]: null,
      [MODEL_CATEGORY.AUDIO]: null,
    },
    supportsStreaming: true,
    supportsVision: false,
    supportsEmbeddings: true,
    supportsImageGeneration: false,
  },
  mock: {
    label: "Mock Provider",
    models: {
      [MODEL_CATEGORY.TEXT]: "mock-text-v1",
      [MODEL_CATEGORY.IMAGE]: "mock-image-v1",
      [MODEL_CATEGORY.EMBEDDING]: "mock-embed-v1",
      [MODEL_CATEGORY.VISION]: "mock-vision-v1",
      [MODEL_CATEGORY.AUDIO]: "mock-audio-v1",
    },
    supportsStreaming: true,
    supportsVision: true,
    supportsEmbeddings: true,
    supportsImageGeneration: true,
  },
};

export const getSDKCapabilities = (providerId) =>
  SDK_CAPABILITY_PROFILES[providerId] || SDK_CAPABILITY_PROFILES.mock;

export default SDK_CAPABILITY_PROFILES;
