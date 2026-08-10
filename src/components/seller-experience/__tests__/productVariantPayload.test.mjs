import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  buildProductApiPayload,
  createEmptyProductWizardValues,
  productToWizardValues,
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
      optionGroupName: "Package",
      optionGroupId: "opt_package",
      optionValues: ["Grip Only", "Full Set"],
      ...synced,
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
});
