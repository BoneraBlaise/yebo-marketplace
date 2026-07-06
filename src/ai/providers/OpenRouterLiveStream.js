import { STREAM_STATE } from "./ProviderTypes";
import { StreamingError } from "./ProviderErrors";
import { sdkProviderEvents, SDK_PROVIDER_EVENT } from "./ProviderEvents";

/** Live OpenRouter stream controller — ProviderStream-compatible interface */
export class OpenRouterLiveStream {
  constructor(providerId, createGenerator) {
    this.providerId = providerId;
    this.createGenerator = createGenerator;
    this.state = STREAM_STATE.IDLE;
    this.chunks = [];
    this.content = "";
    this._cancelled = false;
    this._generator = null;
    this._abort = null;
  }

  start() {
    this.state = STREAM_STATE.STARTING;
    this._cancelled = false;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_START, {
      providerId: this.providerId,
      live: true,
    });
    this.state = STREAM_STATE.STREAMING;
    return { streamId: `openrouter-live-${Date.now()}`, state: this.state, live: true };
  }

  async *next() {
    if (!this._generator) {
      const created = this.createGenerator();
      this._generator = created.generator;
      this._abort = created.abort;
    }

    let index = 0;
    try {
      for await (const chunk of this._generator) {
        if (this._cancelled) {
          this.state = STREAM_STATE.CANCELLED;
          throw new StreamingError("Stream cancelled");
        }
        if (!chunk) continue;
        this.chunks.push(chunk);
        this.content += chunk;
        sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_CHUNK, {
          providerId: this.providerId,
          chunk,
          index,
          live: true,
        });
        yield { chunk, index, done: false };
        index += 1;
      }
      yield { chunk: "", index, done: true };
    } catch (err) {
      this.state = STREAM_STATE.ERROR;
      sdkProviderEvents.emit(SDK_PROVIDER_EVENT.ERROR, {
        providerId: this.providerId,
        error: err.message,
        live: true,
      });
      throw err;
    }
  }

  complete() {
    this.state = STREAM_STATE.COMPLETED;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_COMPLETE, {
      providerId: this.providerId,
      chunks: this.chunks,
      content: this.content,
      live: true,
    });
    return {
      content: this.content,
      chunkCount: this.chunks.length,
      state: this.state,
      live: true,
    };
  }

  cancel() {
    this._cancelled = true;
    this._abort?.();
    this.state = STREAM_STATE.CANCELLED;
    sdkProviderEvents.emit(SDK_PROVIDER_EVENT.STREAM_CANCEL, {
      providerId: this.providerId,
      live: true,
    });
    return { cancelled: true, state: this.state };
  }
}

export const createOpenRouterLiveStream = (providerId, createGenerator) =>
  new OpenRouterLiveStream(providerId, createGenerator);

export default { OpenRouterLiveStream, createOpenRouterLiveStream };
