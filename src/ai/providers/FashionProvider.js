import { BaseProvider } from "./BaseProvider";
import { mockResponse } from "./ProviderHelpers";

export class FashionProvider extends BaseProvider {
  constructor(config = {}) {
    super("fashion", config);
  }

  async chat(input, options = {}) {
    const res = await super.chat(input, options);
    return {
      ...res,
      model: this.capabilities.models?.text || "fashion-style-mock",
      content: mockResponse("Fashion AI", input),
      domain: "fashion",
    };
  }

  async generateImage(prompt, options = {}) {
    const res = await super.generateImage(prompt, options);
    return {
      ...res,
      style: options.style || "lookbook",
      domain: "fashion",
    };
  }
}

export default FashionProvider;
