export const PLATFORM_CATEGORIES = [
  { id: "phones", label: "Phones" },
  { id: "fashion", label: "Fashion" },
  { id: "shoes", label: "Shoes" },
  { id: "furniture", label: "Furniture" },
  { id: "beauty", label: "Beauty" },
  { id: "gaming", label: "Gaming" },
  { id: "computers", label: "Computers" },
  { id: "events", label: "Events" },
  { id: "property", label: "Property" },
  { id: "mobility", label: "Mobility" },
  { id: "auction", label: "Auction" },
  { id: "flash_sale", label: "Flash Sale" },
];

export const AI_PRODUCT_CATALOG = [
  { id: "yebo_ai_search", name: "YEBO AI Search", icon: "search" },
  { id: "virtual_try_on", name: "Virtual Try-On", icon: "tryon" },
  { id: "ai_product_description", name: "AI Product Description", icon: "description" },
  { id: "ai_translation", name: "AI Translation", icon: "translation" },
  { id: "background_removal", name: "Background Removal", icon: "image" },
  { id: "image_upscaler", name: "Image Upscaler", icon: "upscale" },
  { id: "future_ai_modules", name: "Future AI Modules", icon: "future" },
];

export const BANNER_TYPES = [
  { id: "homepage_hero", label: "Homepage Hero" },
  { id: "property_banner", label: "Property Banner" },
  { id: "events_banner", label: "Events Banner" },
  { id: "flash_sale_banner", label: "Flash Sale Banner" },
  { id: "popup_banner", label: "Popup Banner" },
  { id: "category_banner", label: "Category Banner" },
  { id: "auction_banner", label: "Auction Banner" },
];

export const formatCategoryLabel = (id) =>
  PLATFORM_CATEGORIES.find((item) => item.id === id)?.label ||
  String(id || "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const formatCurrency = (value, currency = "RWF") => {
  const amount = Number(value || 0);
  return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};
