import { createReducer } from "@reduxjs/toolkit";
import {
  getCartLineKey,
  normalizeCartItem,
  normalizeCartItems,
} from "../../utils/cartLineIdentity";

const initialState = {
  cart: normalizeCartItems(
    localStorage.getItem("cartItems") ? JSON.parse(localStorage.getItem("cartItems")) : []
  ),
};

export const cartReducer = createReducer(initialState, {
  addToCart: (state, action) => {
    const item = normalizeCartItem(action.payload);
    const lineKey = getCartLineKey(item);
    const isItemExist = state.cart.find((i) => getCartLineKey(i) === lineKey);

    if (isItemExist) {
      if (item.isWonBid) {
        return state;
      }

      const incrementBy = Math.max(1, Number(item.qty) || 1);
      return {
        ...state,
        cart: state.cart.map((i) =>
          getCartLineKey(i) === lineKey ? { ...i, qty: i.qty + incrementBy } : i
        ),
      };
    }

    return {
      ...state,
      cart: [...state.cart, { ...item, qty: Math.max(1, Number(item.qty) || 1) }],
    };
  },

  setCartItemQuantity: (state, action) => {
    const { item, qty } = action.payload;
    const lineKey = getCartLineKey(item);
    const nextQty = Math.max(1, Number(qty) || 1);

    return {
      ...state,
      cart: state.cart.map((i) =>
        getCartLineKey(i) === lineKey ? { ...i, qty: nextQty } : i
      ),
    };
  },

  removeFromCart: (state, action) => {
    const payload = action.payload;
    const lineKey =
      typeof payload === "string"
        ? payload
        : getCartLineKey(typeof payload === "object" ? payload : {});

    return {
      ...state,
      cart: state.cart.filter((i) => getCartLineKey(i) !== lineKey),
    };
  },
});
