import React from "react";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Checkout from "../components/Checkout/Checkout";
import "../components/Checkout/checkout.css";

const CheckoutPage = () => (
  <div className="min-h-screen flex flex-col bg-yebone-light-gray dark:bg-gray-950">
    <Header />
    <CheckoutSteps active={1} />
    <main className="flex-1">
      <Checkout />
    </main>
    <Footer />
  </div>
);

export default CheckoutPage;
