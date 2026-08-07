/**
 * Homepage Level 1 categories — curated display list (presentation only).
 * Product scope / chips remain in mainCategoryHierarchy MAIN_CATEGORIES.
 */
import { buildMainCategoryUrl } from "./mainCategoryHierarchy";
import { resolveCategoryPhoto } from "./categoryPhotoMap";

/** Exact homepage grid order — 15 categories only. */
export const HOME_DISPLAY_CATEGORIES = [
  { id: "phones", title: "Phones", href: buildMainCategoryUrl("Phones") },
  { id: "electronics", title: "Electronics", href: buildMainCategoryUrl("Electronics") },
  { id: "computers", title: "Computers", href: buildMainCategoryUrl("Computers") },
  { id: "fashion", title: "Fashion", href: buildMainCategoryUrl("Fashion") },
  { id: "beauty", title: "Beauty", href: buildMainCategoryUrl("Beauty") },
  {
    id: "home-furniture",
    title: "Home & Furniture",
    href: buildMainCategoryUrl("Home & Furniture"),
  },
  {
    id: "property",
    title: "Property",
    href: "/property-mobility?listingType=property",
    description: "Houses, apartments, land, and commercial property",
  },
  {
    id: "mobility",
    title: "Mobility",
    href: "/property-mobility?listingType=vehicle",
    description: "Cars, motorcycles, bicycles, parts, and accessories",
  },
  { id: "baby", title: "Baby", href: buildMainCategoryUrl("Baby") },
  { id: "gaming", title: "Gaming", href: buildMainCategoryUrl("Gaming") },
  { id: "cameras", title: "Cameras", href: buildMainCategoryUrl("Cameras") },
  {
    id: "sports-wear",
    title: "Sports Wear",
    href: "/products?search=sports+wear",
    description: "Activewear, athletic apparel, and performance clothing",
  },
  {
    id: "sports-accessories",
    title: "Sports Accessories",
    href: "/products?search=sports+accessories",
    description: "Gear, equipment, and sports accessories",
  },
  {
    id: "school-materials",
    title: "School Materials",
    href: buildMainCategoryUrl("Office & School"),
    description: "Stationery, writing supplies, and school essentials",
  },
  { id: "groceries", title: "Groceries", href: buildMainCategoryUrl("Groceries") },
];

export const HOME_MARKETPLACE_CATEGORIES = HOME_DISPLAY_CATEGORIES.map((category) => ({
  ...category,
  image: resolveCategoryPhoto(category.title),
}));

export { resolveCategoryPhoto } from "./categoryPhotoMap";
