import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { useSelector, useDispatch } from "react-redux";
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
import { createOrder } from "../../redux/actions/order";
import { useReferral } from '../../context/ReferralContext';

// Stripe's public key (Replace with your actual public key)
const stripePromise = loadStripe("your-publishable-key-here"); // Replace with your Stripe public key

const Payment = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referralProducts, clearAllReferrals } = useReferral();

  useEffect(() => {
    const savedOrderData = localStorage.getItem("latestOrder");
    if (savedOrderData) {
      setOrderData(JSON.parse(savedOrderData));
    }
  }, []);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (!window.location.pathname.includes('/order/success')) {
        // Only clear if not navigating to success page
        localStorage.removeItem("latestOrder");
      }
    };
  }, []);

  const calculateTotalForShop = (items) => {
    return items.reduce((total, item) => {
      const itemPrice = item.discountPrice || item.originalPrice;
      return total + (itemPrice * item.qty);
    }, 0);
  };

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
        paymentInfo: {
          ...paymentInfo,
          status: "Pending"
        },
        shipping: orderData.shipping,
        discountPrice: orderData.discountPrice,
        orderType: orderData.orderType,
        bidId: orderData.bidId,
        referralCodes: orderData.cart
          .filter(item => item.referralCode)
          .map(item => item.referralCode)
      };

      const { data } = await axios.post(
        `${server}/order/create-order`,
        orderPayload,
        { withCredentials: true }
      );

      if (data.success) {
        if (orderData.orderType === 'regular') {
          localStorage.removeItem("cartItems");
          if (window.referralContext) {
            window.referralContext.clearAllReferrals();
          }
        } else {
          const updatedCart = JSON.parse(localStorage.getItem("cartItems") || "[]")
            .filter(item => !orderData.cart.find(orderItem => orderItem._id === item._id));
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
      status: "Pending"
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
      status: "Pending"
    });
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex items-center justify-center">
          <div className="flex items-center">
            <div className="animate-spin mr-2">
              {/* Add your loading spinner here */}
            </div>
            <span className="text-black dark:text-white">Processing your order...</span>
          </div>
        </div>
      ) : (
        <div className="w-full flex flex-col items-center py-8">
          <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
            <div className="w-full 800px:w-[65%]">
              <PaymentInfo
                user={user}
                orderData={orderData}
                onCashOnDelivery={cashOnDeliveryHandler}
                onShopPayment={PayViaShopInfo}
              />
            </div>
            <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
              {orderData && <CartData orderData={orderData} />}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PaymentInfo = ({
  onCashOnDelivery,
  onShopPayment,
  user,
  orderData
}) => {
  const [select, setSelect] = useState(1);

  return (
    <div className="w-full 800px:w-[95%] bg-[#fff] dark:bg-[#1f1f1f] dark:text-gray-200 rounded-md p-5 pb-8">
      {/* Paystack Payment */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] dark:border-[#29625d] relative flex items-center justify-center"
            onClick={() => setSelect(1)}
          >
            {select === 1 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] dark:bg-[#28625d] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1] dark:text-white">
            Pay with Paystack
          </h4>
        </div>
        {select === 1 && (
          <div className="w-full">
            <p className="text-[#111111b5] dark:text-gray-200 mb-4">
              Secure payment via Paystack
            </p>
          </div>
        )}
      </div>

      <br />

      {/* Cash on Delivery */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] dark:border-[#29625d] relative flex items-center justify-center"
            onClick={() => setSelect(2)}
          >
            {select === 2 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1] dark:text-white">
            Cash on Delivery
          </h4>
        </div>
        {select === 2 ? (
          <div className="w-full">
            <p className="text-[#111111b5] dark:text-gray-200">
              Pay when your order is delivered.
            </p>
            <br />
            <button
              className="text-white bg-[#29625d] py-2 px-5 rounded-md text-[18px]"
              onClick={onCashOnDelivery}
            >
              Confirm Order
            </button>
          </div>
        ) : null}
      </div>

      <br />

      {/* Shop Payment Info */}
      <div>
        <div className="flex w-full pb-5 border-b mb-2">
          <div
            className="w-[25px] h-[25px] rounded-full bg-transparent border-[3px] border-[#1d1a1ab4] dark:border-[#29625d] relative flex items-center justify-center"
            onClick={() => setSelect(3)}
          >
            {select === 3 ? (
              <div className="w-[13px] h-[13px] bg-[#1d1a1acb] rounded-full" />
            ) : null}
          </div>
          <h4 className="text-[18px] pl-2 font-[600] text-[#000000b1] dark:text-white">
            Shop Payment Info
          </h4>
        </div>
        {select === 3 ? (
          <div className="w-full">
            <p className="text-[#111111b5] dark:text-gray-200">
              Pay with info provided by seller.
            </p>
            <br />
            <button
              className="text-white bg-[#29625d] py-2 px-5 rounded-md text-[18px]"
              onClick={onShopPayment}
            >
              Confirm Order
            </button>
          </div>
        ) : null}
      </div>

      {/* Shipping Address */}
      <div className="mt-8">
        <h4 className="text-[20px] font-[600] mb-4">Shipping Address:</h4>
        <div className="text-[16px] text-gray-700 dark:text-gray-300">
          <p>{user?.name}</p>
          <p>{user?.email}</p>
          <p>{orderData?.shippingAddress?.address1}</p>
          <p>{orderData?.shippingAddress?.country}</p>
          <p>{orderData?.shippingAddress?.city}</p>
          <p>{orderData?.shippingAddress?.zipCode}</p>
          <p>{user?.phoneNumber}</p>
        </div>
      </div>
    </div>
  );
};

const CartData = ({ orderData }) => {
  const shipping = orderData?.shipping?.toFixed(2);

  return (
    <div className="w-full bg-[#fff] dark:bg-gray-800 dark:text-white rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">subtotal:</h3>
        <h5 className="text-[18px] font-[600]">
          RWF {orderData?.subTotalPrice}
        </h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">shipping:</h3>
        <h5 className="text-[18px] font-[600]">RWF {shipping}</h5>
      </div>
      <br />
      <div className="flex justify-between border-b pb-3">
        <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">Discount:</h3>
        <h5 className="text-[18px] font-[600]">
          {orderData?.discountPrice ? `RWF ${orderData.discountPrice}` : "-"}
        </h5>
      </div>
      <h5 className="text-[18px] font-[600] text-end pt-3">
        RWF {orderData?.totalPrice}
      </h5>
      <br />
    </div>
  );
};

// Wrapping the Payment component with Elements provider
const PaymentWithElements = () => {
  return (
    <Elements stripe={stripePromise}>
      <Payment />
    </Elements>
  );
};

export default PaymentWithElements;
