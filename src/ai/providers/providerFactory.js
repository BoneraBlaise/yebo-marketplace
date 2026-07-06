import { MockAdapter } from "./MockAdapter";
import { OpenAIAdapter } from "./OpenAIAdapter";
import { GeminiAdapter } from "./GeminiAdapter";
import { ClaudeAdapter } from "./ClaudeAdapter";
import { LocalAdapter } from "./LocalAdapter";

const ADAPTERS = {
  mock: MockAdapter,
  openai: OpenAIAdapter,
  gemini: GeminiAdapter,
  claude: ClaudeAdapter,
  local: LocalAdapter,
};

/** Resolve provider adapter by id — never imports provider SDKs. */
export const createProviderAdapter = (providerId = "mock") => {
  const Adapter = ADAPTERS[providerId] || MockAdapter;
  return new Adapter();
};

export const listProviders = () =>
  Object.entries(ADAPTERS).map(([id, Adapter]) => ({
    id,
    label: new Adapter().label,
    available: new Adapter().isAvailable(),
  }));

export default createProviderAdapter;
