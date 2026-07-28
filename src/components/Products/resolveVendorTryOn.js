import { createCommerceEngine } from "../../ai/commerce";
import { AI_SERVICE } from "../../ai/commerce/CommerceTypes";

/** Resolve whether a vendor has YEBO AI Try-On enabled (presentation — uses existing commerce subscription state). */
export function isVendorTryOnSubscribed(vendorId, shop = {}, product = {}) {
  if (product?.ai_preview_type) return true;
  if (shop?.aiTryOnEnabled === true) return true;
  if (shop?.features?.aiTryOn === true) return true;
  if (shop?.growthCommerce?.aiPreview?.enabled === true) return true;

  if (!vendorId) return false;

  const commerce = createCommerceEngine({ vendorId: String(vendorId) });
  const explicit = commerce.subscription?.subscriptions?.has?.(String(vendorId));
  if (!explicit) return false;

  const sub = commerce.subscription.getSubscription(String(vendorId));
  const caps = sub?.plan?.capabilities || [];
  return sub?.active !== false && caps.includes(AI_SERVICE.PREVIEW);
}

export default isVendorTryOnSubscribed;
