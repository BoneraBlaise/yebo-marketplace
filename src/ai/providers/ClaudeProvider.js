import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";

export class ClaudeProvider extends BaseProvider {
  constructor(config = {}) {
    super("claude", config);
  }

  async chat(input, options = {}) {
    const res = await super.chat(input, options);
    return {
      ...res,
      model: this.capabilities.models?.text || "claude-3.5-sonnet-mock",
      content: mockResponse("Claude", input),
    };
  }
}

export default ClaudeProvider;
