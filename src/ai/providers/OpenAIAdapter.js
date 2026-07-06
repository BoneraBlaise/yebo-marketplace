import { BaseAdapter } from "./BaseAdapter";

/** OpenAI adapter stub — interface only, no SDK, no API calls. */
export class OpenAIAdapter extends BaseAdapter {
  constructor() {
    super("openai", "OpenAI");
  }

  async connect() {
    throw new Error("OpenAI adapter: not connected. Configure YIP provider when ready.");
  }

  async complete() {
    throw new Error("OpenAI adapter: complete() unavailable in presentation mode.");
  }

  isAvailable() {
    return false;
  }
}

export default OpenAIAdapter;
