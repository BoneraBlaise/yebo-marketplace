import { PROVIDER_ID } from "./ProviderTypes";

/** Default provider priority ordering (higher = preferred) */
export const DEFAULT_PROVIDER_PRIORITY = {
  [PROVIDER_ID.OPENAI]: 90,
  [PROVIDER_ID.CLAUDE]: 85,
  [PROVIDER_ID.GEMINI]: 80,
  [PROVIDER_ID.LOCAL]: 60,
  [PROVIDER_ID.CUSTOM]: 40,
  [PROVIDER_ID.MOCK]: 10,
};

export const FALLBACK_CHAIN = [
  PROVIDER_ID.OPENAI,
  PROVIDER_ID.GEMINI,
  PROVIDER_ID.CLAUDE,
  PROVIDER_ID.LOCAL,
  PROVIDER_ID.MOCK,
];

export const getPriority = (providerId) => DEFAULT_PROVIDER_PRIORITY[providerId] ?? 0;

export const sortProvidersByPriority = (providers) =>
  [...providers].sort((a, b) => getPriority(b.id) - getPriority(a.id));

export default { DEFAULT_PROVIDER_PRIORITY, FALLBACK_CHAIN, getPriority };
