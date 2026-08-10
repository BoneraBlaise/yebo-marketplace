import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildVariantCartItem,
  cartItemsMatch,
  getCartLineKey,
  normalizeCartItem,
  normalizeCartItems,
} from "../cartLineIdentity.js";

const product = {
  _id: "prod_grip",
  name: "Magnetic Smartphone Camera Grip Wireless",
  category: "Electronics",
  shopId: "shop_1",
  shop: { _id: "shop_1", name: "Grip Shop" },
  images: [{ url: "https://cdn.example/parent.jpg" }],
  hasVariants: true,
  optionGroups: [
    {
      id: "opt_package",
      name: "Package",
      values: [
        { id: "val_grip", label: "Grip Only" },
        { id: "val_ring", label: "Grip + Ring Light" },
      ],
    },
  ],
};

const gripVariant = {
  id: "var_grip",
  sku: "GRIP-001",
  optionValueIds: ["val_grip"],
  discountPrice: 20000,
  originalPrice: 25000,
  stock: 15,
  sold_out: 0,
  isAvailable: true,
  images: [{ url: "https://cdn.example/grip.jpg" }],
};

const ringVariant = {
  id: "var_ring",
  sku: "GRIP-LIGHT-001",
  optionValueIds: ["val_ring"],
  discountPrice: 27000,
  stock: 8,
  sold_out: 0,
  isAvailable: true,
  images: [],
};

describe("cart variant identity", () => {
  it("uses productId for flat products", () => {
    assert.equal(getCartLineKey({ _id: "flat_1" }), "flat_1");
  });

  it("uses productId + variantId for variant products", () => {
    assert.equal(
      getCartLineKey({ _id: "prod_grip", variantId: "var_ring" }),
      "prod_grip:var_ring"
    );
  });

  it("keeps different variants as separate cart lines", () => {
    const grip = buildVariantCartItem(product, gripVariant, 1);
    const ring = buildVariantCartItem(product, ringVariant, 1);
    assert.notEqual(getCartLineKey(grip), getCartLineKey(ring));
    assert.equal(cartItemsMatch(grip, ring), false);
  });

  it("matches the same variant cart line", () => {
    const first = buildVariantCartItem(product, gripVariant, 1);
    const second = buildVariantCartItem(product, gripVariant, 2);
    assert.equal(cartItemsMatch(first, second), true);
  });

  it("preserves variant metadata in cart items", () => {
    const item = buildVariantCartItem(product, ringVariant, 2);
    assert.equal(item.variantId, "var_ring");
    assert.equal(item.sku, "GRIP-LIGHT-001");
    assert.equal(item.qty, 2);
    assert.equal(item.selectedOptions[0].label, "Grip + Ring Light");
    assert.equal(item.stock, 8);
  });

  it("normalizes legacy flat cart items safely", () => {
    const legacy = normalizeCartItem({
      _id: "flat_1",
      name: "Flat Product",
      discountPrice: 1000,
      qty: 1,
    });
    assert.equal(legacy.productId, "flat_1");
    assert.equal(legacy.cartLineKey, "flat_1");
    assert.equal(legacy.variantId, undefined);
  });

  it("normalizes persisted cart arrays on load", () => {
    const items = normalizeCartItems([
      { _id: "flat_1", qty: 1 },
      { _id: "prod_grip", variantId: "var_grip", qty: 1 },
    ]);
    assert.equal(items[0].cartLineKey, "flat_1");
    assert.equal(items[1].cartLineKey, "prod_grip:var_grip");
  });
});

describe("cart reducer identity (pure simulation)", () => {
  it("merges quantity for same product + same variant", () => {
    const existing = buildVariantCartItem(product, gripVariant, 1);
    const incoming = buildVariantCartItem(product, gripVariant, 2);
    assert.equal(getCartLineKey(existing), getCartLineKey(incoming));
    assert.equal(existing.qty + incoming.qty, 3);
  });
});
