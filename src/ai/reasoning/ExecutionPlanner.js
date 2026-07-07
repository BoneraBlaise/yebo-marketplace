import { createExecutionGraph } from "./ExecutionGraph";

/** Multi-step execution planning — Phase 8C */
export class ExecutionPlanner {
  plan(steps = []) {
    const graph = createExecutionGraph();
    let prevId = null;
    steps.forEach((step, index) => {
      const id = step.id || `step-${index + 1}`;
      graph.addNode(id, { label: step.label || id, type: step.type || "task" });
      if (prevId) {
        graph.addEdge(prevId, id, step.dependsOn || "sequential");
      }
      prevId = id;
    });
    return graph;
  }

  buildFromIntent(intent = {}) {
    const steps = [
      { id: "understand", label: "Understand intent", type: "analysis" },
      { id: "retrieve", label: "Retrieve context", type: "retrieval" },
      { id: "reason", label: "Apply reasoning", type: "reasoning" },
      { id: "respond", label: "Formulate response", type: "output" },
    ];

    if (intent.requiresAction) {
      steps.splice(3, 0, { id: "act", label: "Execute tool", type: "action" });
    }

    return this.plan(steps);
  }
}

export const createExecutionPlanner = () => new ExecutionPlanner();

export default ExecutionPlanner;
