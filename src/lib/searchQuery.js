import axios from "axios";
import { server } from "../config/serverConfig";

const searchQueryUtils = require("./searchQueryUtils.cjs");

export const buildSearchParams = searchQueryUtils.buildSearchParams;
export const buildSearchQueryFromParams = searchQueryUtils.buildSearchQueryFromParams;
export const mapSortToApi = searchQueryUtils.mapSortToApi;
export const shouldUseServerSearch = searchQueryUtils.shouldUseServerSearch;
export const SERVER_SEARCH_KEYS = searchQueryUtils.SERVER_SEARCH_KEYS;

export const requestSearchProducts = async (query = {}) => {
  const queryString = buildSearchParams(query);
  try {
    const { data } = await axios.get(`${server}/marketplace/growth-commerce/search/enriched?${queryString}`, {
      withCredentials: true,
    });
    return data?.data || data;
  } catch (_error) {
    const { data } = await axios.get(`${server}/search/products?${queryString}`, {
      withCredentials: true,
    });
    return data;
  }
};

export const requestSearchSuggestions = async (term, { limit = 8 } = {}) => {
  if (!term?.trim()) return [];
  const { data } = await axios.get(`${server}/search/suggestions`, {
    params: { q: term.trim(), limit },
    withCredentials: true,
  });
  return data.suggestions || [];
};
