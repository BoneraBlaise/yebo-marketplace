/** Action execution layer — validates and normalizes results */

export class ActionExecutor {
  constructor(registry) {
    this.registry = registry;
  }

  validate(actionId) {
    const action = this.registry.get(actionId);
    if (!action) {
      throw new Error(`ActionExecutor: unknown action "${actionId}"`);
    }
    if (typeof action.handler !== "function") {
      throw new Error(`ActionExecutor: action "${actionId}" has no handler`);
    }
    return action;
  }

  normalizeResult(result) {
    return {
      ok: true,
      data: result ?? null,
      timestamp: new Date().toISOString(),
    };
  }

  normalizeError(error) {
    return {
      ok: false,
      error: error?.message || String(error || "Action execution failed"),
      timestamp: new Date().toISOString(),
    };
  }

  async execute(actionId, context = {}, payload = {}) {
    const startedAt = Date.now();
    try {
      const action = this.validate(actionId);
      const result = await action.handler({ context, payload, action });
      return {
        ...this.normalizeResult(result),
        actionId,
        durationMs: Date.now() - startedAt,
      };
    } catch (error) {
      return {
        ...this.normalizeError(error),
        actionId,
        durationMs: Date.now() - startedAt,
      };
    }
  }
}

export const createActionExecutor = (registry) => new ActionExecutor(registry);

export default ActionExecutor;
