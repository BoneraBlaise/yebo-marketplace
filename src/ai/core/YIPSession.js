import { YIPEvents, YIP_EVENT } from "./YIPEvents";
import { YIPLogger } from "./YIPLogger";

let sessionCounter = 0;

export class YIPSession {
  constructor() {
    this.id = `yip-${Date.now()}-${++sessionCounter}`;
    this.startedAt = Date.now();
    this.endedAt = null;
    this.metadata = {};
  }

  start(metadata = {}) {
    this.metadata = { ...this.metadata, ...metadata };
    YIPLogger.info("Session started", this.id);
    YIPEvents.emit(YIP_EVENT.SESSION_START, { sessionId: this.id, metadata: this.metadata });
    return this.id;
  }

  end() {
    this.endedAt = Date.now();
    YIPLogger.info("Session ended", this.id);
    YIPEvents.emit(YIP_EVENT.SESSION_END, { sessionId: this.id, duration: this.endedAt - this.startedAt });
  }

  touch(meta = {}) {
    this.metadata = { ...this.metadata, ...meta, lastActiveAt: Date.now() };
  }
}

export const createSession = () => new YIPSession();

export default YIPSession;
