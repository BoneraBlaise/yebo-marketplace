import { SHOPPING_SCOPES } from "../memory/YEBOShoppingContext";
import { DecisionEvents, DECISION_EVENT } from "./DecisionEvents";

/** Binds memory + page context for decision generation. */
export class DecisionContext {
  constructor({ memoryEngine, contextEngine } = {}) {
    this.memoryEngine = memoryEngine;
    this.contextEngine = contextEngine;
    this.scope = SHOPPING_SCOPES.HOMEPAGE;
    this.payload = {};
  }

  activate(scope, data = {}) {
    this.scope = scope;
    this.payload = { ...data, scope, at: Date.now() };
    DecisionEvents.emit(DECISION_EVENT.CONTEXT_UPDATE, this.getSnapshot());
    return this.getSnapshot();
  }

  getMemory() {
    return this.memoryEngine?.getSnapshot?.() || {};
  }

  getPageContext() {
    return this.contextEngine?.getCurrent?.() || null;
  }

  getSnapshot() {
    return {
      scope: this.scope,
      payload: { ...this.payload },
      memory: this.getMemory(),
      pageContext: this.getPageContext(),
    };
  }
}

export const createDecisionContext = (deps) => new DecisionContext(deps);

export default DecisionContext;
