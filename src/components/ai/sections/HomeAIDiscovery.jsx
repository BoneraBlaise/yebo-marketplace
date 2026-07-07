import React from "react";
import { HiOutlineTrendingUp, HiOutlineClock, HiOutlineLightBulb } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useAIOptional } from "../core/AIContext";
import AISection from "../primitives/AISection";
import AICard from "../primitives/AICard";
import AIActionButton from "../primitives/AIActionButton";
import HomeProductCard from "../../Home/HomeProductCard";
import { MarketplaceCardGrid, MarketplaceCardSlot } from "../../Marketplace/cards";
import {
  TRENDING_SEARCHES,
  SMART_SUGGESTIONS,
  RECENTLY_SEARCHED,
} from "../data/aiPlaceholders";
import YEBOShoppingInsightCards from "../intelligence/YEBOShoppingInsightCards";
import YEBOProactiveBanner from "../intelligence/YEBOProactiveBanner";
import { YEBOWelcomeBack, YEBOCrossPageContinuity, YEBOContinueShopping, YEBOSmartReminders } from "../memory";
import { YEBODecisionHint } from "../decision";
import { YEBOIntelligenceHint } from "../intelligence";
import { PROACTIVE_SUGGESTIONS } from "../../../ai/intelligence/yipMockData";

const HomeAIDiscovery = () => {
  const ai = useAIOptional();
  const { allProducts } = useSelector((state) => state.products);
  const recommendations = (allProducts || []).slice(0, 4);

  const handleAskAI = (query) => {
    if (ai) {
      ai.openPanel();
      if (query) ai.sendMessage(query);
    }
  };

  return (
    <AISection
      id="ai-discovery"
      title="Ask YEBO"
      subtitle="Smart shopping intelligence — trending searches, insights, and mock recommendations via YIP."
      className="home-section home-section--compact home-surface-1 !pt-0"
      compact
    >
      <YEBOWelcomeBack className="mb-4" />
      <YEBODecisionHint scope="homepage" className="mb-4" />
      <YEBOIntelligenceHint scope="homepage" compact className="mb-4" />
      <YEBOProactiveBanner suggestions={PROACTIVE_SUGGESTIONS} className="mb-4" />
      <YEBOCrossPageContinuity className="mb-4" />

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <YEBOContinueShopping />
        <YEBOSmartReminders compact />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        {/* Ask AI card */}
        <AICard className="lg:col-span-1 home-surface-card" glass>
          <p className="font-Poppins font-semibold dark:text-white mb-2">Ask YEBO</p>
          <p className="text-sm text-gray-500 mb-4">
            Describe what you need in plain language. Full AI search connects later.
          </p>
          <div className="space-y-2 mb-4">
            {TRENDING_SEARCHES.slice(0, 3).map((q) => (
              <button
                key={q}
                type="button"
                className="ai-prompt-chip w-full text-left truncate"
                onClick={() => handleAskAI(q)}
              >
                {q}
              </button>
            ))}
          </div>
          <AIActionButton label="Chat with YEBO" icon="sparkles" onClick={() => handleAskAI()} />
        </AICard>

        {/* Trending + Smart */}
        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          <AICard padding="sm" className="home-surface-card">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineTrendingUp className="text-yebone-primary" size={18} />
              <p className="font-semibold text-sm dark:text-white">Trending searches</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((term) => (
                <span key={term} className="ai-prompt-chip text-[11px]">
                  {term}
                </span>
              ))}
            </div>
          </AICard>

          <AICard padding="sm" className="home-surface-card">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineLightBulb className="text-yebone-gold" size={18} />
              <p className="font-semibold text-sm dark:text-white">Smart suggestions</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SMART_SUGGESTIONS.map((tip) => (
                <span key={tip} className="ai-prompt-chip text-[11px]">
                  {tip}
                </span>
              ))}
            </div>
          </AICard>

          <AICard padding="sm" className="sm:col-span-2 home-surface-card">
            <div className="flex items-center gap-2 mb-3">
              <HiOutlineClock className="text-gray-400" size={18} />
              <p className="font-semibold text-sm dark:text-white">Recently searched</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {RECENTLY_SEARCHED.map((term) => (
                <button
                  key={term}
                  type="button"
                  className="ai-prompt-chip text-[11px]"
                  onClick={() => handleAskAI(`Show me ${term}`)}
                >
                  {term}
                </button>
              ))}
            </div>
          </AICard>
        </div>
      </div>

      <div className="mb-8">
        <p className="font-Poppins font-semibold mb-4 dark:text-white">YEBO shopping insights</p>
        <YEBOShoppingInsightCards compact />
      </div>

      {/* AI recommendation cards */}
      {recommendations.length > 0 && (
        <div>
          <p className="font-Poppins font-semibold mb-4 dark:text-white flex items-center gap-2">
            AI recommendation cards
            <span className="text-xs font-normal text-gray-500">· Based on marketplace trends</span>
          </p>
          <MarketplaceCardGrid>
            {recommendations.map((product) => (
              <MarketplaceCardSlot key={product._id}>
                <HomeProductCard data={product} compact fluid />
              </MarketplaceCardSlot>
            ))}
          </MarketplaceCardGrid>
        </div>
      )}
    </AISection>
  );
};

export default HomeAIDiscovery;
