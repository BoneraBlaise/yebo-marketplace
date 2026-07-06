import { YIP_SCOPES } from "../context/scopes";
import { MemoryEvents, MEMORY_EVENT } from "./MemoryEvents";

/**
 * Shared shopping context — maps YIP scopes to memory surfaces.
 * Supports homepage, search, product, cart, checkout, wishlist, orders,
 * dashboards, vendor, admin, and future mobile.
 */
export const SHOPPING_SCOPES = {
  ...YIP_SCOPES,
  WISHLIST: "wishlist",
  ORDERS: "orders",
};

const SCOPE_LABELS = {
  [SHOPPING_SCOPES.HOMEPAGE]: "Homepage",
  [SHOPPING_SCOPES.SEARCH]: "Search",
  [SHOPPING_SCOPES.PRODUCT]: "Product Details",
  [SHOPPING_SCOPES.CART]: "Cart",
  [SHOPPING_SCOPES.CHECKOUT]: "Checkout",
  [SHOPPING_SCOPES.WISHLIST]: "Wishlist",
  [SHOPPING_SCOPES.ORDERS]: "Orders",
  [SHOPPING_SCOPES.CUSTOMER_DASHBOARD]: "Customer Dashboard",
  [SHOPPING_SCOPES.VENDOR_DASHBOARD]: "Vendor Dashboard",
  [SHOPPING_SCOPES.ADMIN_DASHBOARD]: "Admin Dashboard",
  [SHOPPING_SCOPES.MOBILE]: "Mobile App",
  [SHOPPING_SCOPES.GLOBAL]: "Global",
};

export class YEBOShoppingContext {
  constructor(memoryEngine) {
    this.memory = memoryEngine;
    this.activeScope = SHOPPING_SCOPES.HOMEPAGE;
    this.payload = {};
  }

  activate(scope, data = {}) {
    this.activeScope = scope;
    this.payload = { ...data, scope, label: SCOPE_LABELS[scope] || scope, at: Date.now() };
    this.memory?.setActiveScope?.(scope);
    MemoryEvents.emit(MEMORY_EVENT.CONTEXT_CHANGE, this.payload);
    return this.getContext();
  }

  forHomepage(data) {
    return this.activate(SHOPPING_SCOPES.HOMEPAGE, data);
  }

  forSearch(data) {
    return this.activate(SHOPPING_SCOPES.SEARCH, data);
  }

  forProduct(data) {
    return this.activate(SHOPPING_SCOPES.PRODUCT, data);
  }

  forCart(data) {
    return this.activate(SHOPPING_SCOPES.CART, data);
  }

  forCheckout(data) {
    return this.activate(SHOPPING_SCOPES.CHECKOUT, data);
  }

  forWishlist(data) {
    return this.activate(SHOPPING_SCOPES.WISHLIST, data);
  }

  forOrders(data) {
    return this.activate(SHOPPING_SCOPES.ORDERS, data);
  }

  forCustomerDashboard(data) {
    return this.activate(SHOPPING_SCOPES.CUSTOMER_DASHBOARD, data);
  }

  forVendorDashboard(data) {
    return this.activate(SHOPPING_SCOPES.VENDOR_DASHBOARD, data);
  }

  forAdminDashboard(data) {
    return this.activate(SHOPPING_SCOPES.ADMIN_DASHBOARD, data);
  }

  forMobile(data) {
    return this.activate(SHOPPING_SCOPES.MOBILE, data);
  }

  getContext() {
    const snap = this.memory?.getSnapshot?.() || {};
    return {
      scope: this.activeScope,
      label: SCOPE_LABELS[this.activeScope],
      payload: { ...this.payload },
      memory: snap,
      welcomeMessage: this.memory?.getWelcomeMessage?.(),
      reminders: snap.shopping?.reminders || [],
      crossPage: snap.visualization?.crossPage || [],
    };
  }
}

export const createYEBOShoppingContext = (memoryEngine) => new YEBOShoppingContext(memoryEngine);

export default YEBOShoppingContext;
