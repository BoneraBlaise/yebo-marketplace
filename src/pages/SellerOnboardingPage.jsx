import React from "react";
import { Helmet } from "react-helmet";
import SellerOnboardingWizard from "../components/Shop/SellerOnboardingWizard";

const SellerOnboardingPage = () => (
  <div className="yebone-premium-screen">
    <Helmet>
      <title>Become a Seller | Yebone</title>
      <meta name="description" content="Complete seller onboarding with your Yebone customer account." />
    </Helmet>
    <SellerOnboardingWizard />
  </div>
);

export default SellerOnboardingPage;
