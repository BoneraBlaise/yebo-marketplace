import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { useReferral } from "../../context/ReferralContext";
import { Button } from "../ui";
import { typography } from "../../design-system/typography";
import CheckoutCartItem from "../Checkout/CheckoutCartItem";
import { YEBOCartIntelligence } from "../ai";
import "../Checkout/checkout.css";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { referralProducts } = useReferral();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
      onClick={() => setOpenCart(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping cart"
    >
      <Helmet>
        <title>Shopping Cart — Yebone</title>
      </Helmet>

      <div
        className="checkout-drawer fixed top-0 right-0 h-full w-full max-w-md bg-white dark:bg-gray-950 flex flex-col shadow-2xl border-l border-gray-100 dark:border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <IoBagHandleOutline size={24} className="text-yebone-primary" />
            <h2 className={`${typography.subheading}`}>
              Cart {cart?.length ? `(${cart.length})` : ""}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setOpenCart(false)}
            className="w-10 h-10 rounded-full hover:bg-yebone-light-gray dark:hover:bg-gray-800 flex items-center justify-center transition yebone-btn-lift"
            aria-label="Close cart"
          >
            <RxCross1 size={22} />
          </button>
        </div>

        {cart && cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-20 h-20 rounded-2xl yebone-surface flex items-center justify-center mb-4">
              <IoBagHandleOutline size={32} className="text-yebone-primary" />
            </div>
            <p className="font-Poppins font-semibold text-lg mb-2 dark:text-white">
              Your cart is empty
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Add items from Yebone to checkout.
            </p>
            <Link to="/products" onClick={() => setOpenCart(false)}>
              <Button className="yebone-btn-lift">Continue shopping</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto hide-scrollbar p-4 space-y-3">
              {cart.map((item, index) => (
                <CheckoutCartItem
                  key={item._id || index}
                  data={item}
                  compact
                  showMoveToWishlist={false}
                  quantityChangeHandler={quantityChangeHandler}
                  removeFromCartHandler={removeFromCartHandler}
                  hasReferral={referralProducts.has(item._id) || item.referralCode}
                />
              ))}
              <YEBOCartIntelligence />
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 bg-yebone-light-gray/30 dark:bg-gray-900/50 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-Poppins font-bold text-xl text-yebone-primary tabular-nums">
                  RWF {formatPrice(totalPrice)}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 text-center">
                Shipping calculated at checkout
              </p>
              <Link to="/checkout" onClick={() => setOpenCart(false)}>
                <Button size="lg" className="w-full yebone-btn-lift">
                  Checkout · RWF {formatPrice(totalPrice)}
                </Button>
              </Link>
              <Link
                to="/products"
                onClick={() => setOpenCart(false)}
                className="block text-center text-sm font-semibold text-yebone-primary hover:underline"
              >
                Continue shopping
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
