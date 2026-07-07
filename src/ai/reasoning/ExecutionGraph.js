/** Execution graph for multi-step AI plans — Phase 8C */

export class ExecutionGraph {
  constructor() {
    this.nodes = new Map();
    this.edges = [];
  }

  addNode(id, data = {}) {
    this.nodes.set(id, { id, ...data, status: "pending" });
    return this;
  }

  addEdge(from, to, label = "") {
    this.edges.push({ from, to, label });
    return this;
  }

  getNode(id) {
    return this.nodes.get(id) || null;
  }

  getReadyNodes() {
    const completed = new Set(
      [...this.nodes.values()].filter((n) => n.status === "completed").map((n) => n.id)
    );
    return [...this.nodes.values()].filter((node) => {
      if (node.status !== "pending") return false;
      const deps = this.edges.filter((e) => e.to === node.id).map((e) => e.from);
      return deps.every((d) => completed.has(d));
    });
  }

  markCompleted(id, result = null) {
    const node = this.nodes.get(id);
    if (node) {
      node.status = "completed";
      node.result = result;
      node.completedAt = new Date().toISOString();
    }
    return node;
  }

  markFailed(id, error = null) {
    const node = this.nodes.get(id);
    if (node) {
      node.status = "failed";
      node.error = error?.message || String(error || "failed");
    }
    return node;
  }

  snapshot() {
    return {
      nodes: [...this.nodes.values()],
      edges: [...this.edges],
      completed: [...this.nodes.values()].filter((n) => n.status === "completed").length,
      pending: [...this.nodes.values()].filter((n) => n.status === "pending").length,
    };
  }
}

export const createExecutionGraph = () => new ExecutionGraph();

export default ExecutionGraph;
