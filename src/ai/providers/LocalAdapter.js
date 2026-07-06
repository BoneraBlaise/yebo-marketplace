import { BaseAdapter } from "./BaseAdapter";

/** Local/on-device adapter stub — interface only. */
export class LocalAdapter extends BaseAdapter {
  constructor() {
    super("local", "Local Model");
  }

  async connect() {
    throw new Error("Local adapter: not configured. Wire on-device runtime through YIP.");
  }

  async complete() {
    throw new Error("Local adapter: complete() unavailable in presentation mode.");
  }

  isAvailable() {
    return false;
  }
}

export default LocalAdapter;
