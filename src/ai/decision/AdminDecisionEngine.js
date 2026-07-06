import { createDecision } from "./DecisionHelpers";
import { DECISION_TYPE, DECISION_SOURCE } from "./DecisionTypes";

/** Admin platform decisions — mock only. */
export class AdminDecisionEngine {
  constructor(decisionContext) {
    this.ctx = decisionContext;
  }

  recommendForAdmin() {
    const admin = this.ctx.getMemory().dashboards?.admin || {};
    return [
      createDecision({
        id: "admin-trend-1",
        type: DECISION_TYPE.ADMIN_INSIGHT,
        title: (admin.trendingInterests || [])[0] || "Running shoes",
        description: admin.platformTrend || "Platform trend — mock.",
        confidence: 87,
        reason: "Because search volume increased this week.",
        priority: 1,
        source: DECISION_SOURCE.MOCK,
        action: "View analytics",
      }),
      createDecision({
        id: "admin-search-1",
        type: DECISION_TYPE.ADMIN_INSIGHT,
        title: (admin.popularSearches || [])[0] || "affordable phone",
        description: "Most requested search — mock.",
        confidence: 82,
        reason: "Because users search this term frequently.",
        priority: 2,
        source: DECISION_SOURCE.MOCK,
      }),
    ];
  }
}

export default AdminDecisionEngine;
