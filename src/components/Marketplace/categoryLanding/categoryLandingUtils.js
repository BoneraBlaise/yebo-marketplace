import { categoriesData } from "../../../static/data";

const buildDescription = (title, subTitle) => {
  if (subTitle) {
    return `Explore ${subTitle.toLowerCase()} from verified sellers across Africa.`;
  }
  return `Explore thousands of ${title.toLowerCase()} products from verified sellers across Africa.`;
};

export const resolveCategoryContext = (categoryParam) => {
  if (!categoryParam) return null;

  const parent = categoriesData.find((c) => c.title === categoryParam);
  if (parent) {
    const subTitles = parent.subcategories?.map((s) => s.title) || [];
    return {
      type: "parent",
      parent,
      title: parent.title,
      description: buildDescription(parent.title, parent.subTitle),
      imageUrl: parent.image_Url,
      shortcuts: parent.subcategories || [],
      matchTitles: [parent.title, ...subTitles],
      breadcrumbs: [
        { label: "Home", to: "/" },
        { label: "Marketplace", to: "/products" },
        { label: parent.title },
      ],
    };
  }

  for (const cat of categoriesData) {
    const sub = cat.subcategories?.find((s) => s.title === categoryParam);
    if (sub) {
      return {
        type: "sub",
        parent: cat,
        sub,
        title: sub.title,
        description: `Shop ${sub.title} in ${cat.title} from verified sellers across Africa.`,
        imageUrl: sub.image_Url || cat.image_Url,
        shortcuts: cat.subcategories || [],
        matchTitles: [sub.title],
        breadcrumbs: [
          { label: "Home", to: "/" },
          { label: "Marketplace", to: "/products" },
          { label: cat.title, to: `/products?category=${encodeURIComponent(cat.title)}` },
          { label: sub.title },
        ],
      };
    }
  }

  return {
    type: "unknown",
    title: categoryParam,
    description: buildDescription(categoryParam, ""),
    imageUrl: null,
    shortcuts: [],
    matchTitles: [categoryParam],
    breadcrumbs: [
      { label: "Home", to: "/" },
      { label: "Marketplace", to: "/products" },
      { label: categoryParam },
    ],
  };
};

export const matchesCategoryScope = (product, matchTitles) => {
  if (!matchTitles?.length) return true;
  const category = product?.category?.toLowerCase();
  if (!category) return false;
  return matchTitles.some((title) => title.toLowerCase() === category);
};

export const getCategoryBaseProducts = (products, matchTitles) =>
  products.filter((product) => matchesCategoryScope(product, matchTitles));

export const formatProductCount = (count) => {
  const value = Number(count) || 0;
  return `${value.toLocaleString()} ${value === 1 ? "product" : "products"}`;
};

const sortBySold = (items) =>
  [...items].sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0));

const sortByNew = (items) =>
  [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

const sortByRating = (items) =>
  [...items].sort((a, b) => (b.ratings || 0) - (a.ratings || 0));

const sortByLikes = (items) =>
  [...items].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));

const sortByDeals = (items) =>
  [...items].sort((a, b) => {
    const discountA = (a.originalPrice || a.price || 0) - (a.discountPrice || 0);
    const discountB = (b.originalPrice || b.price || 0) - (b.discountPrice || 0);
    return discountB - discountA;
  });

export const COLLECTION_DEFINITIONS = [
  { id: "trending", label: "Trending", sort: sortBySold },
  { id: "popular", label: "Most Popular", sort: sortByLikes },
  { id: "new", label: "New Arrivals", sort: sortByNew },
  { id: "rated", label: "Best Rated", sort: sortByRating },
  { id: "deals", label: "Top Deals", sort: sortByDeals },
  { id: "recommended", label: "Recommended", sort: (items) => items.filter((p) => p.featured).concat(items.filter((p) => !p.featured)) },
];

export const buildCategoryCollections = (products, limit = 8) =>
  COLLECTION_DEFINITIONS.map((def) => ({
    ...def,
    products: def.sort([...products]).slice(0, limit),
  })).filter((collection) => collection.products.length > 0);

export const getVerifiedSellerProducts = (products, limit = 8) =>
  products.filter((p) => p?.shop?.isVerified).slice(0, limit);

export const getAlternativeCategories = (currentTitle, limit = 6) =>
  categoriesData
    .filter((c) => c.title !== currentTitle)
    .slice(0, limit)
    .map((c) => ({
      title: c.title,
      to: `/products?category=${encodeURIComponent(c.title)}`,
      imageUrl: c.image_Url,
    }));
