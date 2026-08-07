import { resolveCategoryPhoto } from "../components/Home/categoryPhotoMap";
import { optimizeProductImage } from "./productImageUtils";
import { resolveProductImageFit } from "./productImageFit";

/** Patterns that indicate internal test / E2E catalog entries — not for showcase. */
const DEMO_NAME_PATTERNS = [
  /^e2e\b/i,
  /\be2e\b/i,
  /unified auth/i,
  /\btest product\b/i,
  /\bapi event\b/i,
  /\bdemo catalog\b/i,
  /\bplaceholder product\b/i,
];

export const isDemoCatalogName = (name = "") => {
  const value = String(name || "").trim();
  if (!value) return true;
  return DEMO_NAME_PATTERNS.some((pattern) => pattern.test(value));
};

export const isDemoCatalogItem = (item) => {
  if (!item) return true;
  const name = item.name || item.title || "";
  return isDemoCatalogName(name);
};

export const hasValidProductImage = (item) => {
  const url = item?.images?.[0]?.url;
  return Boolean(url && typeof url === "string" && /^https?:\/\//i.test(url));
};

export const normalizeCatalogNameKey = (name = "") =>
  String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

/** Remove duplicate titles — keeps first (best-ranked) occurrence. */
export const dedupeCatalogByName = (items = []) => {
  const seen = new Set();
  const result = [];

  items.forEach((item) => {
    const key = normalizeCatalogNameKey(item?.name || item?.title);
    if (!key || seen.has(key)) return;
    seen.add(key);
    result.push(item);
  });

  return result;
};

export const rankCatalogForShowcase = (items = []) =>
  [...items].sort((a, b) => {
    const aDemo = isDemoCatalogItem(a) ? 1 : 0;
    const bDemo = isDemoCatalogItem(b) ? 1 : 0;
    if (aDemo !== bDemo) return aDemo - bDemo;

    const aImg = hasValidProductImage(a) ? 1 : 0;
    const bImg = hasValidProductImage(b) ? 1 : 0;
    if (aImg !== bImg) return bImg - aImg;

    const aFeatured = a.featured ? 1 : 0;
    const bFeatured = b.featured ? 1 : 0;
    if (aFeatured !== bFeatured) return bFeatured - aFeatured;

    return (b.sold_out || 0) - (a.sold_out || 0);
  });

/**
 * Curate items for homepage rails, hero, and search suggestions.
 * Prefers production-quality names and images; dedupes titles.
 */
export const filterShowcaseCatalog = (items = [], { limit = 8, minResults = 3 } = {}) => {
  const ranked = rankCatalogForShowcase(dedupeCatalogByName(items));
  const production = ranked.filter((item) => !isDemoCatalogItem(item));
  const pool = production.length >= Math.min(minResults, limit) ? production : ranked;
  return pool.slice(0, limit);
};

/** Sort demo/test items to the end of browse grids without hiding seller inventory. */
export const deprioritizeDemoCatalog = (items = []) =>
  [...items].sort((a, b) => {
    const aDemo = isDemoCatalogItem(a) ? 1 : 0;
    const bDemo = isDemoCatalogItem(b) ? 1 : 0;
    return aDemo - bDemo;
  });

export const resolveProductDisplayImage = (product, preset = "card") => {
  const url = product?.images?.[0]?.url;
  const { mode } = resolveProductImageFit(product);
  if (url && hasValidProductImage(product)) {
    return optimizeProductImage(url, preset, { fit: mode });
  }
  return resolveCategoryPhoto(product?.category || product?.name || "fashion", url);
};

export const getVendorAvatarFallback = (shop) => {
  const initial = (shop?.name || "Y").charAt(0).toUpperCase();
  return `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" rx="16" fill="#29625d"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#fff" font-family="system-ui,sans-serif" font-size="32" font-weight="700">${initial}</text></svg>`
  )}`;
};

export const getVendorCoverFallback = () =>
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&h=400&q=80";
