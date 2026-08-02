import React from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";
import "../components/Checkout/checkout.css";

const CheckoutPage = () => (
  <div className="checkout-page-shell">
    <CheckoutSteps active={1} />
    <Checkout />
  </div>
);

export default CheckoutPage;
