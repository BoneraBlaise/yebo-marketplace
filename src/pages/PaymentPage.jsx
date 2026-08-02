import React from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Payment from "../components/Payment/Payment";
import "../components/Checkout/checkout.css";

const PaymentPage = () => (
  <div className="checkout-page-shell">
    <CheckoutSteps active={2} />
    <Payment />
  </div>
);

export default PaymentPage;
