import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";

export class GeminiProvider extends BaseProvider {
  constructor(config = {}) {
    super("gemini", config);
  }

  async chat(input, options = {}) {
    const res = await super.chat(input, options);
    return {
      ...res,
      model: this.capabilities.models?.text || "gemini-2.0-flash-mock",
      content: mockResponse("Gemini", input),
    };
  }
}

export default GeminiProvider;
