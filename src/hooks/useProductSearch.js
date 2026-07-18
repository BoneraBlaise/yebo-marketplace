import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchProducts } from "../redux/actions/search";
import {
  buildSearchQueryFromParams,
  shouldUseServerSearch,
} from "../lib/searchQueryUtils.cjs";

export { shouldUseServerSearch };

export default function useProductSearch({
  searchParams,
  sortBy = "",
  selectedRating = 0,
  inStock = true,
  productType = "all",
}) {
  const dispatch = useDispatch();
  const { products, meta, isLoading, error } = useSelector((state) => state.search);
  const [slowNetwork, setSlowNetwork] = useState(false);

  const useServerSearch = useMemo(
    () => shouldUseServerSearch(searchParams),
    [searchParams]
  );

  const apiQuery = useMemo(() => {
    if (!useServerSearch) return null;
    return buildSearchQueryFromParams({
      searchParams,
      sortBy,
      selectedRating,
      inStock,
      productType,
    });
  }, [useServerSearch, searchParams, sortBy, selectedRating, inStock, productType]);

  const runSearch = useCallback(() => {
    if (!apiQuery) return;
    dispatch(searchProducts(apiQuery));
  }, [dispatch, apiQuery]);

  useEffect(() => {
    if (!apiQuery) return undefined;

    setSlowNetwork(false);
    const slowTimer = window.setTimeout(() => setSlowNetwork(true), 2500);
    runSearch();

    return () => window.clearTimeout(slowTimer);
  }, [apiQuery, runSearch]);

  return {
    useServerSearch,
    serverProducts: products,
    serverMeta: meta,
    serverLoading: isLoading,
    serverError: error,
    slowNetwork: isLoading && slowNetwork,
    retrySearch: runSearch,
  };
}
