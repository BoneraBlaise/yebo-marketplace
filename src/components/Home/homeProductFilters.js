export const PRODUCT_TABS = [
  { id: "trending", label: "Trending" },
  { id: "new", label: "New Arrivals" },
  { id: "popular", label: "Popular" },
  { id: "flash", label: "Flash Sale" },
  { id: "recommended", label: "Recommended" },
];

export const getProductsByTab = (tab, allProducts = [], flashSales = []) => {
  if (tab === "flash") {
    return Array.isArray(flashSales) ? flashSales.slice(0, 8) : [];
  }

  if (!allProducts?.length) return [];

  const sorted = [...allProducts];

  switch (tab) {
    case "trending":
      return sorted
        .sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0))
        .slice(0, 8);
    case "new":
      return sorted
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8);
    case "popular":
      return sorted
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
        .slice(0, 8);
    case "recommended":
      return sorted.filter((p) => p.featured).slice(0, 8);
    default:
      return sorted.slice(0, 8);
  }
};

export const getVerifiedVendors = (allProducts = [], limit = 6) => {
  const shopMap = new Map();

  allProducts.forEach((product) => {
    const shop = product?.shop;
    if (!shop?._id) return;

    const existing = shopMap.get(shop._id);
    if (existing) {
      existing.productCount += 1;
      if (product.images?.[0]?.url) existing.previewImages.push(product.images[0].url);
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
