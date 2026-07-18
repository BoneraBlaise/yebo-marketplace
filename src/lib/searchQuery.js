import axios from "axios";
import { server } from "../config/serverConfig";
import {
  buildSearchParams,
  buildSearchQueryFromParams,
  mapSortToApi,
  shouldUseServerSearch,
  SERVER_SEARCH_KEYS,
} from "./searchQueryUtils.cjs";

export {
  buildSearchParams,
  buildSearchQueryFromParams,
  mapSortToApi,
  shouldUseServerSearch,
  SERVER_SEARCH_KEYS,
};

export const requestSearchProducts = async (query = {}) => {
  const queryString = buildSearchParams(query);
  const { data } = await axios.get(`${server}/search/products?${queryString}`, {
    withCredentials: true,
  });
  return data;
};

export const requestSearchSuggestions = async (term, { limit = 8 } = {}) => {
  if (!term?.trim()) return [];
  const { data } = await axios.get(`${server}/search/suggestions`, {
    params: { q: term.trim(), limit },
    withCredentials: true,
  });
  return data.suggestions || [];
};
