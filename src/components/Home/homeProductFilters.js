import { getAIPicksProducts } from "./homeAIPicksFilters";
import { filterShowcaseCatalog, deprioritizeDemoCatalog } from "../../utils/catalogQuality";

const normalizeFlashSaleForCard = (item) => ({
  ...item,
  discountPrice: item.flashSalePrice ?? item.discountPrice ?? 0,
  originalPrice: item.originalPrice ?? 0,
  stock: item.stockAvailable ?? item.stock ?? 0,
  growthCommerce: {
    ...(item.growthCommerce || {}),
    promotionBadges: ["Flash Sale"],
  },
});

const curateProducts = (products, limit) =>
  filterShowcaseCatalog(products, { limit, minResults: Math.min(4, limit) });

export const getProductTabs = (isAuthenticated = false, flashSales = []) => {
  const tabs = [
    { id: "trending", label: "Trending" },
    { id: "new", label: "New Arrivals" },
  ];

  if (Array.isArray(flashSales) && flashSales.length > 0) {
    tabs.push({ id: "flash", label: "Flash Sale" });
  }

  if (isAuthenticated) {
    tabs.push({ id: "forYou", label: "For You" });
  } else {
    tabs.push({ id: "recommended", label: "Recommended" });
  }

  return tabs;
};

/** @deprecated Use getProductTabs(isAuthenticated) */
export const PRODUCT_TABS = getProductTabs(false);

export const getProductsByTab = (tab, allProducts = [], flashSales = []) => {
  if (tab === "flash") {
    return curateProducts(
      (Array.isArray(flashSales) ? flashSales : []).map(normalizeFlashSaleForCard),
      8
    );
  }

  if (!allProducts?.length) return [];

  const sorted = deprioritizeDemoCatalog([...allProducts]);

  switch (tab) {
    case "trending":
      return curateProducts(
        sorted.sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0)),
        8
      );
    case "new":
      return curateProducts(
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        8
      );
    case "popular":
      return curateProducts(
        sorted.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)),
        8
      );
    case "recommended":
      return curateProducts(sorted.filter((p) => p.featured), 8);
    case "forYou":
      return getAIPicksProducts(allProducts, 8);
    default:
      return curateProducts(sorted, 8);
  }
};

export const getDefaultProductTab = (isAuthenticated = false) =>
  isAuthenticated ? "forYou" : "trending";

export const getVerifiedVendors = (allProducts = [], limit = 6) => {
  const shopMap = new Map();

  allProducts.forEach((product) => {
    const shop = product?.shop;
    if (!shop?._id) return;

    const existing = shopMap.get(shop._id);
    if (existing) {
      existing.productCount += 1;
      if (product.images?.[0]?.url && existing.previewImages.length < 3) {
        existing.previewImages.push(product.images[0].url);
      }
    } else {
      shopMap.set(shop._id, {
        ...shop,
        productCount: 1,
        previewImages: product.images?.[0]?.url ? [product.images[0].url] : [],
      });
    }
  });

  return [...shopMap.values()]
    .filter((shop) => shop.isVerified)
    .sort((a, b) => b.productCount - a.productCount)
    .slice(0, limit);
};

export const getFeaturedVerifiedVendors = (allProducts = [], limit = 4) =>
  getVerifiedVendors(allProducts, limit);

export const getBrowseVerifiedVendors = (allProducts = [], limit = 16, excludeIds = []) => {
  const excluded = new Set(excludeIds);
  return getVerifiedVendors(allProducts, limit + excluded.size).filter(
    (shop) => !excluded.has(shop._id)
  ).slice(0, limit);
};
