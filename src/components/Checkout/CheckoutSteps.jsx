import React from "react";
import { useReferral } from "../../context/ReferralContext";

const STEPS = [
  { id: 1, label: "Order" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Done" },
];

const CheckoutSteps = ({ active = 1 }) => {
  const { referralProducts } = useReferral();
  const hasReferrals = referralProducts.size > 0;

  return (
    <div className="checkout-steps">
      <div className="checkout-steps__inner">
        <div className="checkout-steps__track" aria-hidden="true">
          <div
            className="checkout-steps__progress"
            style={{
              width:
                active >= 3
                  ? "100%"
                  : active >= 2
                  ? "50%"
                  : "0%",
            }}
          />
        </div>

        {STEPS.map((step) => {
          const isComplete = active > step.id;
          const isCurrent = active === step.id;
          return (
            <div key={step.id} className="checkout-steps__step">
              <div
                className={`checkout-steps__dot${
                  isComplete ? " is-complete" : isCurrent ? " is-current" : ""
                }`}
              >
                {isComplete ? "✓" : step.id}
              </div>
              <span className={`checkout-steps__label${isCurrent ? " is-current" : ""}`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {hasReferrals && (
        <p className="checkout-steps__referral">Referral applied</p>
      )}
    </div>
  );
};

export default CheckoutSteps;
