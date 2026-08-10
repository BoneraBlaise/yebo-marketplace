import { getCartLineKey, normalizeCartItem } from "../../utils/cartLineIdentity";

const persistCart = (getState) => {
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cart));
};

const applyReferralCode = (cartItem) => {
  const referralProducts = JSON.parse(localStorage.getItem("referralProducts") || "{}");
  const productId = cartItem.productId || cartItem._id;
  if (referralProducts[productId]) {
    cartItem.referralCode = referralProducts[productId];
  }
  return cartItem;
};

export const addTocart = (data) => async (dispatch, getState) => {
  try {
    const cartItem = applyReferralCode(normalizeCartItem({ ...data }));

    dispatch({
      type: "addToCart",
      payload: cartItem,
    });

    persistCart(getState);
    return cartItem;
  } catch (error) {
    console.error("Error adding to cart:", error);
  }
};

export const setCartItemQuantity = (data, qty) => async (dispatch, getState) => {
  try {
    const cartItem = normalizeCartItem(data);
    dispatch({
      type: "setCartItemQuantity",
      payload: { item: cartItem, qty },
    });
    persistCart(getState);
    return cartItem;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
  }
};

export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: "removeFromCart",
    payload: data,
  });
  persistCart(getState);
  return data;
};

export const getCartLineKeyForItem = getCartLineKey;
