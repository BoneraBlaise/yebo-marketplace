import { createPlanningEngine } from "./PlanningEngine";
import { logReasoningDiagnostics } from "./ReasoningDiagnostics";

/** AI reasoning pipeline — Phase 8C */
export class ReasoningPipeline {
  constructor() {
    this.planner = createPlanningEngine();
    this.lastReasoning = null;
  }

  reason({ input = "", context = {} } = {}) {
    const startedAt = Date.now();
    const query = String(input || "");

    const signals = {
      memoryAvailable: Boolean(context.memoryInjected ?? context.memory),
      knowledgeAvailable: Boolean(context.knowledgeInjected ?? context.knowledge),
      historyCount: context.history?.length || 0,
      providerId: context.provider?.id || null,
    };

    const intent = {
      requiresAction: /^(find|search|buy|add|remove|show|list)\b/i.test(query),
      category: this._classifyQuery(query),
    };

    const plan = this.planner.createPlan({ input: query, context, intent });

    const conclusions = [];
    if (signals.memoryAvailable) conclusions.push("memory_context_available");
    if (signals.knowledgeAvailable) conclusions.push("knowledge_context_available");
    if (signals.historyCount > 0) conclusions.push("conversation_history_available");
    if (intent.requiresAction) conclusions.push("tool_execution_candidate");

    const reasoning = {
      query,
      intent,
      signals,
      plan: {
        steps: plan.steps,
        stepCount: plan.stepCount,
        graph: plan.graph.snapshot(),
      },
      conclusions,
      confidence: Math.min(1, 0.5 + conclusions.length * 0.1),
      elapsedMs: Date.now() - startedAt,
    };

    this.lastReasoning = reasoning;

    logReasoningDiagnostics({
      query: query.slice(0, 40),
      stepCount: plan.stepCount,
      conclusions: conclusions.length,
      confidence: reasoning.confidence,
      elapsedMs: reasoning.elapsedMs,
    });

    return reasoning;
  }

  _classifyQuery(query) {
    const q = query.toLowerCase();
    if (/product|item|price|buy/.test(q)) return "product";
    if (/faq|help|how|what|why/.test(q)) return "faq";
    if (/vendor|store|seller|organization/.test(q)) return "organization";
    if (/cart|wishlist|order/.test(q)) return "commerce";
    return "general";
  }
}

export const createReasoningPipeline = () => new ReasoningPipeline();

export default ReasoningPipeline;
