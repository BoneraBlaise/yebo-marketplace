import React, { useRef } from "react";
import InlineField from "./InlineField";
import {
  MAX_VENDOR_OPTION_GROUPS,
  buildVariantLabel,
  createEmptyOptionGroup,
  createOptionValueId,
  syncVariantsWithOptionGroups,
} from "./productVariantPayload.mjs";

const CurrencyInput = ({ id, value, onChange, placeholder, error, required, label, secondary }) => (
  <div className={`seller-xp-currency-field ${secondary ? "is-secondary" : ""}`}>
    <label htmlFor={id} className="seller-xp-currency-field__label">
      {label}
      {required ? " *" : ""}
      {secondary ? <span className="seller-xp-currency-field__optional">Optional</span> : null}
    </label>
    <div className={`seller-xp-currency-input ${error ? "has-error" : ""}`}>
      <span className="seller-xp-currency-input__prefix" aria-hidden="true">
        RWF
      </span>
      <input
        id={id}
        type="number"
        min="0"
        className="seller-xp-currency-input__control dark:text-white"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
      />
    </div>
    {error ? (
      <p className="seller-xp-error" role="alert">
        {error}
      </p>
    ) : null}
  </div>
);

const VariantImages = ({ variant, index, variantImageInputs, onAdd, onRemove }) => (
  <div className="seller-xp-variant-images">
    <button
      type="button"
      className="seller-xp-btn-secondary seller-xp-variant-images__add"
      onClick={() => variantImageInputs.current[index]?.click()}
    >
      {variant.images?.length ? "Add more" : "Add images"}
    </button>
    <input
      ref={(el) => {
        variantImageInputs.current[index] = el;
      }}
      type="file"
      accept="image/*"
      multiple
      className="hidden"
      onChange={(e) => onAdd(index, e.target.files)}
    />
    {(variant.images || []).length > 0 ? (
      <div className="seller-xp-variant-images__thumbs">
        {variant.images.map((src, imageIndex) => (
          <div key={`${index}-${imageIndex}`} className="seller-xp-variant-images__thumb">
            <img src={src} alt="" />
            <button
              type="button"
              className="seller-xp-variant-images__remove"
              onClick={() => onRemove(index, imageIndex)}
              aria-label="Remove variant image"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    ) : null}
  </div>
);

const ProductVariantEditor = ({ values, onChange, errors = {}, touched = {} }) => {
  const variantImageInputs = useRef({});

  const setValues = (patch) => onChange((prev) => ({ ...prev, ...patch }));
  const optionGroups = values.optionGroups || [];

  const showError = (field) => (touched[field] ? errors[field] : undefined);
  const showVariantError = (index, field) =>
    touched.variants || touched[field] ? errors[field] : undefined;

  const resyncVariants = (nextGroups, nextVariants = values.variants, excluded = values.excludedCombinationKeys) =>
    syncVariantsWithOptionGroups({
      optionGroups: nextGroups,
      variants: nextVariants,
      excludedCombinationKeys: excluded || [],
    });

  const handleToggleVariants = (enabled) => {
    if (!enabled && values.hasVariants && values.variants?.length > 0) {
      const confirmed = window.confirm(
        "Switching to a flat product will remove variant configuration when you save. Continue?"
      );
      if (!confirmed) return;
    }

    if (enabled) {
      const initialGroups = optionGroups.length ? optionGroups : [createEmptyOptionGroup("Color")];
      const synced = resyncVariants(initialGroups, values.variants, []);
      setValues({
        hasVariants: true,
        ...synced,
      });
      return;
    }

    setValues({
      hasVariants: false,
      optionGroups: [],
      variants: [],
      excludedCombinationKeys: [],
    });
  };

  const updateOptionGroup = (groupIndex, patch) => {
    const nextGroups = optionGroups.map((group, index) =>
      index === groupIndex ? { ...group, ...patch } : group
    );
    setValues(resyncVariants(nextGroups));
  };

  const updateOptionValue = (groupIndex, valueIndex, label) => {
    const nextGroups = optionGroups.map((group, index) => {
      if (index !== groupIndex) return group;
      const valuesList = (group.values || []).map((value, i) =>
        i === valueIndex ? { ...value, label } : value
      );
      return { ...group, values: valuesList };
    });
    setValues(resyncVariants(nextGroups));
  };

  const addOptionValue = (groupIndex) => {
    const nextGroups = optionGroups.map((group, index) => {
      if (index !== groupIndex) return group;
      return {
        ...group,
        values: [
          ...(group.values || []),
          { id: createOptionValueId(group.name || "option", group.values?.length || 0), label: "" },
        ],
      };
    });
    setValues(resyncVariants(nextGroups));
  };

  const removeOptionValue = (groupIndex, valueIndex) => {
    const nextGroups = optionGroups.map((group, index) => {
      if (index !== groupIndex) return group;
      return {
        ...group,
        values: (group.values || []).filter((_, i) => i !== valueIndex),
      };
    });
    setValues(resyncVariants(nextGroups));
  };

  const addOptionGroup = () => {
    if (optionGroups.length >= MAX_VENDOR_OPTION_GROUPS) return;
    const nextGroups = [...optionGroups, createEmptyOptionGroup(optionGroups.length === 1 ? "Size" : "Option")];
    setValues(resyncVariants(nextGroups));
  };

  const removeOptionGroup = (groupIndex) => {
    if (optionGroups.length <= 1) return;
    const nextGroups = optionGroups.filter((_, index) => index !== groupIndex);
    setValues(resyncVariants(nextGroups, [], values.excludedCombinationKeys));
  };

  const updateVariant = (index, patch) => {
    const variants = (values.variants || []).map((variant, i) =>
      i === index ? { ...variant, ...patch } : variant
    );
    setValues({ variants });
  };

  const removeVariantCombination = (index) => {
    const variant = values.variants?.[index];
    if (!variant) return;
    const combinationKey = variant.combinationKey;
    const excluded = [...(values.excludedCombinationKeys || [])];
    if (combinationKey && !excluded.includes(combinationKey)) {
      excluded.push(combinationKey);
    }
    setValues(resyncVariants(optionGroups, values.variants, excluded));
  };

  const addVariantImages = (index, files) => {
    Array.from(files || []).forEach((file) => {
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

  const renderVariantOptionSummary = (variant, index) => {
    const groups = optionGroups || [];
    const lines = (variant.optionValueIds || []).map((valueId) => {
      for (const group of groups) {
        const value = (group.values || []).find((entry) => entry.id === valueId);
        if (value?.label) {
          return { group: group.name, label: value.label };
        }
      }
      return null;
    }).filter(Boolean);

    if (!lines.length) {
      return <p className="seller-xp-variant-card__combo">{variant.label || `Variant ${index + 1}`}</p>;
    }

    return (
      <div className="seller-xp-variant-card__combo-grid">
        {lines.map((line) => (
          <p key={`${variant.id}-${line.group}`} className="seller-xp-variant-card__combo-line">
            <span className="seller-xp-variant-card__combo-label">{line.group}:</span>
            <span>{line.label}</span>
          </p>
        ))}
      </div>
    );
  };

  const renderVariantFields = (variant, index) => {
    const priceError = showVariantError(index, `variantPrice_${index}`);
    const stockError = showVariantError(index, `variantStock_${index}`);
    const compareError = showVariantError(index, `variantCompare_${index}`);

    return (
      <>
        <CurrencyInput
          id={`variant-price-${index}`}
          label="Selling price"
          required
          value={variant.discountPrice}
          onChange={(e) => updateVariant(index, { discountPrice: e.target.value })}
          placeholder="0"
          error={priceError}
        />
        <CurrencyInput
          id={`variant-compare-${index}`}
          label="Compare-at price"
          secondary
          value={variant.originalPrice}
          onChange={(e) => updateVariant(index, { originalPrice: e.target.value })}
          placeholder="Optional"
          error={compareError}
        />
        <InlineField label="Stock" required error={stockError} htmlFor={`variant-stock-${index}`}>
          <input
            id={`variant-stock-${index}`}
            type="number"
            min="0"
            className={`seller-xp-input dark:text-white ${stockError ? "has-error" : ""}`}
            value={variant.stock}
            onChange={(e) => updateVariant(index, { stock: e.target.value })}
            placeholder="0"
          />
        </InlineField>
        <label className="seller-xp-variant-toggle-switch">
          <input
            type="checkbox"
            checked={variant.isAvailable !== false}
            onChange={(e) => updateVariant(index, { isAvailable: e.target.checked })}
          />
          <span>Available for sale</span>
        </label>
        <InlineField label="Images" hint="Optional — up to 3">
          <VariantImages
            variant={variant}
            index={index}
            variantImageInputs={variantImageInputs}
            onAdd={addVariantImages}
            onRemove={removeVariantImage}
          />
        </InlineField>
        {variant.sku ? (
          <p className="seller-xp-variant-sku">
            <span className="seller-xp-variant-sku__label">SKU</span>
            <code className="seller-xp-variant-sku__code">{variant.sku}</code>
          </p>
        ) : null}
      </>
    );
  };

  return (
    <div className="seller-xp-variant-editor">
      <div className="seller-xp-section">
        <h3 className="seller-xp-section__title">Product options</h3>
        <div className="seller-xp-segment" role="radiogroup" aria-label="Product options mode">
          <button
            type="button"
            role="radio"
            aria-checked={!values.hasVariants}
            className={`seller-xp-segment__option ${!values.hasVariants ? "is-active" : ""}`}
            onClick={() => handleToggleVariants(false)}
          >
            Single product
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={Boolean(values.hasVariants)}
            className={`seller-xp-segment__option ${values.hasVariants ? "is-active" : ""}`}
            onClick={() => handleToggleVariants(true)}
          >
            Has variants
          </button>
        </div>
      </div>

      {values.hasVariants ? (
        <>
          <div className="seller-xp-section">
            <div className="seller-xp-section__header">
              <h3 className="seller-xp-section__title">Option groups</h3>
              <p className="seller-xp-section__hint">
                Add groups like Color and Size. Variants are generated from every valid combination.
              </p>
            </div>
            {showError("optionGroups") ? (
              <p className="seller-xp-error" role="alert">
                {showError("optionGroups")}
              </p>
            ) : null}

            {optionGroups.map((group, groupIndex) => (
              <article key={group.id || groupIndex} className="seller-xp-option-group">
                <div className="seller-xp-option-group__header">
                  <InlineField
                    label={`Group ${groupIndex + 1}`}
                    required
                    error={showError(`optionGroupName_${groupIndex}`) || showError(`optionGroupValues_${groupIndex}`)}
                    htmlFor={`option-group-name-${groupIndex}`}
                  >
                    <input
                      id={`option-group-name-${groupIndex}`}
                      className={`seller-xp-input dark:text-white ${showError(`optionGroupName_${groupIndex}`) ? "has-error" : ""}`}
                      value={group.name || ""}
                      onChange={(e) => updateOptionGroup(groupIndex, { name: e.target.value })}
                      placeholder="e.g. Color, Size, Package"
                    />
                  </InlineField>
                  {optionGroups.length > 1 ? (
                    <button
                      type="button"
                      className="seller-xp-option-group__remove"
                      onClick={() => removeOptionGroup(groupIndex)}
                    >
                      Remove group
                    </button>
                  ) : null}
                </div>

                <div className="seller-xp-variant-values">
                  {(group.values || []).map((value, valueIndex) => (
                    <div key={value.id || valueIndex} className="seller-xp-variant-value-row">
                      <input
                        className={`seller-xp-input dark:text-white ${showError(`optionValue_${groupIndex}_${valueIndex}`) ? "has-error" : ""}`}
                        value={value.label || ""}
                        onChange={(e) => updateOptionValue(groupIndex, valueIndex, e.target.value)}
                        placeholder={`Value ${valueIndex + 1}`}
                        aria-label={`${group.name || "Option"} value ${valueIndex + 1}`}
                      />
                      <button
                        type="button"
                        className="seller-xp-variant-value-row__remove"
                        onClick={() => removeOptionValue(groupIndex, valueIndex)}
                        disabled={(group.values || []).length <= 1}
                        aria-label="Remove option value"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button type="button" className="seller-xp-btn-secondary" onClick={() => addOptionValue(groupIndex)}>
                    + Add value
                  </button>
                </div>
              </article>
            ))}

            {optionGroups.length < MAX_VENDOR_OPTION_GROUPS ? (
              <button type="button" className="seller-xp-btn-secondary" onClick={addOptionGroup}>
                + Add option group
              </button>
            ) : null}
          </div>

          <div className="seller-xp-section seller-xp-section--variants">
            <div className="seller-xp-section__header">
              <h3 className="seller-xp-section__title">Variants</h3>
              <p className="seller-xp-section__hint">
                {(values.variants || []).length} combination{(values.variants || []).length === 1 ? "" : "s"} · SKUs assigned automatically
              </p>
            </div>
            {showError("variants") ? (
              <p className="seller-xp-error seller-xp-section__error" role="alert">
                {showError("variants")}
              </p>
            ) : null}

            <div className="seller-xp-variant-list">
              {(values.variants || []).map((variant, index) => (
                <article key={variant.id || variant.combinationKey || index} className="seller-xp-variant-card">
                  <header className="seller-xp-variant-card__header">
                    <div>
                      <p className="seller-xp-variant-card__index">Variant {index + 1}</p>
                      <p className="seller-xp-variant-card__title">{variant.label || buildVariantLabel(optionGroups, variant.optionValueIds)}</p>
                      {renderVariantOptionSummary(variant, index)}
                    </div>
                    <button
                      type="button"
                      className="seller-xp-variant-card__remove"
                      onClick={() => removeVariantCombination(index)}
                      aria-label={`Remove ${variant.label || `variant ${index + 1}`}`}
                    >
                      Remove
                    </button>
                  </header>
                  <div className="seller-xp-variant-card__body">{renderVariantFields(variant, index)}</div>
                </article>
              ))}
            </div>

            <div className="seller-xp-variant-table-wrap seller-xp-variant-table-wrap--desktop">
              <table className="seller-xp-variant-table">
                <thead>
                  <tr>
                    <th>Variant</th>
                    <th>Selling price</th>
                    <th>Compare-at</th>
                    <th>Stock</th>
                    <th>Available</th>
                    <th>Images</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {(values.variants || []).map((variant, index) => (
                    <tr key={variant.id || variant.combinationKey || index}>
                      <td data-label="Variant">
                        <span className="seller-xp-variant-table__label">{variant.label}</span>
                        {variant.sku ? <code className="seller-xp-variant-table__sku">{variant.sku}</code> : null}
                      </td>
                      <td data-label="Selling price">
                        <input
                          type="number"
                          min="0"
                          className={`seller-xp-input dark:text-white ${showVariantError(index, `variantPrice_${index}`) ? "has-error" : ""}`}
                          value={variant.discountPrice}
                          onChange={(e) => updateVariant(index, { discountPrice: e.target.value })}
                          placeholder="RWF"
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
                        />
                      </td>
                      <td data-label="Stock">
                        <input
                          type="number"
                          min="0"
                          className={`seller-xp-input dark:text-white ${showVariantError(index, `variantStock_${index}`) ? "has-error" : ""}`}
                          value={variant.stock}
                          onChange={(e) => updateVariant(index, { stock: e.target.value })}
                          placeholder="0"
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
                        <VariantImages
                          variant={variant}
                          index={index}
                          variantImageInputs={variantImageInputs}
                          onAdd={addVariantImages}
                          onRemove={removeVariantImage}
                        />
                      </td>
                      <td data-label="Actions">
                        <button
                          type="button"
                          className="seller-xp-variant-card__remove seller-xp-variant-card__remove--inline"
                          onClick={() => removeVariantCombination(index)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="seller-xp-section">
          <h3 className="seller-xp-section__title">Pricing</h3>
          <div className="seller-xp-pricing-grid">
            <CurrencyInput
              id="discount-price"
              label="Selling price"
              required
              value={values.discountPrice}
              onChange={(e) => setValues({ discountPrice: e.target.value })}
              placeholder="0"
              error={showError("discountPrice")}
            />
            <CurrencyInput
              id="original-price"
              label="Compare-at price"
              secondary
              value={values.originalPrice}
              onChange={(e) => setValues({ originalPrice: e.target.value })}
              placeholder="Optional"
            />
          </div>
          <InlineField label="Stock" required error={showError("stock")} htmlFor="product-stock">
            <input
              id="product-stock"
              type="number"
              className={`seller-xp-input dark:text-white ${showError("stock") ? "has-error" : ""}`}
              value={values.stock}
              onChange={(e) => setValues({ stock: e.target.value })}
              min="0"
              placeholder="0"
            />
          </InlineField>
        </div>
      )}
    </div>
  );
};

export default ProductVariantEditor;
