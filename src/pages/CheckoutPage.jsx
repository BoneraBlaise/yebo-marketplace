import React from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Checkout from "../components/Checkout/Checkout";
import "../components/Checkout/checkout.css";

const CheckoutPage = () => (
  <div className="yebone-premium-screen min-h-screen flex flex-col bg-yebone-light-gray dark:bg-gray-950">
    <CheckoutSteps active={1} />
    <main className="flex-1">
      <Checkout />
    </main>
  </div>
);

export default CheckoutPage;
