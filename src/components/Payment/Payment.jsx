import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
  Elements,
} from "@stripe/react-stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaystackButton } from "react-paystack";
import { MdLock } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { useReferral } from "../../context/ReferralContext";
import { Container, Button } from "../ui";
import { typography } from "../../design-system/typography";
import CheckoutOrderSummary from "../Checkout/CheckoutOrderSummary";
import CheckoutTrustBadges from "../Checkout/CheckoutTrustBadges";
import "../Checkout/checkout.css";

const stripePublishableKey =
  process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || process.env.REACT_APP_STRIPE_API_KEY || "";

const stripePromise = stripePublishableKey ? loadStripe(stripePublishableKey) : null;

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { referralProducts, clearAllReferrals } = useReferral();

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
            (item) => !orderData.cart.find((orderItem) => orderItem._id === item._id)
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
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-yebone-primary/20 border-t-yebone-primary animate-spin" />
        <p className="text-gray-600 dark:text-gray-300 font-medium">Processing your order...</p>
      </div>
    );
  }

  return (
    <Container className="py-8 lg:py-12 pb-28 lg:pb-12">
      <div className="mb-8 yebone-fade-up">
        <h1 className={`${typography.heading} mb-2`}>Payment</h1>
        <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <MdLock size={16} className="text-yebone-primary" />
          Secure payment powered by Yebone
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-2 yebone-fade-up">
          <PaymentInfo
            user={user}
            orderData={orderData}
            onCashOnDelivery={cashOnDeliveryHandler}
            onShopPayment={PayViaShopInfo}
          />
        </div>

        {orderData && (
          <CheckoutOrderSummary
            subTotalPrice={orderData.subTotalPrice}
            shipping={orderData.shipping}
            totalPrice={orderData.totalPrice}
            discountAmount={orderData.discountPrice}
            showCoupon={false}
            showCheckoutButton={false}
            sticky
            continueShoppingHref="/products"
          />
        )}
      </div>
    </Container>
  );
};

const PAYMENT_METHODS = [
  {
    id: 1,
    title: "Pay with Paystack",
    description: "Secure payment via Paystack — cards, mobile money, and more.",
  },
  {
    id: 2,
    title: "Cash on Delivery",
    description: "Pay when your order is delivered to your door.",
    actionLabel: "Confirm order",
  },
  {
    id: 3,
    title: "Shop Payment Info",
    description: "Pay using payment details provided by the seller.",
    actionLabel: "Confirm order",
  },
];

const PaymentInfo = ({ onCashOnDelivery, onShopPayment, user, orderData }) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="space-y-6">
      <section className="yebone-surface rounded-[1.75rem] p-6 lg:p-8">
        <h2 className={`${typography.subheading} mb-6`}>Payment method</h2>

        <div className="space-y-3">
          {PAYMENT_METHODS.map((method) => (
            <div key={method.id}>
              <button
                type="button"
                onClick={() => setSelect(method.id)}
                className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-300 yebone-btn-lift ${
                  select === method.id
                    ? "border-yebone-primary bg-yebone-primary/5 shadow-md shadow-yebone-primary/10"
                    : "border-gray-100 dark:border-gray-800 hover:border-yebone-primary/30"
                }`}
              >
                <span
                  className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                    select === method.id
                      ? "border-yebone-primary"
                      : "border-gray-300 dark:border-gray-600"
                  }`}
                >
                  {select === method.id && (
                    <span className="w-2.5 h-2.5 rounded-full bg-yebone-primary" />
                  )}
                </span>
                <div>
                  <p className="font-Poppins font-semibold text-sm dark:text-white">
                    {method.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                    {method.description}
                  </p>
                </div>
              </button>

              {select === method.id && method.id === 2 && (
                <div className="mt-3 pl-9">
                  <Button onClick={onCashOnDelivery} className="yebone-btn-lift">
                    {method.actionLabel}
                  </Button>
                </div>
              )}

              {select === method.id && method.id === 3 && (
                <div className="mt-3 pl-9">
                  <Button onClick={onShopPayment} className="yebone-btn-lift">
                    {method.actionLabel}
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        <CheckoutTrustBadges />
      </section>

      {orderData?.cart?.length > 0 && (
        <section className="yebone-surface rounded-[1.75rem] p-6 lg:p-8">
          <h2 className={`${typography.subheading} mb-5`}>Order review</h2>
          <div className="space-y-4">
            {orderData.cart.map((item, i) => (
              <div key={item._id || i} className="flex gap-4 items-center">
                <img
                  src={item.images?.[0]?.url}
                  alt=""
                  className="w-16 h-16 rounded-xl object-cover shadow-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-2 dark:text-white">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Qty {item.qty} · {item.shop?.name}
                  </p>
                </div>
                <p className="font-semibold text-yebone-primary text-sm tabular-nums shrink-0">
                  RWF {(item.discountPrice * item.qty).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-xs text-gray-400 mt-5">
            <HiOutlineSparkles className="text-yebone-gold" size={14} />
            Est. delivery 3–7 business days
          </p>
        </section>
      )}

      <section className="yebone-surface rounded-[1.75rem] p-6 lg:p-8">
        <h2 className={`${typography.subheading} mb-4`}>Shipping to</h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1 leading-relaxed">
          <p className="font-semibold text-yebone-dark-text dark:text-white">{user?.name}</p>
          <p>{user?.email}</p>
          <p>{orderData?.shippingAddress?.address1}</p>
          {orderData?.shippingAddress?.address2 && (
            <p>{orderData.shippingAddress.address2}</p>
          )}
          <p>
            {orderData?.shippingAddress?.city}, {orderData?.shippingAddress?.country}{" "}
            {orderData?.shippingAddress?.zipCode}
          </p>
          <p>{user?.phoneNumber}</p>
        </div>
      </section>
    </div>
  );
};

const PaymentWithElements = () => (
  <Elements stripe={stripePromise}>
    <Payment />
  </Elements>
);

export default PaymentWithElements;
