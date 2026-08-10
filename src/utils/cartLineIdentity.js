import {
  buildPhase4CartContext,
  getAvailableStock,
} from "./productVariantSelection.js";

export function getCartLineKey(item = {}) {
  const productId = String(item.productId || item._id || "");
  const variantId = item.variantId ? String(item.variantId) : "";
  return variantId ? `${productId}:${variantId}` : productId;
}

export function cartItemsMatch(a = {}, b = {}) {
  return getCartLineKey(a) === getCartLineKey(b);
}

export function normalizeCartItem(item = {}) {
  if (!item || (!item._id && !item.productId)) return item;

  const productId = item.productId || item._id;
  const normalized = {
    ...item,
    _id: productId,
    productId,
    cartLineKey: getCartLineKey({ ...item, productId }),
  };

  if (normalized.variantId) {
    normalized.hasVariants = true;
  }

  return normalized;
}

export function normalizeCartItems(items = []) {
  if (!Array.isArray(items)) return [];
  return items.map(normalizeCartItem);
}

export function buildVariantCartItem(product, variant, qty = 1) {
  const context = buildPhase4CartContext(product, variant, qty);
  const images = context.images?.length ? context.images : product.images || [];

  return normalizeCartItem({
    _id: product._id,
    productId: product._id,
    name: product.name,
    category: product.category,
    tags: product.tags,
    shop: product.shop,
    shopId: product.shopId || product.shop?._id,
    hasVariants: true,
    variantId: context.variantId,
    sku: context.sku,
    selectedOptionValueIds: context.selectedOptionValueIds,
    selectedOptions: context.selectedOptions,
    discountPrice: context.discountPrice,
    originalPrice: context.originalPrice,
    stock: getAvailableStock(variant),
    sold_out: variant?.sold_out || 0,
    isAvailable: variant?.isAvailable !== false,
    images,
    qty: Math.max(1, Number(qty) || 1),
  });
}

export function formatCartVariantSummary(item = {}) {
  const parts = [];

  if (Array.isArray(item.selectedOptions) && item.selectedOptions.length) {
    item.selectedOptions.forEach((option) => {
      if (option?.groupName && option?.label) {
        parts.push(`${option.groupName}: ${option.label}`);
      }
    });
  }

  if (item.sku) {
    parts.push(`SKU: ${item.sku}`);
  }

  return parts;
}

export function formatCartVariantSummaryText(item = {}) {
  return formatCartVariantSummary(item).join(" · ");
}
