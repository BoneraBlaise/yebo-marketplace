/** Action definition registry — no business logic */

export class ActionRegistry {
  constructor() {
    this.actions = new Map();
  }

  register(definition) {
    if (!definition?.id) {
      throw new Error("ActionRegistry: action id is required");
    }
    const entry = {
      id: definition.id,
      label: definition.label || definition.id,
      description: definition.description || "",
      permissions: definition.permissions || [],
      handler: definition.handler || null,
      metadata: definition.metadata || {},
      registeredAt: new Date().toISOString(),
    };
    this.actions.set(entry.id, entry);
    return entry;
  }

  unregister(id) {
    return this.actions.delete(id);
  }

  get(id) {
    return this.actions.get(id) || null;
  }

  list() {
    return [...this.actions.values()].map(({ handler, ...rest }) => ({
      ...rest,
      hasHandler: Boolean(handler),
    }));
  }
}

export const createActionRegistry = () => new ActionRegistry();

export default ActionRegistry;
