import { createActionRegistry } from "./ActionRegistry";
import { createActionExecutor } from "./ActionExecutor";

/** Action Framework manager — register and execute future business tools */
export class ActionManager {
  constructor({ registry = null, executor = null } = {}) {
    this.registry = registry || createActionRegistry();
    this.executor = executor || createActionExecutor(this.registry);
  }

  registerAction(definition) {
    return this.registry.register(definition);
  }

  unregisterAction(id) {
    return this.registry.unregister(id);
  }

  getAction(id) {
    return this.registry.get(id);
  }

  listActions() {
    return this.registry.list();
  }

  execute(actionId, context = {}, payload = {}) {
    return this.executor.execute(actionId, context, payload);
  }
}

export const createActionManager = (options) => new ActionManager(options);

export default ActionManager;
