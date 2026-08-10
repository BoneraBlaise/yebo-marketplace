import axios from "axios";
import { server } from "../../server";

export const createProduct = (payload) => async (dispatch) => {
  try {
    dispatch({
      type: "productCreateRequest",
    });

    const { data } = await axios.post(`${server}/product/create-product`, payload, {
      withCredentials: true,
    });
    dispatch({
      type: "productCreateSuccess",
      payload: data.product,
    });
    return { success: true, product: data.product };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to create product";
    dispatch({
      type: "productCreateFail",
      payload: message,
    });
    return { success: false, message };
  }
};

export const updateProduct = (productId, payload) => async (dispatch) => {
  try {
    dispatch({
      type: "productUpdateRequest",
    });

    const { data } = await axios.put(`${server}/product/update-product/${productId}`, payload, {
      withCredentials: true,
    });
    dispatch({
      type: "productUpdateSuccess",
      payload: data.product,
    });
    return { success: true, product: data.product };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to update product";
    dispatch({
      type: "productUpdateFail",
      payload: message,
    });
    return { success: false, message };
  }
};

export const getProductById = (productId) => async () => {
  try {
    const { data } = await axios.get(`${server}/product/get-product/${productId}`);
    return { success: true, product: data.product };
  } catch (error) {
    const message = error.response?.data?.message || "Failed to load product";
    return { success: false, message };
  }
};

// get All Products of a shop
export const getAllProductsShop = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsShopRequest",
    });

    const { data } = await axios.get(
      `${server}/product/get-all-products-shop/${id}`
    );
    dispatch({
      type: "getAllProductsShopSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsShopFailed",
      payload: error.response.data.message,
    });
  }
};

// delete product of a shop
export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteProductRequest",
    });

    const { data } = await axios.delete(
      `${server}/product/delete-shop-product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteProductSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteProductFailed",
      payload: error.response.data.message,
    });
  }
};

// get all products
export const getAllProducts = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllProductsRequest",
    });

    const { data } = await axios.get(`${server}/product/get-all-products`);
    dispatch({
      type: "getAllProductsSuccess",
      payload: data.products,
    });
  } catch (error) {
    dispatch({
      type: "getAllProductsFailed",
      payload: error.response.data.message,
    });
  }
};
