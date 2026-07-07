import React from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Payment from "../components/Payment/Payment";
import "../components/Checkout/checkout.css";

const PaymentPage = () => (
  <div className="yebone-premium-screen min-h-screen flex flex-col bg-yebone-light-gray dark:bg-gray-950">
    <CheckoutSteps active={2} />
    <main className="flex-1">
      <Payment />
    </main>
  </div>
);

export default PaymentPage;
