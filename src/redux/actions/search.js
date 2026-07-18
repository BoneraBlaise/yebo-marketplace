import axios from "axios";
import { server } from "../../config/serverConfig";
import {
  buildSearchParams,
  requestSearchProducts,
  requestSearchSuggestions,
} from "../../lib/searchQuery";

export const searchProducts = (query = {}) => async (dispatch) => {
  try {
    dispatch({ type: "searchProductsRequest" });
    const data = await requestSearchProducts(query);

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

export const fetchSearchSuggestions = requestSearchSuggestions;

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

export { buildSearchParams };
