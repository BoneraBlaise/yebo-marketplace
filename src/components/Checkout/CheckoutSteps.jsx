import React from "react";
import { useReferral } from "../../context/ReferralContext";

const STEPS = [
  { id: 1, label: "Order" },
  { id: 2, label: "Payment" },
  { id: 3, label: "Success" },
];

const CheckoutSteps = ({ active = 1 }) => {
  const { referralProducts } = useReferral();
  const hasReferrals = referralProducts.size > 0;

  return (
    <div className="w-full py-6 lg:py-8 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-950/50 yebone-glass">
      <div className="max-w-xl mx-auto px-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-gray-200 dark:bg-gray-800 -z-10" />
          <div
            className="absolute top-5 left-8 h-0.5 bg-yebone-primary -z-10 transition-all duration-500"
            style={{ width: active >= 2 ? (active >= 3 ? "calc(100% - 4rem)" : "calc(50% - 2rem)") : "0%" }}
          />

          {STEPS.map((step) => {
            const isComplete = active > step.id;
            const isCurrent = active === step.id;
            return (
              <div key={step.id} className="flex flex-col items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                    isComplete
                      ? "bg-yebone-primary text-white shadow-lg shadow-yebone-primary/30"
                      : isCurrent
                      ? "bg-yebone-primary text-white ring-4 ring-yebone-primary/20"
                      : "bg-yebone-gold/30 text-yebone-dark-text"
                  }`}
                >
                  {isComplete ? "✓" : step.id}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isCurrent ? "text-yebone-primary" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {hasReferrals && (
          <p className="text-center text-xs text-yebone-primary font-semibold mt-4">
            ✓ Referral code applied
          </p>
        )}
      </div>
    </div>
  );
};

export default CheckoutSteps;
