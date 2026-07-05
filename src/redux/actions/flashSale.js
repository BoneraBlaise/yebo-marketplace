import axios from "axios";
import { server } from "../../server";

// Create Flash Sale
export const createFlashSale =
  ({
    name,
    description,
    category,
    tags,
    originalPrice,
    flashSalePrice,
    startTime,
    endTime,
    stockAvailable,
    discountPercentage,
    shopId,
    images,
  }) =>
  async (dispatch) => {
    try {
      dispatch({
        type: "flashSaleCreateRequest",
      });

      // Send a POST request to create a flash sale
      const { data } = await axios.post(
        `${server}/flashsale/create-flashsale`,
        {
          name,
          description,
          category,
          tags,
          originalPrice,
          flashSalePrice,
          startTime,
          endTime,
          stockAvailable,
          discountPercentage,
          shopId,
          images,
        }
      );

      dispatch({
        type: "flashSaleCreateSuccess",
        payload: data.flashSale,
      });
    } catch (error) {
      dispatch({
        type: "flashSaleCreateFail",
        payload: error.response?.data?.message || error.message,
      });
    }
  };


// Delete Flash Sale of a Shop
export const deleteFlashSale = (id) => async (dispatch) => {
  try {
    dispatch({
      type: "deleteFlashSaleRequest",
    });

    const { data } = await axios.delete(
      `${server}/flashsale/delete-flashsale/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch({
      type: "deleteFlashSaleSuccess",
      payload: data.message,
    });
  } catch (error) {
    dispatch({
      type: "deleteFlashSaleFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get All Flash Sales
export const getAllFlashSales = () => async (dispatch) => {
  try {
    dispatch({
      type: "getAllFlashSalesRequest",
    });

    const { data } = await axios.get(`${server}/flashsale/get-all-flashsales`);
    dispatch({
      type: "getAllFlashSalesSuccess",
      payload: data.flashSales,
    });
  } catch (error) {
    dispatch({
      type: "getAllFlashSalesFailed",
      payload: error.response?.data?.message || error.message,
    });
  }
};

// Get Flash Sale Details by ID
export const getFlashSaleDetails = (flashSaleId) => async (dispatch) => {
  try {
    console.log("Dispatching getFlashSaleDetailsRequest action...");

    // Dispatching request action
    dispatch({
      type: "getFlashSaleDetailsRequest",
    });

    // Log the API request details
    console.log(`Fetching Flash Sale details for ID: ${flashSaleId}`);

    // Send a GET request to fetch flash sale details by ID
    const { data } = await axios.get(`${server}/flashsale/get-flashsale/${flashSaleId}`);

    // Log the successful API response
    console.log("API response received: ", data.flashSaleProduct);

    // Dispatching success action with fetched data
    dispatch({
      type: "getFlashSaleDetailsSuccess",
      payload: data.flashSaleProduct, // assuming that the response contains a 'flashSaleProduct' object
    });

    // Log the successful dispatch
    console.log("Dispatched getFlashSaleDetailsSuccess with flashSale data:", data.flashSaleProduct);
  } catch (error) {
    // Log the error if any
    console.error("Error fetching Flash Sale details:", error);

    // Dispatching failure action with error message
    dispatch({
      type: "getFlashSaleDetailsFail",
      payload: error.response?.data?.message || error.message,
    });

    // Log the dispatched error
    console.log("Dispatched getFlashSaleDetailsFail with error message:", error.response?.data?.message || error.message);
  }
};

