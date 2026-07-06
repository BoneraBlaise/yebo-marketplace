import React, { useEffect } from "react";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { SHOPPING_SCOPES } from "../../../ai/memory/YEBOShoppingContext";
import AISection from "../primitives/AISection";
import AIInsightCard from "../primitives/AIInsightCard";
import AICard from "../primitives/AICard";
import { YEBODecisionHint } from "../decision";
import { YEBOIntelligenceHint } from "../intelligence";
import {
  HiOutlineSearch,
  HiOutlineTag,
  HiOutlineChartBar,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
} from "react-icons/hi";

/** Admin platform memory visualization */
const YEBOAdminMemoryDashboard = () => {
  const yeboMemory = useYEBOMemoryOptional();
  const admin = yeboMemory?.getSnapshot?.()?.dashboards?.admin;

  useEffect(() => {
    yeboMemory?.setActiveScope?.(SHOPPING_SCOPES.ADMIN_DASHBOARD);
  }, [yeboMemory]);

  return (
    <AISection
      id="yebo-admin-memory"
      title="YEBO platform memory"
      subtitle="Trending interests, searches, and future AI metrics — mock session via YIP."
      compact
      contained={false}
      className="py-0"
      badge="Platform"
    >
      <YEBODecisionHint scope="admin" className="mb-4" />
      <YEBOIntelligenceHint scope="admin" compact className="mb-4" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <AIInsightCard
          title="Trending interests"
          value={(admin?.trendingInterests || []).slice(0, 2).join(", ")}
          icon={HiOutlineTrendingUp}
        />
        <AIInsightCard
          title="Popular searches"
          value={(admin?.popularSearches || [])[0] || "—"}
          icon={HiOutlineSearch}
        />
        <AIInsightCard
          title="Platform trend"
          value={admin?.platformTrend || "—"}
          icon={HiOutlineChartBar}
        />
        <AIInsightCard
          title="Rec performance"
          value={admin?.recommendationPerformance || "—"}
          icon={HiOutlineSparkles}
          confidence={87}
        />
      </div>
      <AICard padding="sm">
        <p className="text-xs font-semibold dark:text-white mb-2 flex items-center gap-2">
          <HiOutlineTag size={14} className="text-yebone-primary" />
          Future AI metrics
        </p>
        <div className="flex flex-wrap gap-2">
          {(admin?.futureMetrics || []).map((m) => (
            <span key={m} className="ai-prompt-chip text-[11px]">
              {m}
            </span>
          ))}
        </div>
      </AICard>
    </AISection>
  );
};

export default YEBOAdminMemoryDashboard;
