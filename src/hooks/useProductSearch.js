import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../redux/actions/search";

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

export const shouldUseServerSearch = (searchParams) =>
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

export default function useProductSearch({
  searchParams,
  sortBy = "",
  selectedRating = 0,
  inStock = true,
  productType = "all",
}) {
  const dispatch = useDispatch();
  const { products, meta, isLoading, error } = useSelector((state) => state.search);

  const useServerSearch = useMemo(
    () => shouldUseServerSearch(searchParams),
    [searchParams]
  );

  const apiQuery = useMemo(() => {
    if (!useServerSearch) return null;

    return {
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
    };
  }, [useServerSearch, searchParams, sortBy, selectedRating, inStock, productType]);

  useEffect(() => {
    if (!apiQuery) return undefined;
    dispatch(searchProducts(apiQuery));
    return undefined;
  }, [dispatch, apiQuery]);

  return {
    useServerSearch,
    serverProducts: products,
    serverMeta: meta,
    serverLoading: isLoading,
    serverError: error,
  };
}
