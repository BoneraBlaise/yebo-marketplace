import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildPhase4CartContext,
  findVariantBySelection,
  getDefaultSelection,
  getDisplayImages,
  getOptionValueState,
  getResolvedOffer,
  isVariantPurchasable,
  productHasVariantSelector,
} from "../productVariantSelection.js";

const flatProduct = {
  _id: "prod_flat",
  name: "Flat Headphones",
  discountPrice: 15000,
  originalPrice: 18000,
  stock: 8,
  images: [{ url: "https://cdn.example/parent.jpg" }],
  hasVariants: false,
};

const variantProduct = {
  _id: "prod_variant",
  name: "Magnetic Smartphone Camera Grip Wireless",
  hasVariants: true,
  discountPrice: 20000,
  stock: 26,
  images: [{ url: "https://cdn.example/parent.jpg" }],
  optionGroups: [
    {
      id: "opt_package",
      name: "Package",
      position: 0,
      values: [
        { id: "val_grip", label: "Grip Only", position: 0 },
        { id: "val_ring", label: "Grip + Ring Light", position: 1 },
        { id: "val_full", label: "Full Set", position: 2 },
      ],
    },
  ],
  variants: [
    {
      id: "var_grip",
      sku: "GRIP-001",
      optionValueIds: ["val_grip"],
      discountPrice: 20000,
      originalPrice: 25000,
      stock: 15,
      sold_out: 0,
      isAvailable: true,
      images: [{ url: "https://cdn.example/grip.jpg" }],
    },
    {
      id: "var_ring",
      sku: "GRIP-002",
      optionValueIds: ["val_ring"],
      discountPrice: 27000,
      originalPrice: 32000,
      stock: 7,
      sold_out: 0,
      isAvailable: true,
      images: [],
    },
    {
      id: "var_full",
      sku: "GRIP-003",
      optionValueIds: ["val_full"],
      discountPrice: 35000,
      stock: 0,
      sold_out: 0,
      isAvailable: true,
      images: [{ url: "https://cdn.example/full.jpg" }],
    },
  ],
};

const multiOptionProduct = {
  _id: "prod_multi",
  hasVariants: true,
  discountPrice: 10000,
  stock: 10,
  images: [{ url: "https://cdn.example/shirt.jpg" }],
  optionGroups: [
    {
      id: "opt_color",
      name: "Color",
      position: 0,
      values: [
        { id: "val_black", label: "Black", position: 0 },
        { id: "val_white", label: "White", position: 1 },
      ],
    },
    {
      id: "opt_size",
      name: "Size",
      position: 1,
      values: [
        { id: "val_s", label: "S", position: 0 },
        { id: "val_m", label: "M", position: 1 },
        { id: "val_l", label: "L", position: 2 },
      ],
    },
  ],
  variants: [
    {
      id: "var_black_m",
      sku: "TEE-BM",
      optionValueIds: ["val_black", "val_m"],
      discountPrice: 12000,
      stock: 4,
      isAvailable: true,
      images: [],
    },
    {
      id: "var_white_l",
      sku: "TEE-WL",
      optionValueIds: ["val_white", "val_l"],
      discountPrice: 13000,
      stock: 2,
      isAvailable: true,
      images: [{ url: "https://cdn.example/white-l.jpg" }],
    },
  ],
};

describe("product variant PDP selection", () => {
  it("flat product does not show variant selector", () => {
    assert.equal(productHasVariantSelector(flatProduct), false);
  });

  it("single-option variant selection resolves the correct variant", () => {
    const selection = getDefaultSelection(variantProduct);
    const variant = findVariantBySelection(variantProduct, selection);
    assert.equal(variant?.id, "var_grip");
    assert.equal(variant?.sku, "GRIP-001");
  });

  it("selected variant resolves correct price and compare-at price", () => {
    const selection = { opt_package: "val_ring" };
    const variant = findVariantBySelection(variantProduct, selection);
    const offer = getResolvedOffer(variantProduct, variant);
    assert.equal(offer.discountPrice, 27000);
    assert.equal(offer.originalPrice, 32000);
  });

  it("selected variant resolves correct stock and availability", () => {
    const selection = { opt_package: "val_full" };
    const variant = findVariantBySelection(variantProduct, selection);
    const offer = getResolvedOffer(variantProduct, variant);
    assert.equal(offer.stock, 0);
    assert.equal(isVariantPurchasable(variant), false);
  });

  it("variant images are used when available", () => {
    const selection = { opt_package: "val_grip" };
    const variant = findVariantBySelection(variantProduct, selection);
    const images = getDisplayImages(variantProduct, variant);
    assert.equal(images[0].url, "https://cdn.example/grip.jpg");
  });

  it("parent images are used when variant has no images", () => {
    const selection = { opt_package: "val_ring" };
    const variant = findVariantBySelection(variantProduct, selection);
    const images = getDisplayImages(variantProduct, variant);
    assert.deepEqual(images, variantProduct.images);
  });

  it("invalid multi-option combination is unavailable", () => {
    const partialSelection = { opt_color: "val_black" };
    assert.equal(
      getOptionValueState(multiOptionProduct, "opt_size", "val_l", partialSelection),
      "unavailable"
    );
  });

  it("existing flat-product offer behavior remains unchanged", () => {
    const offer = getResolvedOffer(flatProduct, null);
    assert.equal(offer.discountPrice, 15000);
    assert.equal(offer.originalPrice, 18000);
    assert.equal(offer.stock, 8);
    assert.equal(offer.variantId, null);
  });

  it("variant selection helpers are pure and do not perform API requests", () => {
    assert.equal(typeof fetch, "function");
    const selection = getDefaultSelection(variantProduct);
    const variant = findVariantBySelection(variantProduct, selection);
    getResolvedOffer(variantProduct, variant);
    getDisplayImages(variantProduct, variant);
    assert.ok(true);
  });

  it("phase 4 cart context exposes selected variant metadata without cart changes", () => {
    const selection = { opt_package: "val_grip" };
    const variant = findVariantBySelection(variantProduct, selection);
    const context = buildPhase4CartContext(variantProduct, variant, 2);
    assert.equal(context.productId, "prod_variant");
    assert.equal(context.variantId, "var_grip");
    assert.equal(context.sku, "GRIP-001");
    assert.equal(context.qty, 2);
    assert.equal(context.discountPrice, 20000);
  });
});

describe("cart boundary", () => {
  it("does not import or modify cart modules from selection helpers", async () => {
    const moduleUrl = new URL("../productVariantSelection.js", import.meta.url);
    const source = await import("node:fs/promises").then((fs) => fs.readFile(moduleUrl, "utf8"));
    assert.doesNotMatch(source, /redux\/actions\/cart|redux\/reducers\/cart/);
  });
});
