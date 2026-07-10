/**
 * Homepage Level 1 categories — sourced from mainCategoryHierarchy.
 */
import { MAIN_CATEGORIES } from "./mainCategoryHierarchy";
import { resolveCategoryPhoto } from "./categoryPhotoMap";

export const HOME_MARKETPLACE_CATEGORIES = MAIN_CATEGORIES.map((category) => ({
  id: category.id,
  title: category.title,
  description: category.description,
  image: resolveCategoryPhoto(category.title),
}));

export { resolveCategoryPhoto } from "./categoryPhotoMap";
