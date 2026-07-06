import { YIP_SCOPES } from "./scopes";
import { YIPEvents, YIP_EVENT } from "../core/YIPEvents";

/** Builds scoped context payloads for YIP — presentation only. */
export class YIPContextEngine {
  constructor() {
    /** @type {Record<string, import('../types').YIPContextPayload>} */
    this.activeContexts = {};
  }

  build(scope, data = {}) {
    const payload = {
      scope,
      timestamp: Date.now(),
      data: { ...data },
    };
    this.activeContexts[scope] = payload;
    YIPEvents.emit(YIP_EVENT.CONTEXT_UPDATE, payload);
    return payload;
  }

  get(scope) {
    return this.activeContexts[scope] || null;
  }

  getCurrent() {
    const entries = Object.values(this.activeContexts);
    return entries.sort((a, b) => b.timestamp - a.timestamp)[0] || null;
  }

  clear(scope) {
    if (scope) delete this.activeContexts[scope];
    else this.activeContexts = {};
  }

  /** Preset builders for common surfaces */
  forHomepage(data) {
    return this.build(YIP_SCOPES.HOMEPAGE, data);
  }

  forSearch(data) {
    return this.build(YIP_SCOPES.SEARCH, data);
  }

  forProduct(data) {
    return this.build(YIP_SCOPES.PRODUCT, data);
  }

  forCart(data) {
    return this.build(YIP_SCOPES.CART, data);
  }

  forCheckout(data) {
    return this.build(YIP_SCOPES.CHECKOUT, data);
  }

  forCustomerDashboard(data) {
    return this.build(YIP_SCOPES.CUSTOMER_DASHBOARD, data);
  }

  forVendorDashboard(data) {
    return this.build(YIP_SCOPES.VENDOR_DASHBOARD, data);
  }

  forAdminDashboard(data) {
    return this.build(YIP_SCOPES.ADMIN_DASHBOARD, data);
  }

  forMobile(data) {
    return this.build(YIP_SCOPES.MOBILE, data);
  }
}

export const createContextEngine = () => new YIPContextEngine();

export default YIPContextEngine;
