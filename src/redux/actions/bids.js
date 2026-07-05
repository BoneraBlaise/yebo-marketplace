import axios from "axios";
import { server } from "../../server";

// Create Bid (Auction)
export const createBid = ({
  name,
  description,
  category,
  tags,
  originalPrice,
  startingBid,
  auctionEndTime,
  stock,
  shopId,
  images,
}) => async (dispatch) => {
  try {
    dispatch({ type: "bidCreateRequest" });

    // Send a POST request to create a bid (auction)
    const { data } = await axios.post(
      `${server}/bids/create-bid`,
      {
        name,
        description,
        category,
        tags,
        originalPrice,
        startingBid,
        auctionEndTime,
        stock,
        shopId,
        images,
      },
      { withCredentials: true }  // Ensure authenticated if needed
    );

    dispatch({
      type: "bidCreateSuccess",
      payload: data.auctionBid,  // Returning the auctionBid from the controller
    });
  } catch (error) {
    dispatch({
      type: "bidCreateFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Place a Bid on an Auction
export const placeBid = (bidId, bidAmount) => async (dispatch) => {
  try {
    dispatch({ type: "placeBidRequest" });

    // Send a POST request to place a bid
    const { data } = await axios.post(
      `${server}/bids/place-bid/${bidId}`,
      { bidAmount },
      { withCredentials: true }
    );

    dispatch({
      type: "placeBidSuccess",
      payload: data.auctionBid,  // Returning updated auctionBid
    });
  } catch (error) {
    dispatch({
      type: "placeBidFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Active Bids (Auctions)
export const getActiveBids = () => async (dispatch) => {
  try {
    dispatch({ type: "getActiveBidsRequest" });

    const { data } = await axios.get(`${server}/bids/active-bids`);

    dispatch({
      type: "getActiveBidsSuccess",
      payload: data.activeBids,  // Returning activeBids from the controller
    });
  } catch (error) {
    dispatch({
      type: "getActiveBidsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Completed Bids (Auctions)
export const getCompletedBids = () => async (dispatch) => {
  try {
    dispatch({ type: "getCompletedBidsRequest" });

    const { data } = await axios.get(`${server}/bids/completed-bids`);
    console.log('Fetched Bids:', data.activeBids);
    dispatch({
      type: "getCompletedBidsSuccess",
      payload: data.completedBids,  // Returning completedBids from the controller
    });
  } catch (error) {
    dispatch({
      type: "getCompletedBidsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Updated getAllBids action with seller ID parameter
export const getAllBidsBySeller = (sellerId) => async (dispatch) => {
  try {
    dispatch({ type: "getAllBidsBySellerRequest" });

    // Fetch only the bids for the specified seller
    const { data } = await axios.get(`${server}/bids/all-bids/${sellerId}`, {
      withCredentials: true,
    });
    console.log('Available bids:', data.allBids,)

    if (!data.allBids || data.allBids.length === 0) {
      dispatch({
        type: "getAllBidsBySellerFail",
        payload: "No bids found for this seller.",
      });
      return;
    }

    dispatch({
      type: "getAllBidsBySellerSuccess",
      payload: data.allBids,
    });
  } catch (error) {
    dispatch({
      type: "getAllBidsBySellerFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};
// Updated getAllBids action with seller ID parameter
export const getAllBids = () => async (dispatch) => {
  try {
    dispatch({ type: "getAllBidsRequest" });

    // Fetch only the bids for the specified seller
    const { data } = await axios.get(`${server}/bids/all-bids`, {
      withCredentials: true,
    });

    if (!data.allBids || data.allBids.length === 0) {
      dispatch({
        type: "getAllBidsFail",
        payload: "No bids found for this seller.",
      });
      return;
    }

    dispatch({
      type: "getAllBidsSuccess",
      payload: data.allBids,
    });
  } catch (error) {
    dispatch({
      type: "getAllBidsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};


// Close an Auction (Bid)
export const closeBid = (bidId) => async (dispatch) => {
  try {
    dispatch({ type: "closeBidRequest" });

    // Send a POST request to close the auction
    const { data } = await axios.post(
      `${server}/bids/close-bid/${bidId}`,
      {},
      { withCredentials: true }  // Ensure user is authenticated and authorized
    );

    dispatch({
      type: "closeBidSuccess",
      payload: data.message,  // Returning message from the controller
    });
  } catch (error) {
    dispatch({
      type: "closeBidFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Delete a Bid (Auction)
export const deleteBid = (bidId) => async (dispatch) => {
  try {
    dispatch({ type: "deleteBidRequest" });

    // Send a DELETE request to delete a bid
    const { data } = await axios.delete(
      `${server}/bids/delete-bid/${bidId}`,
      { withCredentials: true }
    );

    dispatch({
      type: "deleteBidSuccess",
      payload: data.message,  // Returning message from the controller
    });
  } catch (error) {
    dispatch({
      type: "deleteBidFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const getBidDetails = (bidId) => async (dispatch) => {
  try {
    dispatch({ type: "getBidDetailsRequest" });

    const { data } = await axios.get(`${server}/bids/bid-details/${bidId}`);
    console.log('Fetched Bid Details:', data); // Log response data to verify it is fetched correctly

    if (!data.auctionBid) {
      throw new Error('Bid not found');
    }

    dispatch({
      type: "getBidDetailsSuccess",
      payload: data.auctionBid,
    });
  } catch (error) {
    dispatch({
      type: "getBidDetailsFail",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get user's winning bids
export const getMyWinningBids = () => async (dispatch) => {
  try {
    dispatch({ type: "getMyWinningBidsRequest" });

    const { data } = await axios.get(`${server}/bids/my-winning-bids`, {
      withCredentials: true
    });

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch winning bids");
    }

    console.log("Winning bids fetched successfully:", data.winningBids);
    
    dispatch({
      type: "getMyWinningBidsSuccess",
      payload: data.winningBids
    });
  } catch (error) {
    console.error("Error fetching winning bids:", error);
    dispatch({
      type: "getMyWinningBidsFail",
      payload: error.response?.data?.message || error.message
    });
  }
};
