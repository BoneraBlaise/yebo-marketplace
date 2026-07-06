import { BaseAdapter } from "./BaseAdapter";

/** Anthropic Claude adapter stub — interface only. */
export class ClaudeAdapter extends BaseAdapter {
  constructor() {
    super("claude", "Anthropic Claude");
  }

  async connect() {
    throw new Error("Claude adapter: not connected. Configure YIP provider when ready.");
  }

  async complete() {
    throw new Error("Claude adapter: complete() unavailable in presentation mode.");
  }

  isAvailable() {
    return false;
  }
}

export default ClaudeAdapter;
