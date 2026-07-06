import React, { useEffect } from "react";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { SHOPPING_SCOPES } from "../../../ai/memory/YEBOShoppingContext";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import AICard from "../primitives/AICard";
import {
  HiOutlineSearch,
  HiOutlineSwitchHorizontal,
  HiOutlineCube,
  HiOutlineTrendingUp,
} from "react-icons/hi";

/** Vendor dashboard memory insights */
const YEBOVendorMemoryDashboard = () => {
  const yeboMemory = useYEBOMemoryOptional();
  const vendor = yeboMemory?.getSnapshot?.()?.dashboards?.vendor;

  useEffect(() => {
    yeboMemory?.setActiveScope?.(SHOPPING_SCOPES.VENDOR_DASHBOARD);
  }, [yeboMemory]);

  return (
    <AISection
      id="yebo-vendor-memory"
      title="YEBO customer memory"
      subtitle="Recent interests, comparisons, and restock signals — session placeholders via YIP."
      compact
      contained={false}
      className="py-0"
      badge="Vendor YEBO"
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <AIInsightCard
          title="Customer interests"
          value={(vendor?.recentInterests || []).slice(0, 2).join(", ")}
          icon={HiOutlineTrendingUp}
        />
        <AIInsightCard
          title="Popular products"
          value={(vendor?.popularProducts || []).slice(0, 2).join(", ")}
          icon={HiOutlineCube}
        />
        <AIInsightCard
          title="Top comparisons"
          value={(vendor?.frequentlyCompared || [])[0] || "—"}
          icon={HiOutlineSwitchHorizontal}
        />
        <AIInsightCard
          title="Restock hint"
          value={vendor?.restockHint || "—"}
          icon={HiOutlineSearch}
        />
      </div>
      <AICard padding="sm">
        <p className="text-xs font-semibold dark:text-white mb-2">Recent customer interests</p>
        <div className="flex flex-wrap gap-2">
          {(vendor?.recentInterests || []).map((interest) => (
            <span key={interest} className="ai-prompt-chip text-[11px]">
              {interest}
            </span>
          ))}
        </div>
      </AICard>
    </AISection>
  );
};

export default YEBOVendorMemoryDashboard;
