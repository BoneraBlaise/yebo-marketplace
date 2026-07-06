/**
 * Base provider adapter interface.
 * All adapters are presentation-only stubs — no external API calls.
 */
export class BaseAdapter {
  constructor(id, label) {
    this.id = id;
    this.label = label;
    this.connected = false;
  }

  /** @returns {Promise<boolean>} */
  async connect(_config) {
    throw new Error(`${this.label}: connect() not implemented`);
  }

  async disconnect() {
    this.connected = false;
  }

  /** @returns {Promise<import('../types').YIPAdapterResponse>} */
  async complete(_input, _options) {
    throw new Error(`${this.label}: complete() not implemented`);
  }

  /**
   * Streaming interface — yields partial chunks.
   * @returns {AsyncGenerator<string>}
   */
  async *stream(_input, _options) {
    yield "";
    throw new Error(`${this.label}: stream() not implemented`);
  }

  isAvailable() {
    return false;
  }
}

export default BaseAdapter;
