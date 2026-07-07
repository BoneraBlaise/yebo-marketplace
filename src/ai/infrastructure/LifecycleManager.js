import { LIFECYCLE_STATE } from "./InfrastructureTypes";
import { logInfrastructureDiagnostics } from "./InfrastructureDiagnostics";

const VALID_TRANSITIONS = {
  [LIFECYCLE_STATE.CREATED]: [LIFECYCLE_STATE.QUEUED, LIFECYCLE_STATE.DELETED],
  [LIFECYCLE_STATE.QUEUED]: [LIFECYCLE_STATE.RUNNING, LIFECYCLE_STATE.DELETED],
  [LIFECYCLE_STATE.RUNNING]: [LIFECYCLE_STATE.COMPLETED, LIFECYCLE_STATE.DELETED],
  [LIFECYCLE_STATE.COMPLETED]: [LIFECYCLE_STATE.CACHED, LIFECYCLE_STATE.ARCHIVED, LIFECYCLE_STATE.DELETED],
  [LIFECYCLE_STATE.CACHED]: [LIFECYCLE_STATE.ARCHIVED, LIFECYCLE_STATE.DELETED],
  [LIFECYCLE_STATE.ARCHIVED]: [LIFECYCLE_STATE.DELETED],
  [LIFECYCLE_STATE.DELETED]: [],
};

/** AI Lifecycle Manager — Phase 8E */
export class LifecycleManager {
  constructor() {
    this.states = new Map();
  }

  init(entityId, initialState = LIFECYCLE_STATE.CREATED) {
    this.states.set(entityId, {
      entityId,
      state: initialState,
      history: [{ state: initialState, at: new Date().toISOString() }],
    });
    return this.get(entityId);
  }

  get(entityId) {
    return this.states.get(entityId) || null;
  }

  canTransition(entityId, nextState) {
    const current = this.states.get(entityId);
    if (!current) return false;
    const allowed = VALID_TRANSITIONS[current.state] || [];
    return allowed.includes(nextState);
  }

  transition(entityId, nextState, metadata = {}) {
    if (!this.canTransition(entityId, nextState)) {
      return { ok: false, error: "invalid_transition", entityId, nextState };
    }

    const record = this.states.get(entityId);
    record.state = nextState;
    record.history.push({ state: nextState, at: new Date().toISOString(), metadata });
    logInfrastructureDiagnostics("lifecycle", { entityId, state: nextState });
    return { ok: true, ...record };
  }

  getHistory(entityId) {
    return this.states.get(entityId)?.history || [];
  }
}

export const createLifecycleManager = () => new LifecycleManager();

export default LifecycleManager;
