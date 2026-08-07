/**
 * Client-side product image presentation — Cloudinary transforms only.
 * Trims whitespace, pads to frame, never stretches (CSS object-fit: contain).
 */

const CLOUDINARY_MARKER = "res.cloudinary.com";
const UPLOAD_SEGMENT = "/image/upload/";

/** Presets: e_trim removes empty margins; c_fit fills frame without embedded pad margins */
export const PRODUCT_IMAGE_PRESETS = {
  /** 4:5 pad — full product visible, no crop (PDP hero) */
  hero: "e_trim,c_pad,w_1800,h_2250,b_auto:predominant,f_auto,q_auto",
  thumb: "e_trim,c_fit,w_144,h_144,f_auto,q_auto",
  /** 4:5 tight fit — trim whitespace, scale product to frame (no c_pad margins) */
  card: "e_trim,c_fit,w_480,h_600,f_auto,q_auto",
  /** 4:5 fill — lifestyle photography, smart crop at source */
  cardLifestyle: "e_trim,c_fill,g_auto,w_480,h_600,f_auto,q_auto",
  lightbox: "e_trim,c_limit,w_2400,f_auto,q_auto",
  zoom: "e_trim,c_limit,w_2400,f_auto,q_auto",
};

/** Strip existing transformation segments, keep version + public_id path */
function cloudinaryAssetPath(pathAfterUpload) {
  const versionMatch = pathAfterUpload.match(/(v\d+\/.+)$/);
  if (versionMatch) return versionMatch[1];
  return pathAfterUpload;
}

/**
 * Apply Cloudinary smart transforms for premium auto-fit presentation.
 * Non-Cloudinary URLs pass through unchanged (CSS handles layout).
 */
export function optimizeProductImage(url, preset = "hero", options = {}) {
  if (!url || typeof url !== "string") return url || "";

  if (!url.includes(CLOUDINARY_MARKER) || !url.includes(UPLOAD_SEGMENT)) {
    return url;
  }

  let effectivePreset = preset;
  if (preset === "card" && options.fit === "cover") {
    effectivePreset = "cardLifestyle";
  }

  const transform =
    PRODUCT_IMAGE_PRESETS[effectivePreset] || PRODUCT_IMAGE_PRESETS.hero;
  const [prefix, pathAfterUpload] = url.split(UPLOAD_SEGMENT);
  if (!pathAfterUpload) return url;

  if (pathAfterUpload.startsWith(transform)) return url;

  const assetPath = cloudinaryAssetPath(pathAfterUpload);
  return `${prefix}${UPLOAD_SEGMENT}${transform}/${assetPath}`;
}

/**
 * If a Cloudinary transform URL fails, revert to the original upload URL (never a placeholder).
 */
export function handleProductImageError(event, rawUrl) {
  const img = event?.currentTarget;
  if (!img || !rawUrl || typeof rawUrl !== "string") return;
  if (img.dataset.fallbackApplied === "1") return;
  if (img.src === rawUrl || img.src.endsWith(rawUrl)) return;
  img.dataset.fallbackApplied = "1";
  img.src = rawUrl;
}

/** Broadcast inbox unread refresh to header badges */
export function notifyInboxRefresh(identity) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("inbox:refresh"));
  if (identity) {
    window.dispatchEvent(
      new CustomEvent("inbox:refresh:identity", { detail: { identity } })
    );
  }
}
