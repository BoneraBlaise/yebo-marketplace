import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
};

export const productReducer = createReducer(initialState, {
  productCreateRequest: (state) => {
    state.isLoading = true;
    state.error = null;
    state.success = false;
  },
  productCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.error = null;
    state.product = action.payload;
    state.success = true;
    const created = action.payload;
    if (created?._id) {
      const upsert = (list) => {
        const arr = Array.isArray(list) ? list : [];
        return [created, ...arr.filter((item) => item._id !== created._id)];
      };
      state.products = upsert(state.products);
      state.allProducts = upsert(state.allProducts);
    }
  },
  productCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  productUpdateRequest: (state) => {
    state.isLoading = true;
    state.error = null;
    state.success = false;
  },
  productUpdateSuccess: (state, action) => {
    state.isLoading = false;
    state.error = null;
    state.product = action.payload;
    state.success = true;
    const updated = action.payload;
    if (updated?._id) {
      const upsert = (list) => {
        const arr = Array.isArray(list) ? list : [];
        return arr.map((item) => (item._id === updated._id ? updated : item));
      };
      state.products = upsert(state.products);
      state.allProducts = upsert(state.allProducts);
    }
  },
  productUpdateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  // get all products of shop
  getAllProductsShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllProductsShopSuccess: (state, action) => {
    state.isLoading = false;
    state.products = action.payload;
  },
  getAllProductsShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // delete product of a shop
  deleteProductRequest: (state) => {
    state.isLoading = true;
  },
  deleteProductSuccess: (state, action) => {
    state.isLoading = false;
    state.message = action.payload;
  },
  deleteProductFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all products
  getAllProductsRequest: (state) => {
    state.isLoading = true;
  },
  getAllProductsSuccess: (state, action) => {
    state.isLoading = false;
    state.allProducts = action.payload;
  },
  getAllProductsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  
  clearErrors: (state) => {
    state.error = null;
  },
});
