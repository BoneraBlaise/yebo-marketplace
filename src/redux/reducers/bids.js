import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  success: false,
  error: null,
  activeBids: [], // Store active bids (auctions)
  completedBids: [], // Store completed bids (auctions)
  allBids: [],  
  sellerBids: [],  
  bidDetails: null, 
  winningBids: [], // Add this to store winning bids
};

// Reducer function for bid (auction) actions
export const bidReducer = createReducer(initialState, {
  // Create Bid (Auction)
  bidCreateRequest: (state) => {
    state.isLoading = true;
  },
  bidCreateSuccess: (state, action) => {
    state.isLoading = false;
    state.success = true;
    state.activeBids.push(action.payload); // Add the new bid (auction) to the active list
  },
  bidCreateFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
    state.success = false;
  },

  // Place Bid on an Auction
  placeBidRequest: (state) => {
    state.isLoading = true;
  },
  placeBidSuccess: (state, action) => {
    state.isLoading = false;
    // Optionally update the active bid status, e.g., increasing bid amounts
    const updatedBidIndex = state.activeBids.findIndex(
      (bid) => bid._id === action.payload._id
    );
    if (updatedBidIndex !== -1) {
      state.activeBids[updatedBidIndex] = action.payload; // Update bid with new data
    }
  },
  placeBidFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Get Active Bids (Auctions)
  getActiveBidsRequest: (state) => {
    state.isLoading = true;
  },
  getActiveBidsSuccess: (state, action) => {
    state.isLoading = false;
    state.activeBids = action.payload; // Store the list of active bids (auctions)
  },
  getActiveBidsFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Get Completed Bids (Auctions)
  getCompletedBidsRequest: (state) => {
    state.isLoading = true;
  },
  getCompletedBidsSuccess: (state, action) => {
    state.isLoading = false;
    state.completedBids = action.payload; // Store the list of completed bids (auctions)
  },
  getCompletedBidsFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Get All Bids (Active + Completed)
  getAllBidsRequest: (state) => {
    state.isLoading = true;
  },
  getAllBidsSuccess: (state, action) => {
    state.isLoading = false;
    state.allBids = action.payload; // Store the list of all bids (active + completed)
  },
  getAllBidsFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Get Bids by Seller
  getAllBidsBySellerRequest: (state) => {
    state.isLoading = true;
  },
  getAllBidsBySellerSuccess: (state, action) => {
    state.isLoading = false;
    state.sellerBids = action.payload; // Store the list of bids for the specific seller
  },
  getAllBidsBySellerFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Close Bid (Auction)
  closeBidRequest: (state) => {
    state.isLoading = true;
  },
  closeBidSuccess: (state, action) => {
    state.isLoading = false;
    // Move the closed bid to completedBids
    const closedBid = state.activeBids.find((bid) => bid._id === action.payload._id);
    if (closedBid) {
      state.completedBids.push(closedBid);
      state.activeBids = state.activeBids.filter((bid) => bid._id !== closedBid._id);
    }
  },
  closeBidFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },


  // Get Bid Details (specific bid)
  getBidDetailsRequest: (state) => {
    state.isLoading = true;
  },
  getBidDetailsSuccess: (state, action) => {
    state.isLoading = false;
    state.bidDetails = action.payload;  // This should be correctly storing the bid details
  },
  
  getBidDetailsFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },


  // Delete Bid (Auction)
  deleteBidRequest: (state) => {
    state.isLoading = true;
  },
  deleteBidSuccess: (state, action) => {
    state.isLoading = false;
    // Remove the deleted bid from either active or completed bids
    state.activeBids = state.activeBids.filter(
      (bid) => bid._id !== action.payload._id
    );
    state.completedBids = state.completedBids.filter(
      (bid) => bid._id !== action.payload._id
    );
  },
  deleteBidFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // Clear Errors
  clearErrors: (state) => {
    state.error = null;
  },

  // Add these cases for winning bids
  getMyWinningBidsRequest: (state) => {
    state.isLoading = true;
  },
  getMyWinningBidsSuccess: (state, action) => {
    state.isLoading = false;
    state.winningBids = action.payload;
  },
  getMyWinningBidsFail: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
});


