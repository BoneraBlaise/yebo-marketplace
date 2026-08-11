import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildCombinationKey,
  buildProductApiPayload,
  createEmptyProductWizardValues,
  ensureVariantSkus,
  generateVariantCombinations,
  generateVariantSku,
  productToWizardValues,
  syncVariantsWithOptionGroups,
  syncVariantsWithOptionValues,
} from "../productVariantPayload.mjs";

describe("product variant vendor form", () => {
  it("builds flat product payload unchanged", () => {
    const values = {
      ...createEmptyProductWizardValues(),
      name: "Flat Product",
      description: "Desc",
      category: "Electronics",
      discountPrice: "20000",
      stock: "10",
    };

    const payload = buildProductApiPayload(values, "shop-1", ["img-a"]);
    assert.equal(payload.hasVariants, false);
    assert.equal(payload.discountPrice, 20000);
    assert.equal(payload.stock, 10);
    assert.deepEqual(payload.optionGroups, []);
    assert.deepEqual(payload.variants, []);
  });

  it("builds variant product payload with SKU, price, stock, availability, and images", () => {
    const synced = syncVariantsWithOptionValues({
      optionValues: ["Grip Only", "Full Set"],
      optionValueIds: ["val_grip", "val_full"],
      variants: [
        {
          id: "var_1",
          optionValueId: "val_grip",
          label: "Grip Only",
          sku: "GRIP-001",
          discountPrice: "20000",
          originalPrice: "25000",
          stock: "15",
          isAvailable: true,
          images: ["data:image/png;base64,abc"],
        },
        {
          id: "var_2",
          optionValueId: "val_full",
          label: "Full Set",
          sku: "GRIP-003",
          discountPrice: "35000",
          stock: "4",
          isAvailable: false,
          images: [],
        },
      ],
    });

    const values = {
      ...createEmptyProductWizardValues(),
      name: "Grip Product",
      description: "Desc",
      category: "Electronics",
      hasVariants: true,
      optionGroups: synced.optionGroups,
      variants: synced.variants,
    };

    const payload = buildProductApiPayload(values, "shop-1", ["parent-img"]);
    assert.equal(payload.hasVariants, true);
    assert.equal(payload.optionGroups[0].name, "Package");
    assert.equal(payload.variants.length, 2);
    assert.equal(payload.variants[0].sku, "GRIP-001");
    assert.equal(payload.variants[0].discountPrice, 20000);
    assert.equal(payload.variants[0].stock, 15);
    assert.equal(payload.variants[0].isAvailable, true);
    assert.deepEqual(payload.variants[0].images, ["data:image/png;base64,abc"]);
    assert.deepEqual(payload.variants[0].optionValueIds, ["val_grip"]);
    assert.equal(payload.discountPrice, 20000);
    assert.equal(payload.stock, 19);
  });

  it("prefills edit values from an existing variant product", () => {
    const wizardValues = productToWizardValues({
      name: "Existing Variant Product",
      category: "Electronics",
      discountPrice: 20000,
      stock: 19,
      hasVariants: true,
      optionGroups: [
        {
          id: "opt_package",
          name: "Package",
          values: [
            { id: "val_grip", label: "Grip Only" },
            { id: "val_full", label: "Full Set" },
          ],
        },
      ],
      variants: [
        {
          id: "var_1",
          sku: "GRIP-001",
          optionValueIds: ["val_grip"],
          discountPrice: 20000,
          stock: 15,
          isAvailable: true,
          images: [{ url: "https://cdn.example/grip.jpg" }],
        },
      ],
      images: [{ url: "https://cdn.example/parent.jpg" }],
    });

    assert.equal(wizardValues.hasVariants, true);
    assert.equal(wizardValues.variants[0].sku, "GRIP-001");
    assert.equal(wizardValues.variants[0].discountPrice, "20000");
    assert.equal(wizardValues.variants[0].stock, "15");
    assert.equal(wizardValues.variants[0].images[0], "https://cdn.example/grip.jpg");
  });

  it("supports adding and removing synced variant rows", () => {
    const initial = syncVariantsWithOptionValues({
      optionValues: ["Grip Only"],
      optionValueIds: ["val_grip"],
      variants: [],
    });

    const expanded = syncVariantsWithOptionValues({
      optionValues: ["Grip Only", "Full Set"],
      optionValueIds: ["val_grip", "val_full"],
      variants: initial.variants,
    });

    assert.equal(expanded.variants.length, 2);
    assert.equal(expanded.variants[1].label, "Full Set");

    const reduced = syncVariantsWithOptionValues({
      optionValues: ["Grip Only"],
      optionValueIds: ["val_grip"],
      variants: expanded.variants,
    });

    assert.equal(reduced.variants.length, 1);
  });

  it("generates automatic SKU for new variants", () => {
    const synced = syncVariantsWithOptionValues({
      optionValues: ["Black", "White"],
      optionValueIds: ["val_black", "val_white"],
      variants: [],
    });

    assert.equal(synced.variants.length, 2);
    assert.match(synced.variants[0].sku, /^YB-/);
    assert.match(synced.variants[1].sku, /^YB-/);
    assert.notEqual(synced.variants[0].sku, synced.variants[1].sku);
  });

  it("preserves existing variant SKU when editing", () => {
    const synced = syncVariantsWithOptionValues({
      optionValues: ["Grip Only"],
      optionValueIds: ["val_grip"],
      variants: [
        {
          id: "var_existing",
          optionValueId: "val_grip",
          label: "Grip Only",
          sku: "GRIP-001",
          discountPrice: "20000",
          stock: "5",
        },
      ],
    });

    assert.equal(synced.variants[0].sku, "GRIP-001");
  });

  it("keeps SKU stable across repeated sync for the same variant id", () => {
    const first = syncVariantsWithOptionValues({
      optionValues: ["Chocolate"],
      optionValueIds: ["val_choc"],
      variants: [{ id: "var_choc_1", optionValueId: "val_choc", label: "Chocolate" }],
    });

    const second = syncVariantsWithOptionValues({
      optionValues: ["Chocolate"],
      optionValueIds: ["val_choc"],
      variants: first.variants,
    });

    assert.equal(first.variants[0].sku, second.variants[0].sku);
  });

  it("assigns SKU to newly added variant while preserving existing SKUs", () => {
    const initial = syncVariantsWithOptionValues({
      optionValues: ["Black"],
      optionValueIds: ["val_black"],
      variants: [
        {
          id: "var_black",
          optionValueId: "val_black",
          label: "Black",
          sku: "YB-EXISTING-001",
        },
      ],
    });

    const expanded = syncVariantsWithOptionValues({
      optionValues: ["Black", "White"],
      optionValueIds: ["val_black", "val_white"],
      variants: initial.variants,
    });

    assert.equal(expanded.variants[0].sku, "YB-EXISTING-001");
    assert.match(expanded.variants[1].sku, /^YB-/);
  });

  it("ensures unique SKU within a product", () => {
    const variants = ensureVariantSkus([
      { id: "var_a", sku: "" },
      { id: "var_b", sku: "" },
      { id: "var_c", sku: "" },
    ]);

    const normalized = variants.map((variant) => variant.sku.toUpperCase());
    assert.equal(new Set(normalized).size, variants.length);
  });

  it("does not affect flat product payloads", () => {
    const values = {
      ...createEmptyProductWizardValues(),
      name: "Flat Product",
      description: "Desc",
      category: "Electronics",
      discountPrice: "15000",
      stock: "3",
    };

    const payload = buildProductApiPayload(values, "shop-1", []);
    assert.equal(payload.hasVariants, false);
    assert.equal(payload.variants.length, 0);
    assert.equal(payload.discountPrice, 15000);
  });

  it("fills missing SKU in buildProductApiPayload before submit", () => {
    const synced = syncVariantsWithOptionValues({
      optionValues: ["Grip Only"],
      optionValueIds: ["val_grip"],
      variants: [
        {
          id: "var_1",
          optionValueId: "val_grip",
          label: "Grip Only",
          sku: "",
          discountPrice: "20000",
          stock: "4",
        },
      ],
    });

    const values = {
      ...createEmptyProductWizardValues(),
      name: "Variant Product",
      description: "Desc",
      category: "Electronics",
      hasVariants: true,
      optionGroups: synced.optionGroups,
      variants: synced.variants,
    };

    const payload = buildProductApiPayload(values, "shop-1", []);
    assert.match(payload.variants[0].sku, /^YB-/);
  });

  it("generates cartesian combinations for multiple option groups", () => {
    const synced = syncVariantsWithOptionGroups({
      optionGroups: [
        {
          id: "opt_color",
          name: "Color",
          values: [
            { id: "val_black", label: "Black" },
            { id: "val_white", label: "White" },
          ],
        },
        {
          id: "opt_size",
          name: "Size",
          values: [
            { id: "val_m", label: "M" },
            { id: "val_l", label: "L" },
          ],
        },
      ],
      variants: [],
    });

    assert.equal(synced.variants.length, 4);
    assert.equal(
      synced.variants.find((variant) => variant.label === "Black · M")?.optionValueIds?.length,
      2
    );
    assert.equal(
      synced.variants.find((variant) => variant.label === "White · L")?.combinationKey,
      buildCombinationKey(["val_white", "val_l"])
    );
  });

  it("prevents duplicate combinations during sync", () => {
    const combinations = generateVariantCombinations([
      {
        id: "opt_color",
        name: "Color",
        values: [{ id: "val_black", label: "Black" }],
      },
      {
        id: "opt_size",
        name: "Size",
        values: [{ id: "val_m", label: "M" }],
      },
    ]);
    assert.equal(combinations.length, 1);
  });

  it("excludes removed combinations from generated variants", () => {
    const synced = syncVariantsWithOptionGroups({
      optionGroups: [
        {
          id: "opt_color",
          name: "Color",
          values: [
            { id: "val_red", label: "Red" },
            { id: "val_blue", label: "Blue" },
          ],
        },
        {
          id: "opt_size",
          name: "Size",
          values: [
            { id: "val_xl", label: "XL" },
          ],
        },
      ],
      variants: [],
      excludedCombinationKeys: [buildCombinationKey(["val_red", "val_xl"])],
    });

    assert.equal(synced.variants.length, 1);
    assert.equal(synced.variants[0].label, "Blue · XL");
  });

  it("loads multiple option groups when editing an existing product", () => {
    const wizardValues = productToWizardValues({
      hasVariants: true,
      optionGroups: [
        {
          id: "opt_color",
          name: "Color",
          values: [
            { id: "val_black", label: "Black" },
            { id: "val_white", label: "White" },
          ],
        },
        {
          id: "opt_size",
          name: "Size",
          values: [
            { id: "val_m", label: "M" },
            { id: "val_l", label: "L" },
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
        },
      ],
    });

    assert.equal(wizardValues.optionGroups.length, 2);
    assert.equal(wizardValues.variants[0].sku, "TEE-BM");
    assert.equal(wizardValues.variants[0].label, "Black · M");
  });

  it("builds multi-option payload with stable optionValueIds", () => {
    const synced = syncVariantsWithOptionGroups({
      optionGroups: [
        {
          id: "opt_color",
          name: "Color",
          values: [{ id: "val_black", label: "Black" }],
        },
        {
          id: "opt_size",
          name: "Size",
          values: [{ id: "val_m", label: "M" }],
        },
      ],
      variants: [
        {
          id: "var_black_m",
          sku: "TEE-BM",
          optionValueIds: ["val_black", "val_m"],
          discountPrice: "12000",
          stock: "3",
        },
      ],
    });

    const payload = buildProductApiPayload(
      {
        ...createEmptyProductWizardValues(),
        name: "Tee",
        description: "Desc",
        category: "Fashion",
        hasVariants: true,
        optionGroups: synced.optionGroups,
        variants: synced.variants,
      },
      "shop-1",
      []
    );

    assert.equal(payload.optionGroups.length, 2);
    assert.deepEqual(payload.variants[0].optionValueIds, ["val_black", "val_m"]);
    assert.equal(payload.variants[0].sku, "TEE-BM");
  });
});
