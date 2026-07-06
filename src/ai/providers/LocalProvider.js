import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";

export class LocalProvider extends BaseProvider {
  constructor(config = {}) {
    super("local", { endpoint: config.endpoint || "http://localhost:11434", ...config });
  }

  async chat(input, options = {}) {
    const res = await super.chat(input, options);
    return {
      ...res,
      model: this.capabilities.models?.text || "llama-local-mock",
      content: mockResponse("Local LLM", input),
      endpoint: this.config.endpoint,
    };
  }
}

export default LocalProvider;
