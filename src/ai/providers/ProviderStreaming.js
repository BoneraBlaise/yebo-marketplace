import { STREAM_STATE } from "./ProviderTypes";
import { StreamingError } from "./ProviderErrors";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";

/** Reusable mock streaming controller */
export class ProviderStream {
  constructor(providerId, content = "") {
    this.providerId = providerId;
    this.content = content;
    this.state = STREAM_STATE.IDLE;
    this.chunks = [];
    this._cancelled = false;
    this._timer = null;
  }

  start() {
    this.state = STREAM_STATE.STARTING;
    this._cancelled = false;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_START, {
      providerId: this.providerId,
    });
    this.state = STREAM_STATE.STREAMING;
    return { streamId: `stream-${Date.now()}`, state: this.state };
  }

  async *next() {
    const words = this.content.split(" ");
    for (let i = 0; i < words.length; i += 1) {
      if (this._cancelled) {
        this.state = STREAM_STATE.CANCELLED;
        throw new StreamingError("Stream cancelled");
      }
      await new Promise((r) => {
        this._timer = setTimeout(r, 30);
      });
      const chunk = `${words[i]}${i < words.length - 1 ? " " : ""}`;
      this.chunks.push(chunk);
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_CHUNK, {
        providerId: this.providerId,
        chunk,
        index: i,
      });
      yield { chunk, index: i, done: false };
    }
    yield { chunk: "", index: words.length, done: true };
  }

  complete() {
    this.state = STREAM_STATE.COMPLETED;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_COMPLETE, {
      providerId: this.providerId,
      chunks: this.chunks,
    });
    return {
      content: this.chunks.join(""),
      chunkCount: this.chunks.length,
      state: this.state,
    };
  }

  cancel() {
    this._cancelled = true;
    if (this._timer) clearTimeout(this._timer);
    this.state = STREAM_STATE.CANCELLED;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_CANCEL, {
      providerId: this.providerId,
    });
    return { cancelled: true, state: this.state };
  }
}

export const createStream = (providerId, content) =>
  new ProviderStream(providerId, content);

export default { ProviderStream, createStream };
