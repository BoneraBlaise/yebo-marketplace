/** @typedef {import('../types').YIPMessage} YIPMessage */

let messageCounter = 0;

export class YIPConversation {
  constructor(initialMessages = []) {
    /** @type {YIPMessage[]} */
    this.messages = [...initialMessages];
  }

  add(role, content, extra = {}) {
    const message = {
      id: `msg-${Date.now()}-${++messageCounter}`,
      role,
      content,
      timestamp: new Date().toISOString(),
      ...extra,
    };
    this.messages.push(message);
    return message;
  }

  getAll() {
    return [...this.messages];
  }

  getLast(n = 1) {
    return this.messages.slice(-n);
  }

  clear() {
    this.messages = [];
  }

  replaceAll(messages) {
    this.messages = [...messages];
  }
}

export default YIPConversation;
