import React from "react";

const CartVariantSummary = ({ item, className = "" }) => {
  const options = Array.isArray(item?.selectedOptions) ? item.selectedOptions : [];
  if (!options.length && !item?.sku) return null;

  return (
    <div className={`pdp-cart-variant-summary${className ? ` ${className}` : ""}`}>
      {options.map((option) => (
        <p key={`${option.groupId}-${option.valueId}`} className="pdp-cart-variant-summary__line">
          <span className="pdp-cart-variant-summary__label">{option.groupName}:</span>{" "}
          {option.label}
        </p>
      ))}
      {item?.sku ? (
        <p className="pdp-cart-variant-summary__line">
          <span className="pdp-cart-variant-summary__label">SKU:</span> {item.sku}
        </p>
      ) : null}
    </div>
  );
};

export default CartVariantSummary;
