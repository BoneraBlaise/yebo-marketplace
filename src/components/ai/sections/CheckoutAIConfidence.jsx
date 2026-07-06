import React from "react";
import { HiOutlineSparkles, HiOutlineShieldCheck, HiOutlineTruck } from "react-icons/hi";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import { CHECKOUT_AI_INSIGHTS } from "../data/aiPlaceholders";

const ICONS = {
  shipping: HiOutlineTruck,
  delivery: HiOutlineTruck,
  confidence: HiOutlineSparkles,
  protection: HiOutlineShieldCheck,
};

const CheckoutAIConfidence = () => (
  <AISection
    title="AI confidence panel"
    subtitle="Shipping, delivery, and purchase confidence — presentation placeholders only."
    compact
    contained={false}
    className="py-6"
    badge="Checkout AI"
  >
    <div className="grid sm:grid-cols-2 gap-3">
      {CHECKOUT_AI_INSIGHTS.map(({ id, title, value, confidence }) => {
        const Icon = ICONS[id] || HiOutlineSparkles;
        return (
          <AIInsightCard
            key={id}
            title={title}
            value={value}
            icon={Icon}
            confidence={confidence}
          />
        );
      })}
    </div>
  </AISection>
);

export default CheckoutAIConfidence;
