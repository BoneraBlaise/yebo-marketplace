import { BaseAdapter } from "./BaseAdapter";

/** Google Gemini adapter stub — interface only. */
export class GeminiAdapter extends BaseAdapter {
  constructor() {
    super("gemini", "Google Gemini");
  }

  async connect() {
    throw new Error("Gemini adapter: not connected. Configure YIP provider when ready.");
  }

  async complete() {
    throw new Error("Gemini adapter: complete() unavailable in presentation mode.");
  }

  isAvailable() {
    return false;
  }
}

export default GeminiAdapter;
