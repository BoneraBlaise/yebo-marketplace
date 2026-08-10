/**
 * Customer PDP variant selection helpers.
 * Uses Phase 1 product schema: optionGroups + variants.
 * No API calls — pure resolution from loaded product data.
 */

export function productHasVariantSelector(product) {
  return Boolean(
    product?.hasVariants &&
      Array.isArray(product.optionGroups) &&
      product.optionGroups.length > 0 &&
      Array.isArray(product.variants) &&
      product.variants.length > 0
  );
}

export function sortOptionGroups(optionGroups = []) {
  return [...optionGroups].sort(
    (a, b) => (Number(a.position) || 0) - (Number(b.position) || 0)
  );
}

export function createEmptySelection(optionGroups = []) {
  return sortOptionGroups(optionGroups).reduce((selection, group) => {
    selection[group.id] = null;
    return selection;
  }, {});
}

export function selectionFromVariant(optionGroups, variant) {
  const selection = createEmptySelection(optionGroups);
  if (!variant?.optionValueIds?.length) return selection;

  for (const group of sortOptionGroups(optionGroups)) {
    const matchedValueId = (group.values || []).find((value) =>
      variant.optionValueIds.includes(value.id)
    )?.id;
    if (matchedValueId) {
      selection[group.id] = matchedValueId;
    }
  }

  return selection;
}

export function getDefaultSelection(product) {
  if (!productHasVariantSelector(product)) return {};
  const groups = sortOptionGroups(product.optionGroups);
  const firstAvailable =
    product.variants.find((variant) => isVariantPurchasable(variant)) || product.variants[0];
  return selectionFromVariant(groups, firstAvailable);
}

export function selectionToOptionValueIds(optionGroups, selection = {}) {
  return sortOptionGroups(optionGroups)
    .map((group) => selection[group.id])
    .filter(Boolean);
}

export function isSelectionComplete(optionGroups, selection = {}) {
  const groups = sortOptionGroups(optionGroups);
  if (!groups.length) return false;
  return groups.every((group) => Boolean(selection[group.id]));
}

export function findVariantBySelection(product, selection = {}) {
  if (!productHasVariantSelector(product)) return null;
  const groups = sortOptionGroups(product.optionGroups);
  if (!isSelectionComplete(groups, selection)) return null;

  const selectedKey = selectionToOptionValueIds(groups, selection).slice().sort().join("|");
  return (
    product.variants.find((variant) => {
      const variantKey = (variant.optionValueIds || []).slice().sort().join("|");
      return variantKey === selectedKey;
    }) || null
  );
}

export function isVariantPurchasable(variant) {
  if (!variant || variant.isAvailable === false) return false;
  const stock = Number(variant.stock);
  const soldOut = Number(variant.sold_out || 0);
  return Number.isFinite(stock) && stock > soldOut && stock > 0;
}

export function getAvailableStock(variant) {
  if (!variant) return 0;
  const stock = Math.max(0, Number(variant.stock) || 0);
  const soldOut = Math.max(0, Number(variant.sold_out) || 0);
  return Math.max(0, stock - soldOut);
}

export function getResolvedOffer(product, variant = null) {
  if (variant?.id) {
    const groups = sortOptionGroups(product?.optionGroups || []);
    const selectedOptions = (variant.optionValueIds || [])
      .map((valueId) => {
        for (const group of groups) {
          const value = (group.values || []).find((entry) => entry.id === valueId);
          if (value) {
            return {
              groupId: group.id,
              groupName: group.name,
              valueId,
              label: value.label,
            };
          }
        }
        return null;
      })
      .filter(Boolean);

    return {
      discountPrice: variant.discountPrice,
      originalPrice: variant.originalPrice,
      stock: variant.stock,
      sold_out: variant.sold_out || 0,
      isAvailable: variant.isAvailable !== false,
      variantId: variant.id,
      sku: variant.sku,
      selectedOptionValueIds: variant.optionValueIds || [],
      selectedOptions,
    };
  }

  if (!productHasVariantSelector(product)) {
    return {
      discountPrice: product?.discountPrice,
      originalPrice: product?.originalPrice,
      stock: product?.stock,
      sold_out: product?.sold_out || 0,
      isAvailable: true,
      variantId: null,
      sku: null,
      selectedOptionValueIds: [],
      selectedOptions: [],
    };
  }

  if (!variant) {
    return {
      discountPrice: product.discountPrice,
      originalPrice: product.originalPrice,
      stock: product.stock,
      sold_out: product.sold_out || 0,
      isAvailable: false,
      variantId: null,
      sku: null,
      selectedOptionValueIds: [],
      selectedOptions: [],
    };
  }

  const groups = sortOptionGroups(product.optionGroups);
  const selectedOptions = (variant.optionValueIds || [])
    .map((valueId) => {
      for (const group of groups) {
        const value = (group.values || []).find((entry) => entry.id === valueId);
        if (value) {
          return { groupId: group.id, groupName: group.name, valueId, label: value.label };
        }
      }
      return null;
    })
    .filter(Boolean);

  return {
    discountPrice: variant.discountPrice,
    originalPrice: variant.originalPrice,
    stock: variant.stock,
    sold_out: variant.sold_out || 0,
    isAvailable: variant.isAvailable !== false,
    variantId: variant.id,
    sku: variant.sku,
    selectedOptionValueIds: variant.optionValueIds || [],
    selectedOptions,
  };
}

export function getDisplayImages(product, variant = null) {
  if (variant?.images?.length) {
    return variant.images;
  }
  return product?.images || [];
}

export function isOptionValueSelectable(product, groupId, valueId, selection = {}) {
  if (!productHasVariantSelector(product)) return false;
  const groups = sortOptionGroups(product.optionGroups);
  const nextSelection = { ...selection, [groupId]: valueId };

  return product.variants.some((variant) => {
    const optionValueIds = variant.optionValueIds || [];
    if (!optionValueIds.includes(valueId)) return false;

    return groups.every((group) => {
      const selectedValueId = nextSelection[group.id];
      if (!selectedValueId) return true;
      return optionValueIds.includes(selectedValueId);
    });
  });
}

export function getOptionValueState(product, groupId, valueId, selection = {}) {
  if (!isOptionValueSelectable(product, groupId, valueId, selection)) {
    return "unavailable";
  }

  if (selection[groupId] === valueId) {
    return "selected";
  }

  const groups = sortOptionGroups(product.optionGroups);
  const nextSelection = { ...selection, [groupId]: valueId };
  if (isSelectionComplete(groups, nextSelection)) {
    const variant = findVariantBySelection(product, nextSelection);
    if (!variant || variant.isAvailable === false || getAvailableStock(variant) <= 0) {
      return "unavailable";
    }
  }

  return "available";
}

/** Phase 4 cart integration: attach selectedVariant + offer to cart line payload. */
export function buildPhase4CartContext(product, variant, qty = 1) {
  const offer = getResolvedOffer(product, variant);
  return {
    productId: product?._id,
    variantId: offer.variantId,
    sku: offer.sku,
    qty,
    selectedOptionValueIds: offer.selectedOptionValueIds,
    selectedOptions: offer.selectedOptions,
    discountPrice: offer.discountPrice,
    originalPrice: offer.originalPrice,
    stock: offer.stock,
    images: getDisplayImages(product, variant),
  };
}
