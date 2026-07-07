import { checkPermissions } from "./ActionPermissions";
import { createToolValidator } from "./ToolValidator";
import { logExecutionDiagnostics } from "./ExecutionDiagnostics";

/** Tool decision layer — when and which actions execute — Phase 8C */
export class ActionDecisionEngine {
  constructor({ actionManager = null } = {}) {
    this.actionManager = actionManager;
    this.validator = createToolValidator();
    this.lastDecision = null;
  }

  decide({ input = "", context = {}, reasoning = null } = {}) {
    const startedAt = Date.now();
    const query = String(input || "");
    const actions = this.actionManager?.listActions?.() || [];

    let selectedAction = null;
    let shouldExecute = false;

    const toolCandidate = reasoning?.conclusions?.includes("tool_execution_candidate");

    if (toolCandidate && actions.length) {
      selectedAction = this._selectTool(query, actions, reasoning);
    }

    const actionDef = selectedAction
      ? actions.find((a) => a.id === selectedAction)
      : null;

    const permissionCheck = actionDef
      ? checkPermissions(actionDef, context)
      : { allowed: true, missing: [] };

    const validation = this.validator.validateSelection(selectedAction, actions);

    if (selectedAction && permissionCheck.allowed && validation.valid) {
      shouldExecute = true;
    }

    const decision = {
      selectedAction,
      shouldExecute,
      executed: false,
      passThrough: true,
      input: query,
      permissionCheck,
      validation,
      availableActions: actions.map((a) => a.id),
      reasoningCategory: reasoning?.intent?.category || null,
    };

    this.lastDecision = decision;

    logExecutionDiagnostics({
      selectedAction,
      shouldExecute,
      availableActions: actions.length,
      permissionAllowed: permissionCheck.allowed,
      validationPassed: validation.valid,
      elapsedMs: Date.now() - startedAt,
    });

    return decision;
  }

  _selectTool(query, actions, reasoning) {
    const category = reasoning?.intent?.category || "general";
    const categoryMap = {
      product: ["search_products", "product_lookup"],
      commerce: ["cart_update", "wishlist_update"],
      faq: ["faq_lookup"],
      organization: ["vendor_lookup"],
    };

    const preferred = categoryMap[category] || [];
    for (const id of preferred) {
      if (actions.find((a) => a.id === id)) return id;
    }

    return actions[0]?.id || null;
  }

  async executeIfNeeded(decision, actionContext, payload = {}) {
    if (!decision.shouldExecute || !decision.selectedAction || !this.actionManager) {
      return { ...decision, executed: false };
    }

    const result = await this.actionManager.execute(
      decision.selectedAction,
      actionContext,
      payload
    );

    return {
      ...decision,
      executed: true,
      executionResult: result,
      passThrough: true,
    };
  }
}

export const createActionDecisionEngine = (options) => new ActionDecisionEngine(options);

export default ActionDecisionEngine;
