import React from "react";
import { CHECKOUT_INTELLIGENCE_EXTRAS } from "../../../ai/intelligence/yipMockData";
import YEBODecisionHint from "../decision/YEBODecisionHint";
import YEBOIntelligenceHint from "./YEBOIntelligenceHint";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import { HiOutlineSparkles, HiOutlineTruck, HiOutlineShieldCheck } from "react-icons/hi";

const ICONS = {
  confidence: HiOutlineSparkles,
  shipping: HiOutlineTruck,
  protection: HiOutlineShieldCheck,
  delivery: HiOutlineTruck,
  summary: HiOutlineSparkles,
};

const YEBOCheckoutIntelligence = () => (
  <AISection
    title="YEBO checkout intelligence"
    subtitle="Purchase confidence, shipping, and protection — mock via YIP."
    compact
    contained={false}
    className="py-6"
    badge="Checkout"
  >
    <YEBODecisionHint scope="checkout" className="mb-3" />
    <YEBOIntelligenceHint scope="checkout" compact className="mb-3" />
    <div className="grid sm:grid-cols-2 gap-3">
      {CHECKOUT_INTELLIGENCE_EXTRAS.map(({ id, title, value, confidence }) => {
        const Icon = ICONS[id] || HiOutlineSparkles;
        return (
          <AIInsightCard key={id} title={title} value={value} icon={Icon} confidence={confidence} />
        );
      })}
    </div>
  </AISection>
);

export default YEBOCheckoutIntelligence;
