import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  commissionLoading: false,
  commissionStats: null,
  error: null,
};

export const orderReducer = createReducer(initialState, {
  // get all orders of user
  getAllOrdersUserRequest: (state) => {
    state.isLoading = true;
  },
  getAllOrdersUserSuccess: (state, action) => {
    state.isLoading = false;
    state.orders = action.payload;
  },
  getAllOrdersUserFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
  
  // get all orders of shop
  getAllOrdersShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllOrdersShopSuccess: (state, action) => {
    state.isLoading = false;
    state.orders = action.payload;
  },
  getAllOrdersShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // get all orders for admin
  adminAllOrdersRequest: (state) => {
    state.adminOrderLoading = true;
  },
  adminAllOrdersSuccess: (state, action) => {
    state.adminOrderLoading = false;
    state.adminOrders = action.payload;
  },
  adminAllOrdersFailed: (state, action) => {
    state.adminOrderLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },

  // Commission dashboard reducers
  getCommissionDashboardRequest: (state) => {
    state.commissionLoading = true;
  },
  getCommissionDashboardSuccess: (state, action) => {
    state.commissionLoading = false;
    state.commissionStats = action.payload;
  },
  getCommissionDashboardFail: (state, action) => {
    state.commissionLoading = false;
    state.error = action.payload;
  },

  // Join commission program reducers
  joinCommissionProgramRequest: (state) => {
    state.commissionLoading = true;
  },
  joinCommissionProgramSuccess: (state, action) => {
    state.commissionLoading = false;
    state.commission = action.payload;
  },
  joinCommissionProgramFail: (state, action) => {
    state.commissionLoading = false;
    state.error = action.payload;
  },

  // Share link reducers
  generateShareLinkRequest: (state) => {
    state.shareLinkLoading = true;
  },
  generateShareLinkSuccess: (state, action) => {
    state.shareLinkLoading = false;
    state.shareLink = action.payload;
  },
  generateShareLinkFail: (state, action) => {
    state.shareLinkLoading = false;
    state.error = action.payload;
  },
});
