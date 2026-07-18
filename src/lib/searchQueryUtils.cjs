const SERVER_SEARCH_KEYS = [
  "search",
  "q",
  "category",
  "minPrice",
  "maxPrice",
  "priceMin",
  "priceMax",
  "shop",
  "brand",
  "sortBy",
  "page",
  "minRating",
  "inStock",
  "productType",
  "condition",
  "featured",
  "discounted",
];

const shouldUseServerSearch = (searchParams) =>
  SERVER_SEARCH_KEYS.some((key) => {
    const value = searchParams.get(key);
    return value !== null && value !== "";
  });

const mapSortToApi = (sortBy) => {
  switch (sortBy) {
    case "almostGone":
      return "almostGone";
    case "priceLowToHigh":
      return "priceLowToHigh";
    case "priceHighToLow":
      return "priceHighToLow";
    case "rating":
      return "rating";
    case "bestSelling":
      return "bestSelling";
    case "newest":
    default:
      return "newest";
  }
};

const buildSearchQueryFromParams = ({
  searchParams,
  sortBy = "",
  selectedRating = 0,
  inStock = true,
  productType = "all",
}) => ({
  q: searchParams.get("search") || searchParams.get("q") || "",
  category: searchParams.get("category") || undefined,
  brand: searchParams.get("brand") || undefined,
  shop: searchParams.get("shop") || undefined,
  minPrice: searchParams.get("minPrice") || searchParams.get("priceMin") || undefined,
  maxPrice: searchParams.get("maxPrice") || searchParams.get("priceMax") || undefined,
  condition: searchParams.get("condition") || undefined,
  productType: productType !== "all" ? productType : searchParams.get("productType") || undefined,
  minRating: selectedRating > 0 ? selectedRating : searchParams.get("minRating") || undefined,
  inStock: inStock ? "true" : "false",
  sort: mapSortToApi(sortBy || searchParams.get("sortBy") || "newest"),
  page: searchParams.get("page") || 1,
  limit: searchParams.get("limit") || 20,
});

const buildSearchParams = (query = {}) => {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });
  return params.toString();
};

module.exports = {
  SERVER_SEARCH_KEYS,
  shouldUseServerSearch,
  mapSortToApi,
  buildSearchQueryFromParams,
  buildSearchParams,
};
