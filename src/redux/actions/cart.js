import { toast } from "react-toastify";

// add to cart
export const addTocart = (data) => async (dispatch, getState) => {
  try {
    // Create cart item without referral code first
    const cartItem = { ...data };

    // Check if this product has a referral code in localStorage
    const referralProducts = JSON.parse(localStorage.getItem('referralProducts') || '{}');
    if (referralProducts[data._id]) {
      cartItem.referralCode = referralProducts[data._id];
      console.log(`Applied referral code ${referralProducts[data._id]} to cart item ${data._id}`);
    }

    dispatch({
      type: "addToCart",
      payload: cartItem,
    });

    localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
    return cartItem;
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

// remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data._id,
  });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
  return data;
};
