/** Tool / action validation — Phase 8C */

export class ToolValidator {
  validate(action, context = {}) {
    const errors = [];

    if (!action) {
      errors.push("action_not_found");
      return { valid: false, errors };
    }

    if (!action.id) errors.push("action_missing_id");
    if (typeof action.handler !== "function") errors.push("action_missing_handler");

    if (action.permissions?.length) {
      const granted = context.permissions || {};
      const missing = action.permissions.filter((p) => !granted[p]);
      if (missing.length) errors.push(`missing_permissions:${missing.join(",")}`);
    }

    return { valid: errors.length === 0, errors };
  }

  validateSelection(selectedAction, availableActions = []) {
    if (!selectedAction) return { valid: true, errors: [] };
    const found = availableActions.find((a) => a.id === selectedAction);
    if (!found) return { valid: false, errors: ["action_not_registered"] };
    return this.validate(found);
  }
}

export const createToolValidator = () => new ToolValidator();

export default ToolValidator;
