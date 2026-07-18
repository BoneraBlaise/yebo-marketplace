import axios from "axios";
import { server } from "../../config/serverConfig";

const buildSearchParams = (query = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return params.toString();
};

export const searchProducts = (query = {}) => async (dispatch) => {
  try {
    dispatch({ type: "searchProductsRequest" });

    const queryString = buildSearchParams(query);
    const { data } = await axios.get(`${server}/search/products?${queryString}`, {
      withCredentials: true,
    });

    dispatch({
      type: "searchProductsSuccess",
      payload: {
        products: data.products || [],
        meta: data.meta || {},
        query,
      },
    });

    return data;
  } catch (error) {
    dispatch({
      type: "searchProductsFailed",
      payload: error.response?.data?.message || error.message,
    });
    throw error;
  }
};

export const fetchSearchSuggestions = async (term, { limit = 8 } = {}) => {
  if (!term?.trim()) return [];

  const { data } = await axios.get(`${server}/search/suggestions`, {
    params: { q: term.trim(), limit },
    withCredentials: true,
  });

  return data.suggestions || [];
};

export const fetchSearchCategories = () => async (dispatch) => {
  try {
    dispatch({ type: "searchCategoriesRequest" });
    const { data } = await axios.get(`${server}/search/categories`, {
      withCredentials: true,
    });
    dispatch({
      type: "searchCategoriesSuccess",
      payload: data.categories || [],
    });
    return data.categories || [];
  } catch (error) {
    dispatch({
      type: "searchCategoriesFailed",
      payload: error.response?.data?.message || error.message,
    });
    return [];
  }
};
