import { hasValidProductImage, isDemoCatalogItem } from "./catalogQuality";

/** Categories / names that support AI virtual preview (presentation filter). */
const COMPATIBLE_PATTERNS = [
  /\bt-?shirts?\b/i,
  /\bhoodies?\b/i,
  /\bsweatshirts?\b/i,
  /\bjackets?\b/i,
  /\bouterwear\b/i,
  /\bdresses?\b/i,
  /\bjeans?\b/i,
  /\bpants?\b/i,
  /\btrousers?\b/i,
  /\bshorts?\b/i,
  /\bskirts?\b/i,
  /\bshoes?\b/i,
  /\bsneakers?\b/i,
  /\bboots?\b/i,
  /\bsandals?\b/i,
  /\bfootwear\b/i,
  /\bhats?\b/i,
  /\bcaps?\b/i,
  /\bglasses?\b/i,
  /\beyewear\b/i,
  /\bbags?\b/i,
  /\bwatches?\b/i,
  /\bsofas?\b/i,
  /\bcouches?\b/i,
  /\bchairs?\b/i,
  /\btables?\b/i,
  /\beds?\b/i,
  /\bcabinets?\b/i,
  /\bfurniture\b/i,
  /\bwallpaper\b/i,
  /\bcurtains?\b/i,
  /\brugs?\b/i,
  /\bpaint\b/i,
  /\bdecor/i,
  /\bliving room\b/i,
  /\bbedroom\b/i,
  /\bactivewear\b/i,
  /\bapparel\b/i,
  /\bclothing\b/i,
  /\bfashion\b/i,
  /\bpolo\b/i,
  /\bknit\b/i,
  /\bcompression\b/i,
  /\bteam sports\b/i,
  /\brunning\b/i,
  /\bjogging\b/i,
];

/** Never surface in AI try-on showcase. */
const EXCLUDED_PATTERNS = [
  /\bphone/i,
  /\bsmartphone/i,
  /\bmobile accessory/i,
  /\bcharger/i,
  /\bcable/i,
  /\belectronics?\b/i,
  /\bgrocery/i,
  /\bbook/i,
  /\bgaming\b/i,
  /\bvehicle/i,
  /\bcar part/i,
  /\bmotor/i,
  /\bengine/i,
  /\btire/i,
  /\bwheel/i,
  /\blaptop/i,
  /\btablet/i,
  /\bmonitor/i,
  /\bprinter/i,
  /\bnetwork/i,
  /\bsoftware\b/i,
  /\bstorage\b/i,
  /\bheadphone/i,
  /\bearbud/i,
  /\bspeaker/i,
  /\bpower bank/i,
  /\bsim card/i,
  /\bselfie stick/i,
  /\bcamera grip/i,
  /\btripod/i,
  /\bphone stand/i,
  /\bgimbal/i,
  /\baccessories?\b.*\bphone/i,
];

export const isAiPreviewCompatible = (product) => {
  if (!product || isDemoCatalogItem(product)) return false;
  if (product.ai_preview_type) return true;

  const haystack = `${product.category || ""} ${product.subCategory || product.subcategory || ""} ${product.name || ""}`;

  if (EXCLUDED_PATTERNS.some((pattern) => pattern.test(haystack))) return false;
  if (!hasValidProductImage(product)) return false;

  return COMPATIBLE_PATTERNS.some((pattern) => pattern.test(haystack));
};

export const getAiPreviewShortLabel = (product) => {
  const category = String(product?.category || "").toLowerCase();
  if (/hoodie|sweatshirt/i.test(category)) return "Hoodie";
  if (/jacket|outerwear/i.test(category)) return "Jacket";
  if (/t-shirt|tee|polo/i.test(category)) return "Tee";
  if (/shoe|sneaker|footwear/i.test(category)) return "Shoes";
  if (/sofa|couch/i.test(category)) return "Sofa";
  if (/chair/i.test(category)) return "Chair";
  if (/rug|floor/i.test(category)) return "Rug";
  if (/curtain|window/i.test(category)) return "Curtains";
  if (/wall/i.test(category)) return "Wallpaper";
  if (/bed/i.test(category)) return "Bed";
  if (/table/i.test(category)) return "Table";
  if (/running|jogging|active|sport|compression|team/i.test(category)) return "Activewear";
  return product?.category?.split(/[&/]/)[0]?.trim()?.slice(0, 12) || "Preview";
};

export const filterAiPreviewProducts = (products = [], { limit = 5 } = {}) =>
  products.filter(isAiPreviewCompatible).slice(0, limit);

/** Pick up to `limit` AI products, preferring diverse short labels (e.g. Shoes, Jacket). */
export const pickDiverseAiPreviewProducts = (
  products = [],
  { limit = 4, preferredLabels = ["Shoes", "Jacket", "Bag", "Watch", "Hoodie", "Tee"] } = {}
) => {
  const compatible = products.filter(isAiPreviewCompatible);
  const picked = [];
  const seenIds = new Set();

  const tryPick = (predicate) => {
    for (const product of compatible) {
      if (picked.length >= limit) return;
      if (seenIds.has(product._id)) continue;
      if (!predicate(product)) continue;
      picked.push(product);
      seenIds.add(product._id);
    }
  };

  for (const label of preferredLabels) {
    tryPick((product) => getAiPreviewShortLabel(product).toLowerCase() === label.toLowerCase());
  }

  tryPick(() => true);

  return picked.slice(0, limit);
};
