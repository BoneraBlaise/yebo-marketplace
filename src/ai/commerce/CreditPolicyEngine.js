import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI Credit Policy Engine — Phase 8D */
export class CreditPolicyEngine {
  constructor({ creditPolicy = {} } = {}) {
    this.policies = { ...creditPolicy };
  }

  setPolicy(key, cost) {
    this.policies[key] = cost;
    return this;
  }

  setPolicies(policies = {}) {
    this.policies = { ...this.policies, ...policies };
    return this;
  }

  getCost(featureKey) {
    const cost = this.policies[featureKey];
    if (cost === undefined || cost === null) {
      logCommerceDiagnostics("creditPolicy", { featureKey, cost: null, found: false });
      return 0;
    }
    return Number(cost);
  }

  getAllPolicies() {
    return { ...this.policies };
  }

  estimateCost(items = []) {
    return items.reduce((sum, key) => sum + this.getCost(key), 0);
  }
}

export const createCreditPolicyEngine = (options) => new CreditPolicyEngine(options);

export default CreditPolicyEngine;
