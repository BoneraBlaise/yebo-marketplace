import React, { useEffect } from "react";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { SHOPPING_SCOPES } from "../../../ai/memory/YEBOShoppingContext";
import AISection from "../primitives/AISection";
import YEBOMemoryJourney from "./YEBOMemoryJourney";
import YEBOMemoryTimeline from "./YEBOMemoryTimeline";
import YEBOPreferenceCards from "./YEBOPreferenceCards";
import YEBOShoppingHistory from "./YEBOShoppingHistory";
import YEBOSmartReminders from "./YEBOSmartReminders";
import { YEBODecisionHint } from "../decision";
import { YEBOIntelligenceHint } from "../intelligence";
import AIInsightCard from "../primitives/AIInsightCard";
import { HiOutlineHeart, HiOutlineSparkles } from "react-icons/hi";

/** Customer dashboard memory visualization */
const YEBOCustomerMemoryDashboard = () => {
  const yeboMemory = useYEBOMemoryOptional();
  const customer = yeboMemory?.getSnapshot?.()?.dashboards?.customer;

  useEffect(() => {
    yeboMemory?.setActiveScope?.(SHOPPING_SCOPES.CUSTOMER_DASHBOARD);
  }, [yeboMemory]);

  return (
    <AISection
      id="yebo-customer-memory"
      title="YEBO remembers your journey"
      subtitle={customer?.summary || "Shopping summary, interests, and session history — mock via YIP memory."}
      compact
      contained={false}
      className="py-0"
      badge="Memory"
    >
      <YEBODecisionHint scope="dashboard" className="mb-4" />
      <YEBOIntelligenceHint scope="dashboard" compact className="mb-4" />
      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <YEBOMemoryJourney />
        <YEBOMemoryTimeline />
      </div>
      <div className="mb-4">
        <YEBOPreferenceCards />
      </div>
      <div className="grid sm:grid-cols-2 gap-3 mb-4">
        <AIInsightCard
          title="Saved interests"
          value={(customer?.favoriteInterests || []).map((i) => i.label).slice(0, 2).join(", ") || "Fitness, Tech"}
          icon={HiOutlineSparkles}
          confidence={88}
        />
        <AIInsightCard
          title="Wishlist history"
          value={(customer?.wishlistHistory || []).slice(0, 2).join(", ") || "—"}
          icon={HiOutlineHeart}
        />
      </div>
      <YEBOShoppingHistory className="mb-4" />
      <YEBOSmartReminders limit={3} />
    </AISection>
  );
};

export default YEBOCustomerMemoryDashboard;
