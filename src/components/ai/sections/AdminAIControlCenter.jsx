import React from "react";
import {
  HiOutlineSparkles,
  HiOutlineSearch,
  HiOutlineChartBar,
  HiOutlineCog,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import AISection from "../primitives/AISection";
import AICard from "../primitives/AICard";
import AIInsightCard from "../primitives/AIInsightCard";
import {
  ADMIN_AI_METRICS,
  ADMIN_AI_MODELS,
  ADMIN_FEATURE_FLAGS,
} from "../data/aiPlaceholders";
import YEBOAdminShoppingIntelligence from "../intelligence/YEBOAdminShoppingIntelligence";
import { YEBOAdminMemoryDashboard } from "../memory";

const AdminAIControlCenter = () => (
  <>
  <section id="admin-ai" className="space-y-8 scroll-mt-24 yebone-fade-up">
    <AISection
      title="AI Control Center"
      subtitle="Usage analytics, trending searches, feature flags, and future model connections — presentation only."
      compact
      contained={false}
      className="py-0"
      badge="Admin AI"
    >
      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-8">
        {ADMIN_AI_METRICS.map(({ id, label, value, sub }) => (
          <AIInsightCard key={id} title={label} value={value} subtitle={sub} icon={HiOutlineChartBar} />
        ))}
      </div>

      {/* Popular prompts & trending */}
      <div className="grid lg:grid-cols-2 gap-4 mb-8">
        <AICard>
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineSearch className="text-yebone-primary" size={20} />
            <h3 className="font-Poppins font-semibold dark:text-white">Popular prompts</h3>
          </div>
          <ul className="space-y-2 text-sm text-gray-500">
            <li className="ai-history-item !cursor-default">White sneakers under 50K</li>
            <li className="ai-history-item !cursor-default">Gift ideas for birthday</li>
            <li className="ai-history-item !cursor-default">Best laptop deals</li>
          </ul>
          <p className="text-[10px] text-gray-400 mt-3">Placeholder · No analytics backend</p>
        </AICard>
        <AICard>
          <div className="flex items-center gap-2 mb-3">
            <HiOutlineSparkles className="text-yebone-gold" size={20} />
            <h3 className="font-Poppins font-semibold dark:text-white">Trending searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Electronics", "Fashion", "Gym equipment", "Skincare"].map((t) => (
              <span key={t} className="ai-prompt-chip text-[11px]">
                {t}
              </span>
            ))}
          </div>
          <p className="text-[10px] text-gray-400 mt-3">Recommendation analytics coming soon</p>
        </AICard>
      </div>

      {/* Future AI models */}
      <div className="mb-8">
        <h3 className="font-Poppins font-semibold mb-4 dark:text-white flex items-center gap-2">
          <HiOutlineCog size={20} className="text-yebone-primary" />
          Future AI models
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {ADMIN_AI_MODELS.map(({ id, name, status }) => (
            <AICard key={id} padding="sm" className="cursor-default">
              <p className="font-semibold text-sm dark:text-white">{name}</p>
              <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">
                {status}
              </span>
            </AICard>
          ))}
        </div>
      </div>

      {/* Feature flags */}
      <div>
        <h3 className="font-Poppins font-semibold mb-4 dark:text-white flex items-center gap-2">
          <HiOutlineShieldCheck size={20} className="text-yebone-primary" />
          Feature flags
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ADMIN_FEATURE_FLAGS.map(({ id, label, enabled }) => (
            <AICard key={id} padding="sm" hover={false} className="cursor-default">
              <label className="flex items-center justify-between gap-2 cursor-default">
                <span className="text-sm font-medium dark:text-white">{label}</span>
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked={enabled}
                  readOnly
                  aria-label={`${label} feature flag`}
                />
              </label>
            </AICard>
          ))}
        </div>
      </div>
    </AISection>
  </section>
  <YEBOAdminShoppingIntelligence />
  <YEBOAdminMemoryDashboard />
  </>
);

export default AdminAIControlCenter;
