import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  success: false,
  error: null,
  flashSales: [], 
  flashSale: {}, 
};

// Reducer function for flash sale actions
export const flashSaleReducer = createReducer(initialState, {
  // Create Flash Sale
  flashSaleCreateRequest: (state) => {
    state.isLoading = true;
  },
  flashSaleCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.success = true;
    state.flashSales.push(action.payload); // Add the new flash sale to the list
  },
  flashSaleCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  // Delete Flash Sale
  deleteFlashSaleRequest: (state) => {
    state.isLoading = true;
  },
  deleteFlashSaleSuccess: (state, action) => {
    state.isLoading = false;
    state.flashSales = state.flashSales.filter(
      (flashSale) => flashSale._id !== action.payload._id // Remove the deleted flash sale
    );
  },
  deleteFlashSaleFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Get All Flash Sales
  getAllFlashSalesRequest: (state) => {
    state.isLoading = true;
  },
  getAllFlashSalesSuccess: (state, action) => {
    state.isLoading = false;
    state.flashSales = action.payload; // Store the list of all flash sales
  },
  getAllFlashSalesFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

   // Get Flash Sale Details
   getFlashSaleDetailsRequest: (state) => {
    state.isLoading = true;
  },
  getFlashSaleDetailsSuccess: (state, action) => {
    state.isLoading = false;
    state.flashSale = action.payload; // Store the details of the specific flash sale
  },
  getFlashSaleDetailsFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  // Clear Errors
  clearErrors: (state) => {
    state.error = null;
  },
});
