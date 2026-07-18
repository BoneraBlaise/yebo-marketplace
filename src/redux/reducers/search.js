import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  products: [],
  meta: {},
  categories: [],
  error: null,
  lastQuery: null,
};

export const searchReducer = createReducer(initialState, {
  searchProductsRequest: (state) => {
    state.isLoading = true;
    state.error = null;
  },
  searchProductsSuccess: (state, action) => {
    state.isLoading = false;
    state.products = action.payload.products;
    state.meta = action.payload.meta;
    state.lastQuery = action.payload.query;
  },
  searchProductsFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  searchCategoriesRequest: (state) => {
    state.categoriesLoading = true;
  },
  searchCategoriesSuccess: (state, action) => {
    state.categoriesLoading = false;
    state.categories = action.payload;
  },
  searchCategoriesFailed: (state, action) => {
    state.categoriesLoading = false;
    state.categoriesError = action.payload;
  },
});
