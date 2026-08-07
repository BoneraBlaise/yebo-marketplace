import { normalizeCategoryTitle } from "../components/Home/categoryPhotoMap";

/**
 * Product-card image fit strategy (4:5 frame preserved in CSS).
 * - packshot / catalog → object-fit: contain + padded premium background
 * - lifestyle / scene   → object-fit: cover
 */

const PACKSHOT_CATEGORY_HINTS = [
  "electronics",
  "computer",
  "phone",
  "laptop",
  "tablet",
  "monitor",
  "printer",
  "scanner",
  "network",
  "software",
  "accessory",
  "accessories",
  "gadget",
  "headphone",
  "earbud",
  "speaker",
  "charger",
  "cable",
  "camera",
  "lens",
  "dslr",
  "mirrorless",
  "gaming",
  "console",
  "smart home",
  "smartwatch",
  "watch accessory",
  "vr ",
  " ar ",
  "power bank",
  "bluetooth",
  "mobile",
  "sim card",
  "gimbal",
  "drone",
  "office equipment",
  "stationery",
  "writing supply",
  "school supply",
  "book",
  "magazine",
  "textbook",
  "toy",
  "game",
  "puzzle",
  "vitamin",
  "supplement",
  "medical equipment",
  "dental care",
  "beauty tool",
  "makeup",
  "skincare",
  "fragrance",
  "hair care",
  "nail care",
  "pet food",
  "pet supply",
  "diaper",
  "baby gear",
  "feeding bottle",
  "automotive",
  "car accessory",
  "car audio",
  "car electronics",
  "tire",
  "wheel",
  "motor oil",
  "brake",
  "engine",
  "component",
  "performance part",
  "storage",
  "keyboard",
  "mouse",
  "microphone",
  "audio",
  "packaged",
  "canned",
  "beverage",
  "snack",
  "groceries",
  "office",
  "instrument",
  "jewelry", // product shots on neutral backgrounds
  "watch",
  "ring",
  "necklace",
  "bracelet",
  "earring",
];

const LIFESTYLE_CATEGORY_HINTS = [
  "fashion",
  "clothing",
  "apparel",
  "dress",
  "jeans",
  "jacket",
  "outerwear",
  "suit",
  "blazer",
  "activewear",
  "lingerie",
  "sleepwear",
  "hoodie",
  "sweatshirt",
  "pant",
  "trouser",
  "short",
  "skirt",
  "swimwear",
  "formal wear",
  "undergarment",
  "shirt",
  "polo",
  "sweatshirt",
  "tee",
  "t-shirt",
  "top",
  "blouse",
  "apparel",
  "athletic",
  "training",
  "compression",
  "gym",
  "performance",
  "wear",
  "knit",
  "cardigan",
  "coat",
  "shoe",
  "footwear",
  "sneaker",
  "boot",
  "sandal",
  "loafer",
  "heel",
  "furniture",
  "decor",
  "living room",
  "bedroom",
  "dining",
  "kitchen",
  "mattress",
  "bedding",
  "outdoor furniture",
  "lighting",
  "rug",
  "flooring",
  "window treatment",
  "home & furniture",
  "home & living",
  "home decor",
  "vehicle",
  " car",
  "cars",
  "motorcycle",
  "property",
  "real estate",
  "cycling",
  "camping",
  "hiking",
  "yoga",
  "swimming",
  "climbing",
  "golf",
  "winter sport",
  "meat",
  "seafood",
  "bakery",
  "organic food",
  "fresh",
  "produce",
];

const PACKSHOT_NAME_HINTS = [
  "iphone",
  "samsung",
  "galaxy",
  "pixel",
  "macbook",
  "laptop",
  "tablet",
  "ipad",
  "headphone",
  "earbud",
  "airpod",
  "speaker",
  "charger",
  "cable",
  "adapter",
  "case",
  "screen protector",
  "power bank",
  "smartwatch",
  "watch",
  "camera",
  "lens",
  "console",
  "playstation",
  "xbox",
  "nintendo",
  "keyboard",
  "mouse",
  "monitor",
  "printer",
  "router",
  "modem",
  "drone",
  "gimbal",
  "microphone",
  "webcam",
  "usb",
  "hdmi",
  "bluetooth",
  "wireless",
  "gadget",
  "accessory",
  "box set",
  "boxed",
  "bundle",
  "kit",
  "pack of",
];

const LIFESTYLE_NAME_HINTS = [
  "sofa",
  "couch",
  "chair",
  "table",
  "bed frame",
  "wardrobe",
  "dresser",
  "rug",
  "curtain",
  "lamp",
  "outfit",
  "lookbook",
  "on model",
  "lifestyle",
  "interior",
  "living room",
  "bedroom set",
  "vehicle",
  " sedan",
  " suv",
  " truck",
  "property",
  "apartment",
  "villa",
  "house for",
];

const matchesAny = (haystack, needles) =>
  needles.some((needle) => haystack.includes(needle));

/**
 * @returns {{ mode: 'contain' | 'cover', variant: 'packshot' | 'lifestyle' }}
 */
export const resolveProductImageFit = (product) => {
  const category = normalizeCategoryTitle(product?.category || "");
  const subcategory = normalizeCategoryTitle(product?.subcategory || product?.subCategory || "");
  const name = normalizeCategoryTitle(product?.name || "");
  const combined = `${category} ${subcategory} ${name}`.trim();

  const lifestyleScore =
    (matchesAny(category, LIFESTYLE_CATEGORY_HINTS) ? 2 : 0) +
    (matchesAny(subcategory, LIFESTYLE_CATEGORY_HINTS) ? 2 : 0) +
    (matchesAny(name, LIFESTYLE_CATEGORY_HINTS) ? 2 : 0) +
    (matchesAny(name, LIFESTYLE_NAME_HINTS) ? 2 : 0);

  const packshotScore =
    (matchesAny(category, PACKSHOT_CATEGORY_HINTS) ? 2 : 0) +
    (matchesAny(subcategory, PACKSHOT_CATEGORY_HINTS) ? 2 : 0) +
    (matchesAny(name, PACKSHOT_NAME_HINTS) ? 2 : 0) +
    (matchesAny(combined, ["electronics", "phone", "computer", "accessory", "gadget"]) ? 1 : 0);

  if (lifestyleScore > packshotScore) {
    return { mode: "cover", variant: "lifestyle" };
  }

  if (packshotScore > 0 || lifestyleScore === 0) {
    return { mode: "contain", variant: "packshot" };
  }

  return { mode: "cover", variant: "lifestyle" };
};

export const getProductImageFitClassNames = (product) => {
  const { mode, variant } = resolveProductImageFit(product);
  return {
    mediaClass: `ypc__media--${variant}`,
    imgClass: `ypc__img--${mode}`,
    mode,
    variant,
  };
};
