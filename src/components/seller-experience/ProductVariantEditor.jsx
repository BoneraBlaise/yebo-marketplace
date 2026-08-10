import React, { useRef } from "react";
import InlineField from "./InlineField";
import {
  createOptionValueId,
  syncVariantsWithOptionValues,
} from "./productVariantPayload.mjs";

const ProductVariantEditor = ({ values, onChange, errors = {}, touched = {} }) => {
  const variantImageInputs = useRef({});

  const setValues = (patch) => onChange((prev) => ({ ...prev, ...patch }));

  const showError = (field) => (touched[field] ? errors[field] : undefined);

  const handleToggleVariants = (enabled) => {
    if (!enabled && values.hasVariants && values.variants?.length > 0) {
      const confirmed = window.confirm(
        "Switching to a flat product will remove variant configuration when you save. Continue?"
      );
      if (!confirmed) return;
    }

    if (enabled) {
      const initialValues = values.optionValues?.length
        ? values.optionValues
        : [""];
      const synced = syncVariantsWithOptionValues({
        optionValues: initialValues,
        optionValueIds: values.optionValueIds,
        variants: values.variants,
      });

      setValues({
        hasVariants: true,
        optionGroupName: values.optionGroupName || "Package",
        optionGroupId: values.optionGroupId || `opt_package_${Date.now()}`,
        optionValues: initialValues,
        ...synced,
      });
      return;
    }

    setValues({
      hasVariants: false,
      optionValues: [],
      optionValueIds: [],
      variants: [],
    });
  };

  const updateOptionValue = (index, label) => {
    const optionValues = [...(values.optionValues || [])];
    optionValues[index] = label;
    const synced = syncVariantsWithOptionValues({
      optionValues,
      optionValueIds: values.optionValueIds,
      variants: values.variants,
    });
    setValues({ optionValues, ...synced });
  };

  const addOptionValue = () => {
    const optionValues = [...(values.optionValues || []), ""];
    const optionValueIds = [...(values.optionValueIds || []), createOptionValueId("option", optionValues.length - 1)];
    const synced = syncVariantsWithOptionValues({
      optionValues,
      optionValueIds,
      variants: values.variants,
    });
    setValues({ optionValues, ...synced });
  };

  const removeOptionValue = (index) => {
    const optionValues = (values.optionValues || []).filter((_, i) => i !== index);
    const optionValueIds = (values.optionValueIds || []).filter((_, i) => i !== index);
    const synced = syncVariantsWithOptionValues({
      optionValues,
      optionValueIds,
      variants: (values.variants || []).filter((_, i) => i !== index),
    });
    setValues({ optionValues, optionValueIds, ...synced });
  };

  const updateVariant = (index, patch) => {
    const variants = (values.variants || []).map((variant, i) =>
      i === index ? { ...variant, ...patch } : variant
    );
    setValues({ variants });
  };

  const addVariantImages = (index, files) => {
    const list = Array.from(files || []);
    list.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState !== 2) return;
        onChange((prev) => ({
          ...prev,
          variants: (prev.variants || []).map((variant, i) =>
            i === index
              ? {
                  ...variant,
                  images: [...(variant.images || []), reader.result].slice(0, 3),
                }
              : variant
          ),
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    updateVariant(variantIndex, {
      images: (values.variants?.[variantIndex]?.images || []).filter((_, i) => i !== imageIndex),
    });
  };

  return (
    <div className="seller-xp-variant-editor">
      <fieldset className="seller-xp-variant-toggle">
        <legend className="seller-xp-variant-toggle__legend">Product options</legend>
        <label className="seller-xp-variant-toggle__option">
          <input
            type="radio"
            name="hasVariants"
            checked={!values.hasVariants}
            onChange={() => handleToggleVariants(false)}
          />
          <span>This product has no variants</span>
        </label>
        <label className="seller-xp-variant-toggle__option">
          <input
            type="radio"
            name="hasVariants"
            checked={Boolean(values.hasVariants)}
            onChange={() => handleToggleVariants(true)}
          />
          <span>This product has variants</span>
        </label>
      </fieldset>

      {values.hasVariants ? (
        <>
          <InlineField
            label="Option group name"
            required
            error={showError("optionGroupName")}
            htmlFor="option-group-name"
          >
            <input
              id="option-group-name"
              className={`seller-xp-input dark:text-white ${showError("optionGroupName") ? "has-error" : ""}`}
              value={values.optionGroupName || ""}
              onChange={(e) => setValues({ optionGroupName: e.target.value })}
              placeholder="e.g. Package, Size, Color"
            />
          </InlineField>

          <InlineField label="Option values" required error={showError("optionValues")}>
            <div className="seller-xp-variant-values">
              {(values.optionValues || []).map((label, index) => (
                <div key={values.optionValueIds?.[index] || index} className="seller-xp-variant-value-row">
                  <input
                    className="seller-xp-input dark:text-white"
                    value={label}
                    onChange={(e) => updateOptionValue(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    aria-label={`Option value ${index + 1}`}
                  />
                  <button
                    type="button"
                    className="seller-xp-variant-value-row__remove"
                    onClick={() => removeOptionValue(index)}
                    disabled={(values.optionValues || []).length <= 1}
                    aria-label="Remove option value"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" className="seller-xp-btn-secondary" onClick={addOptionValue}>
                + Add value
              </button>
            </div>
          </InlineField>

          <InlineField label="Variant rows" required error={showError("variants")}>
            <div className="seller-xp-variant-table-wrap">
              <table className="seller-xp-variant-table">
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>SKU</th>
                    <th>Price</th>
                    <th>Compare-at</th>
                    <th>Stock</th>
                    <th>Available</th>
                    <th>Images</th>
                  </tr>
                </thead>
                <tbody>
                  {(values.variants || []).map((variant, index) => (
                    <tr key={variant.id || variant.optionValueId || index}>
                      <td data-label="Variant">
                        <span className="seller-xp-variant-table__label">{variant.label || `Variant ${index + 1}`}</span>
                      </td>
                      <td data-label="SKU">
                        <input
                          className="seller-xp-input dark:text-white"
                          value={variant.sku}
                          onChange={(e) => updateVariant(index, { sku: e.target.value })}
                          placeholder="SKU"
                          aria-label={`SKU for ${variant.label || `variant ${index + 1}`}`}
                        />
                      </td>
                      <td data-label="Price">
                        <input
                          type="number"
                          min="0"
                          className="seller-xp-input dark:text-white"
                          value={variant.discountPrice}
                          onChange={(e) => updateVariant(index, { discountPrice: e.target.value })}
                          placeholder="RWF"
                          aria-label={`Price for ${variant.label || `variant ${index + 1}`}`}
                        />
                      </td>
                      <td data-label="Compare-at">
                        <input
                          type="number"
                          min="0"
                          className="seller-xp-input dark:text-white"
                          value={variant.originalPrice}
                          onChange={(e) => updateVariant(index, { originalPrice: e.target.value })}
                          placeholder="Optional"
                          aria-label={`Compare-at price for ${variant.label || `variant ${index + 1}`}`}
                        />
                      </td>
                      <td data-label="Stock">
                        <input
                          type="number"
                          min="0"
                          className="seller-xp-input dark:text-white"
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, { stock: e.target.value })}
                          placeholder="0"
                          aria-label={`Stock for ${variant.label || `variant ${index + 1}`}`}
                        />
                      </td>
                      <td data-label="Available">
                        <label className="seller-xp-variant-table__checkbox">
                          <input
                            type="checkbox"
                            checked={variant.isAvailable !== false}
                            onChange={(e) => updateVariant(index, { isAvailable: e.target.checked })}
                          />
                          <span>Yes</span>
                        </label>
                      </td>
                      <td data-label="Images">
                        <div className="seller-xp-variant-images">
                          <button
                            type="button"
                            className="seller-xp-btn-secondary seller-xp-variant-images__add"
                            onClick={() => variantImageInputs.current[index]?.click()}
                          >
                            Add
                          </button>
                          <input
                            ref={(el) => {
                              variantImageInputs.current[index] = el;
                            }}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => addVariantImages(index, e.target.files)}
                          />
                          {(variant.images || []).length > 0 && (
                            <div className="seller-xp-variant-images__thumbs">
                              {variant.images.map((src, imageIndex) => (
                                <div key={`${index}-${imageIndex}`} className="seller-xp-variant-images__thumb">
                                  <img src={src} alt="" />
                                  <button
                                    type="button"
                                    className="seller-xp-variant-images__remove"
                                    onClick={() => removeVariantImage(index, imageIndex)}
                                    aria-label="Remove variant image"
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="seller-xp-variant-hint">
              Parent listing price and stock are computed automatically from these variant rows.
            </p>
          </InlineField>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InlineField label="Original price" htmlFor="original-price">
              <input
                id="original-price"
                type="number"
                className="seller-xp-input dark:text-white"
                value={values.originalPrice}
                onChange={(e) => setValues({ originalPrice: e.target.value })}
                placeholder="RWF"
              />
            </InlineField>
            <InlineField label="Selling price" required error={showError("discountPrice")} htmlFor="discount-price">
              <input
                id="discount-price"
                type="number"
                className={`seller-xp-input dark:text-white ${showError("discountPrice") ? "has-error" : ""}`}
                value={values.discountPrice}
                onChange={(e) => setValues({ discountPrice: e.target.value })}
                placeholder="RWF"
              />
            </InlineField>
          </div>
          <InlineField label="Stock" required error={showError("stock")} htmlFor="product-stock">
            <input
              id="product-stock"
              type="number"
              className={`seller-xp-input dark:text-white ${showError("stock") ? "has-error" : ""}`}
              value={values.stock}
              onChange={(e) => setValues({ stock: e.target.value })}
              min="0"
            />
          </InlineField>
        </>
      )}
    </div>
  );
};

export default ProductVariantEditor;
