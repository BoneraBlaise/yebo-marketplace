import React from "react";
import { ADMIN_SHOPPING_INTELLIGENCE } from "../../../ai/intelligence/yipMockData";
import AISection from "../primitives/AISection";
import AICard from "../primitives/AICard";
import AIInsightCard from "../primitives/AIInsightCard";
import { HiOutlineChartBar, HiOutlineSearch, HiOutlineTrendingUp } from "react-icons/hi";

const YEBOAdminShoppingIntelligence = () => (
  <section id="admin-yebo-intel" className="space-y-6 scroll-mt-24 yebone-fade-up">
    <AISection
      title="YEBO platform intelligence"
      subtitle="Search trends, brands, and recommendation performance — mock via YIP."
      compact
      contained={false}
      className="py-0"
      badge="Admin YEBO"
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
        {ADMIN_SHOPPING_INTELLIGENCE.map(({ id, label, value, sub }) => (
          <AIInsightCard key={id} title={label} value={value} subtitle={sub} icon={HiOutlineChartBar} />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <AICard>
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineSearch className="text-yebone-primary" size={18} />
            <h3 className="font-semibold text-sm dark:text-white">Most searched products</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Sneakers", "Phones", "Bags", "Laptops"].map((t) => (
              <span key={t} className="ai-prompt-chip text-[11px]">{t}</span>
            ))}
          </div>
        </AICard>
        <AICard>
          <div className="flex items-center gap-2 mb-2">
            <HiOutlineTrendingUp className="text-yebone-gold" size={18} />
            <h3 className="font-semibold text-sm dark:text-white">Shopping trends</h3>
          </div>
          <p className="text-sm text-gray-500">Electronics ↑ · Fashion steady · Home &amp; garden rising</p>
        </AICard>
      </div>
    </AISection>
  </section>
);

export default YEBOAdminShoppingIntelligence;
