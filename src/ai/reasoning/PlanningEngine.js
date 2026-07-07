import { createExecutionPlanner } from "./ExecutionPlanner";

/** AI planning engine — Phase 8C */
export class PlanningEngine {
  constructor() {
    this.planner = createExecutionPlanner();
    this.lastPlan = null;
  }

  createPlan({ input = "", context = {}, intent = {} } = {}) {
    const normalizedIntent = {
      query: String(input || ""),
      hasMemory: Boolean(context.memory),
      hasKnowledge: Boolean(context.knowledge),
      historyCount: context.history?.length || 0,
      requiresAction: intent.requiresAction || false,
      ...intent,
    };

    const graph = this.planner.buildFromIntent(normalizedIntent);
    const steps = graph.snapshot().nodes.map((n) => n.label);

    this.lastPlan = {
      intent: normalizedIntent,
      graph,
      steps,
      stepCount: steps.length,
      createdAt: new Date().toISOString(),
    };

    return this.lastPlan;
  }

  getLastPlan() {
    return this.lastPlan;
  }
}

export const createPlanningEngine = () => new PlanningEngine();

export default PlanningEngine;
