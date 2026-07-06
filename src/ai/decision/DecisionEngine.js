import { createDecisionContext } from "./DecisionContext";
import { ShoppingDecisionEngine } from "./ShoppingDecisionEngine";
import { VendorDecisionEngine } from "./VendorDecisionEngine";
import { AdminDecisionEngine } from "./AdminDecisionEngine";
import { DecisionRegistry, DECISION_PROVIDERS } from "./DecisionRegistry";
import { DecisionEvents, DECISION_EVENT } from "./DecisionEvents";
import { sortByPriority, topDecision } from "./DecisionHelpers";
import { SHOPPING_SCOPES } from "../memory/YEBOShoppingContext";

/**
 * YEBO Decision Engine — sits between Memory → Context → Decision → UI.
 * Mock decisions only; no AI providers.
 */
export class DecisionEngine {
  constructor({ memoryEngine, contextEngine } = {}) {
    this.decisionContext = createDecisionContext({ memoryEngine, contextEngine });
    this.shopping = new ShoppingDecisionEngine(this.decisionContext);
    this.vendor = new VendorDecisionEngine(this.decisionContext);
    this.admin = new AdminDecisionEngine(this.decisionContext);
    this._cache = {};
    this._reasonIndex = new Map();
  }

  /** All recommendation methods delegate to shopping engine */
  recommendProducts(...args) {
    return this.shopping.recommendProducts(...args);
  }
  recommendCategories(...args) {
    return this.shopping.recommendCategories(...args);
  }
  recommendBrands(...args) {
    return this.shopping.recommendBrands(...args);
  }
  recommendVendors(...args) {
    return this.shopping.recommendVendors(...args);
  }
  recommendBundles(...args) {
    return this.shopping.recommendBundles(...args);
  }
  recommendSize(...args) {
    return this.shopping.recommendSize(...args);
  }
  recommendColor(...args) {
    return this.shopping.recommendColor(...args);
  }
  recommendBudget(...args) {
    return this.shopping.recommendBudget(...args);
  }
  recommendCoupons(...args) {
    return this.shopping.recommendCoupons(...args);
  }
  recommendShipping(...args) {
    return this.shopping.recommendShipping(...args);
  }
  recommendPayment(...args) {
    return this.shopping.recommendPayment(...args);
  }
  recommendNextAction(...args) {
    return this.shopping.recommendNextAction(...args);
  }
  recommendSearch(...args) {
    return this.shopping.recommendSearch(...args);
  }
  recommendTrending(...args) {
    return this.shopping.recommendTrending(...args);
  }
  recommendForVendor(...args) {
    return this.vendor.recommendForVendor(...args);
  }
  recommendForAdmin(...args) {
    return this.admin.recommendForAdmin(...args);
  }

  _indexReasons(decisions) {
    decisions.forEach((d) => this._reasonIndex.set(d.id, d.reason));
  }

  getRecommendations(scope = SHOPPING_SCOPES.HOMEPAGE) {
    let decisions = [];
    if (scope === SHOPPING_SCOPES.VENDOR_DASHBOARD) {
      decisions = this.recommendForVendor();
    } else if (scope === SHOPPING_SCOPES.ADMIN_DASHBOARD) {
      decisions = this.recommendForAdmin();
    } else if (scope === SHOPPING_SCOPES.CART) {
      decisions = [
        ...this.recommendBundles(),
        ...this.recommendProducts(2),
        ...this.recommendCoupons(),
      ];
    } else if (scope === SHOPPING_SCOPES.CHECKOUT) {
      decisions = [
        ...this.recommendShipping(),
        ...this.recommendPayment(),
        ...this.recommendNextAction(),
      ];
    } else if (scope === SHOPPING_SCOPES.PRODUCT) {
      decisions = [
        ...this.recommendProducts(2),
        ...this.recommendSize(),
        ...this.recommendColor(),
      ];
    } else if (scope === SHOPPING_SCOPES.SEARCH) {
      decisions = [...this.recommendSearch(), ...this.recommendTrending()];
    } else {
      decisions = this.shopping.forScope(scope);
    }

    const sorted = sortByPriority(decisions);
    this._cache[scope] = sorted;
    this._indexReasons(sorted);
    DecisionEvents.emit(DECISION_EVENT.GENERATED, { scope, decisions: sorted });
    return sorted;
  }

  getDecisionReason(id) {
    return this._reasonIndex.get(id) || null;
  }

  getTopDecision(scope) {
    const list = this._cache[scope] || this.getRecommendations(scope);
    return topDecision(list);
  }

  getSnapshot() {
    return {
      context: this.decisionContext.getSnapshot(),
      registry: DecisionRegistry.list(),
      activeProviders: Object.values(DECISION_PROVIDERS).filter((id) =>
        DecisionRegistry.isActive(id)
      ),
      scopes: Object.keys(this._cache),
      latestByScope: this._cache,
    };
  }

  clear() {
    this._cache = {};
    this._reasonIndex.clear();
    DecisionEvents.emit(DECISION_EVENT.CLEAR, {});
  }
}

export const createDecisionEngine = (deps) => new DecisionEngine(deps);

export default DecisionEngine;
