/**
 * Client-side product image presentation — Cloudinary transforms only.
 * Trims whitespace, pads to frame, never stretches (CSS object-fit: contain).
 */

const CLOUDINARY_MARKER = "res.cloudinary.com";
const UPLOAD_SEGMENT = "/image/upload/";

/** Presets: e_trim removes empty margins; c_pad preserves full product visibility */
export const PRODUCT_IMAGE_PRESETS = {
  /** 4:5 pad — full product visible, no crop */
  hero: "e_trim,c_pad,w_1800,h_2250,b_auto:predominant,f_auto,q_auto",
  thumb: "e_trim,c_pad,w_144,h_144,b_auto:predominant,f_auto,q_auto",
  /** Square pad for compact grid cards */
  card: "e_trim,c_pad,w_480,h_480,b_auto:predominant,f_auto,q_auto",
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
export function optimizeProductImage(url, preset = "hero") {
  if (!url || typeof url !== "string") return url || "";

  if (!url.includes(CLOUDINARY_MARKER) || !url.includes(UPLOAD_SEGMENT)) {
    return url;
  }

  const transform = PRODUCT_IMAGE_PRESETS[preset] || PRODUCT_IMAGE_PRESETS.hero;
  const [prefix, pathAfterUpload] = url.split(UPLOAD_SEGMENT);
  if (!pathAfterUpload) return url;

  if (pathAfterUpload.startsWith(transform)) return url;

  const assetPath = cloudinaryAssetPath(pathAfterUpload);
  return `${prefix}${UPLOAD_SEGMENT}${transform}/${assetPath}`;
}

/** Broadcast inbox unread refresh to header badges */
export function notifyInboxRefresh() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("inbox:refresh"));
  }
}
