import { createDecision } from "./DecisionHelpers";
import { DECISION_TYPE, DECISION_SOURCE } from "./DecisionTypes";

/** Vendor dashboard decisions — mock only. */
export class VendorDecisionEngine {
  constructor(decisionContext) {
    this.ctx = decisionContext;
  }

  recommendForVendor() {
    const vendor = this.ctx.getMemory().dashboards?.vendor || {};
    return [
      createDecision({
        id: "vendor-interest-1",
        type: DECISION_TYPE.VENDOR_INSIGHT,
        title: "Restock wireless earbuds",
        description: vendor.restockHint || "High demand signal — mock.",
        confidence: 83,
        reason: "Because customer interest in accessories is rising.",
        priority: 1,
        source: DECISION_SOURCE.MOCK,
        action: "Review inventory",
      }),
      createDecision({
        id: "vendor-compare-1",
        type: DECISION_TYPE.VENDOR_INSIGHT,
        title: (vendor.frequentlyCompared || [])[0] || "Pegasus vs Ultraboost",
        description: "Top product comparison this week.",
        confidence: 78,
        reason: "Because customers compare these models most.",
        priority: 2,
        source: DECISION_SOURCE.MOCK,
      }),
    ];
  }
}

export default VendorDecisionEngine;
