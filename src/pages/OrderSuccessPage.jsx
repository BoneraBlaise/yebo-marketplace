import React from "react";
import { Link } from "react-router-dom";
import CheckoutSteps from "../components/Checkout/CheckoutSteps";
import Lottie from "react-lottie";
import animationData from "../Assests/animations/107043-success.json";
import { Container, Button } from "../components/ui";
import { typography } from "../design-system/typography";

const OrderSuccessPage = () => (
  <div className="yebone-premium-screen min-h-screen flex flex-col bg-yebone-light-gray dark:bg-gray-950">
    <CheckoutSteps active={3} />
    <main className="flex-1">
      <Success />
    </main>
  </div>
);

const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Container className="py-16 lg:py-24 text-center yebone-fade-up">
      <div className="yebone-surface rounded-[1.75rem] p-8 lg:p-12 max-w-lg mx-auto">
        <Lottie options={defaultOptions} width={220} height={220} />
        <h1 className={`${typography.heading} mb-3 mt-4`}>Order confirmed</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
          Thank you for shopping on Yebone. Your order has been placed successfully.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/products">
            <Button variant="outline" className="yebone-btn-lift w-full sm:w-auto">
              Continue shopping
            </Button>
          </Link>
          <Link to="/profile">
            <Button className="yebone-btn-lift w-full sm:w-auto">View orders</Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default OrderSuccessPage;
