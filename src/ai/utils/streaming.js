import { YIPEvents, YIP_EVENT } from "../core/YIPEvents";

/**
 * Simulated streaming helper — yields partial text without backend.
 * @param {AsyncGenerator<string>} generator
 * @param {(chunk: string, accumulated: string) => void} onChunk
 */
export const consumeStream = async (generator, onChunk) => {
  let accumulated = "";
  YIPEvents.emit(YIP_EVENT.STREAM_START, {});
  for await (const chunk of generator) {
    accumulated += chunk;
    onChunk(chunk, accumulated);
    YIPEvents.emit(YIP_EVENT.STREAM_CHUNK, { chunk, accumulated });
  }
  YIPEvents.emit(YIP_EVENT.STREAM_END, { content: accumulated });
  return accumulated;
};

export const createStreamingState = () => ({
  isStreaming: false,
  partialResponse: "",
});

export default consumeStream;
