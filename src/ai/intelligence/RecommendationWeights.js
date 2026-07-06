/** Multi-factor recommendation weights — architecture only */

export const DEFAULT_WEIGHTS = {
  preference: 0.4,
  wishlist: 0.2,
  trending: 0.15,
  budget: 0.1,
  reviews: 0.1,
  vendor_quality: 0.05,
};

export const SURFACE_WEIGHTS = {
  homepage: { ...DEFAULT_WEIGHTS },
  search: { preference: 0.3, trending: 0.25, wishlist: 0.15, budget: 0.15, reviews: 0.1, vendor_quality: 0.05 },
  product: { preference: 0.35, wishlist: 0.2, reviews: 0.2, budget: 0.1, trending: 0.1, vendor_quality: 0.05 },
  cart: { wishlist: 0.25, preference: 0.3, budget: 0.2, reviews: 0.1, trending: 0.1, vendor_quality: 0.05 },
  checkout: { budget: 0.3, preference: 0.25, reviews: 0.2, wishlist: 0.15, trending: 0.05, vendor_quality: 0.05 },
};

export const getWeightsForScope = (scope) => SURFACE_WEIGHTS[scope] || DEFAULT_WEIGHTS;

export default DEFAULT_WEIGHTS;
