import yeboAIService from "../../services/yeboAIService";

/** Resolve whether a vendor has YEBO AI Try-On enabled via backend gateway. */
export async function isVendorTryOnSubscribed(vendorId, shop = {}, product = {}) {
  if (product?.ai_preview_type) return true;
  if (shop?.aiTryOnEnabled === true) return true;
  if (shop?.features?.aiTryOn === true) return true;
  if (shop?.growthCommerce?.aiPreview?.enabled === true) return true;

  if (!vendorId) return false;

  try {
    const response = await yeboAIService.getVendorSubscription();
    const sub = response?.data || response;
    return sub?.active !== false && (sub?.products || []).includes("virtual_try_on");
  } catch {
    return false;
  }
}

export default isVendorTryOnSubscribed;
