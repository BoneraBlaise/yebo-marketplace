import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";

export class OpenAIProvider extends BaseProvider {
  constructor(config = {}) {
    super("openai", config);
  }

  async chat(input, options = {}) {
    const res = await super.chat(input, options);
    return {
      ...res,
      model: this.capabilities.models?.text || "gpt-4o-mock",
      content: mockResponse("OpenAI", input),
    };
  }
}

export default OpenAIProvider;
