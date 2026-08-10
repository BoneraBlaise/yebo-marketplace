import { getCartLineKey } from "../../utils/cartLineIdentity";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useReferral } from "../../context/ReferralContext";
import { Container, Button } from "../ui";
import { typography } from "../../design-system/typography";
import CheckoutOrderSummary from "../Checkout/CheckoutOrderSummary";
import CheckoutAIAssistant from "../Checkout/CheckoutAIAssistant";
import "../Checkout/checkout.css";

const stripePublishableKey =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_API_KEY || "";

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { clearAllReferrals } = useReferral();

  useEffect(() => {
    const savedOrderData = localStorage.getItem("latestOrder");
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    }
  }, []);

  useEffect(() => {
    return () => {
      if (!window.location.pathname.includes("/order/success")) {
        localStorage.removeItem("latestOrder");
      }
    };
  }, []);

  const createOrder = async (paymentInfo) => {
    try {
      if (!orderData) {
        toast.error("No order data found!");
        return;
      }

      setLoading(true);

      const orderPayload = {
        cart: orderData.cart,
        shippingAddress: orderData.shippingAddress,
        user: orderData.user,
        totalPrice: orderData.totalPrice,
        subTotalPrice: orderData.subTotalPrice,
        paymentInfo: {
          ...paymentInfo,
          status: "Pending",
        },
        shipping: orderData.shipping,
        discountPrice: orderData.discountPrice,
        couponCode: orderData.couponCode || null,
        attributionTokens: orderData.attributionTokens || [],
        referralCode:
          orderData.cart?.find((item) => item.referralCode)?.referralCode || null,
        orderType: orderData.orderType,
        bidId: orderData.bidId,
        negotiatedOffer: orderData.negotiatedOffer || null,
        wonBid: orderData.wonBid || null,
      };

      const { data } = await axios.post(
        `${server}/order/create-order`,
        orderPayload,
        { withCredentials: true }
      );

      if (data.success) {
        if (orderData.orderType === "regular") {
          localStorage.removeItem("cartItems");
          clearAllReferrals?.();
        } else {
          const updatedCart = JSON.parse(localStorage.getItem("cartItems") || "[]").filter(
            (item) =>
              !orderData.cart.find(
                (orderItem) => getCartLineKey(orderItem) === getCartLineKey(item)
              )
          );
          localStorage.setItem("cartItems", JSON.stringify(updatedCart));
        }

        localStorage.removeItem("latestOrder");
        toast.success("Order created successfully!");
        navigate("/order/success");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      toast.error(error.response?.data?.message || "Error creating order");
    } finally {
      setLoading(false);
    }
  };

  const cashOnDeliveryHandler = async (e) => {
    e.preventDefault();
    if (!orderData) {
      toast.error("Please complete your order details first");
      return;
    }
    await createOrder({
      type: "Cash On Delivery",
      status: "Pending",
    });
  };

  const PayViaShopInfo = async (e) => {
    e.preventDefault();
    if (!orderData) {
      toast.error("Please complete your order details first");
      return;
    }
    await createOrder({
      type: "Shop Payment",
      status: "Pending",
    });
  };

  if (loading) {
    return (
      <Container className="checkout-page">
        <div className="checkout-page__loading-wrap">
          <div className="checkout-page__spinner" />
          <p>Processing your order…</p>
        </div>
      </Container>
    );
  }

  if (!orderData) {
    return (
      <Container className="checkout-page">
        <p className="checkout-page__loading">No order found. Return to checkout to continue.</p>
      </Container>
    );
  }

  return (
    <>
      <Container className="checkout-page">
        <div className="checkout-layout">
          <div className="checkout-layout__main">
            <PaymentInfo
              onCashOnDelivery={cashOnDeliveryHandler}
              onShopPayment={PayViaShopInfo}
            />
            <CheckoutAIAssistant />
          </div>

          <aside className="checkout-layout__aside">
            <CheckoutOrderSummary
              subTotalPrice={orderData.subTotalPrice}
              shipping={orderData.shipping}
              totalPrice={orderData.totalPrice}
              discountAmount={orderData.discountPrice}
              showCoupon={false}
              showCheckoutButton={false}
            />
          </aside>
        </div>
      </Container>
    </>
  );
};

const PAYMENT_METHODS = [
  {
    id: 1,
    title: "Pay with Paystack",
    description: "Cards, mobile money, and more.",
  },
  {
    id: 2,
    title: "Cash on Delivery",
    description: "Pay when your order arrives.",
    actionLabel: "Confirm & pay on delivery",
  },
  {
    id: 3,
    title: "Shop Payment Info",
    description: "Pay using seller payment details.",
    actionLabel: "Confirm order",
  },
];

const PaymentInfo = ({ onCashOnDelivery, onShopPayment }) => {
  const [select, setSelect] = useState(1);

  return (
    <section className="checkout-section">
      <h2 className={`checkout-section__title ${typography.subheading}`}>Payment</h2>

      <div className="checkout-payment__list">
        {PAYMENT_METHODS.map((method) => (
          <div key={method.id}>
            <button
              type="button"
              onClick={() => setSelect(method.id)}
              className={`checkout-payment__option${select === method.id ? " is-selected" : ""}`}
            >
              <span className="checkout-payment__radio" aria-hidden="true">
                {select === method.id && <span />}
              </span>
              <span className="checkout-payment__copy">
                <span className="checkout-payment__title">{method.title}</span>
                <span className="checkout-payment__desc">{method.description}</span>
              </span>
            </button>

            {select === method.id && method.id === 2 && (
              <div className="checkout-payment__action">
                <Button onClick={onCashOnDelivery}>{method.actionLabel}</Button>
              </div>
            )}

            {select === method.id && method.id === 3 && (
              <div className="checkout-payment__action">
                <Button onClick={onShopPayment}>{method.actionLabel}</Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

const PaymentWithElements = () => (
  <Elements stripe={stripePromise}>
    <Payment />
  </Elements>
);

export default PaymentWithElements;
