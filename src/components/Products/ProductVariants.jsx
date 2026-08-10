import React, { useState } from "react";
import {
  getOptionValueState,
  productHasVariantSelector,
  sortOptionGroups,
} from "../../utils/productVariantSelection";

const normalizeOptions = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") return value.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
};

const LegacyProductVariants = ({ data }) => {
  const sizes = normalizeOptions(data?.sizes || data?.availableSizes || data?.sizeOptions);
  const colors = normalizeOptions(data?.colors || data?.availableColors || data?.colorOptions);
  const [selectedSize, setSelectedSize] = useState(sizes[0] || null);
  const [selectedColor, setSelectedColor] = useState(colors[0] || null);

  if (!sizes.length && !colors.length) return null;

  return (
    <section className="pdp-variants" aria-label="Product variants">
      {sizes.length > 0 && (
        <div className="pdp-variants__group">
          <p className="pdp-variants__label">Size</p>
          <div className="pdp-variants__options" role="listbox" aria-label="Size">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                role="option"
                aria-selected={selectedSize === size}
                className={`pdp-variants__chip${selectedSize === size ? " is-selected" : ""}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      {colors.length > 0 && (
        <div className="pdp-variants__group">
          <p className="pdp-variants__label">Color</p>
          <div className="pdp-variants__options" role="listbox" aria-label="Color">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                role="option"
                aria-selected={selectedColor === color}
                className={`pdp-variants__chip${selectedColor === color ? " is-selected" : ""}`}
                onClick={() => setSelectedColor(color)}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

const ProductVariants = ({ product, selection = {}, onSelect }) => {
  if (!productHasVariantSelector(product)) {
    return <LegacyProductVariants data={product} />;
  }

  const groups = sortOptionGroups(product.optionGroups);

  return (
    <section className="pdp-variants" aria-label="Product options">
      {groups.map((group) => (
        <div className="pdp-variants__group" key={group.id}>
          <p className="pdp-variants__label">{group.name}</p>
          <div
            className="pdp-variants__options"
            role="listbox"
            aria-label={group.name}
          >
            {(group.values || []).map((value) => {
              const state = getOptionValueState(product, group.id, value.id, selection);
              const isSelected = state === "selected";
              const isUnavailable = state === "unavailable";

              return (
                <button
                  key={value.id}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-disabled={isUnavailable}
                  disabled={isUnavailable}
                  className={`pdp-variants__chip${isSelected ? " is-selected" : ""}${
                    isUnavailable ? " is-unavailable" : ""
                  }`}
                  onClick={() => {
                    if (!isUnavailable) onSelect(group.id, value.id);
                  }}
                >
                  {value.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ProductVariants;
