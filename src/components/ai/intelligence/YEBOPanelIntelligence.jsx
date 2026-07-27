import React, { useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineCamera, HiOutlinePhotograph } from "react-icons/hi";
import { useAI } from "../core/AIContext";
import { SMART_SEARCH_EXAMPLES } from "../../../ai/intelligence/yipMockData";
import YEBOPanelModes from "./YEBOPanelModes";
import YEBOProactiveBanner from "./YEBOProactiveBanner";
import YEBOSmartSearchResults from "./YEBOSmartSearchResults";
import YEBOProductComparison from "./YEBOProductComparison";
import YEBOBudgetAssistant from "./YEBOBudgetAssistant";
import YEBOGiftFinder from "./YEBOGiftFinder";
import AIConversation from "../primitives/AIConversation";
import AILoading from "../primitives/AILoading";
import YEBODecisionHint from "../decision/YEBODecisionHint";
import YEBOIntelligenceHint from "./YEBOIntelligenceHint";

/** Mode-specific YEBO intelligence inside the assistant panel */
const YEBOPanelIntelligence = ({ premium = false, showConversationOnly = false, onSuggestion }) => {
  const {
    shoppingMode,
    setShoppingMode,
    messages,
    isTyping,
    proactiveSuggestions,
    smartSearchResults,
    comparisonResult,
    budgetAdvice,
    giftResults,
    runSmartSearch,
    runComparison,
    runBudgetAdvice,
    runGiftFinder,
    sendMessage,
    inputValue,
  } = useAI();

  const { allProducts } = useSelector((state) => state.products);
  const [giftLoading, setGiftLoading] = useState(false);
  const [budgetLoading, setBudgetLoading] = useState(false);

  const handleSearch = async (e) => {
    e?.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    await runSmartSearch(q, allProducts || []);
  };

  const handleCompare = () => runComparison((allProducts || []).slice(0, 2));

  const handleBudget = async (selection) => {
    setBudgetLoading(true);
    await runBudgetAdvice(selection);
    setBudgetLoading(false);
  };

  const handleGift = async (categoryId) => {
    setGiftLoading(true);
    await runGiftFinder(categoryId);
    setGiftLoading(false);
  };

  return (
    <div className={`flex flex-col min-h-0 flex-1 gap-3${premium ? " ai-panel__messages" : ""}`}>
      {!premium && <YEBOPanelModes active={shoppingMode} onChange={setShoppingMode} />}

      {!premium && (
        <>
          <YEBOProactiveBanner
            suggestions={proactiveSuggestions}
            onAction={() => sendMessage("Help me choose")}
          />
          <YEBODecisionHint scope="homepage" compact />
          <YEBOIntelligenceHint scope="homepage" compact />
        </>
      )}

      <div className="flex-1 overflow-y-auto min-h-0 space-y-3">
        {(shoppingMode === "chat" || showConversationOnly) && (
          <AIConversation
            messages={messages}
            isTyping={isTyping}
            premium={premium}
            onSuggestion={onSuggestion}
          />
        )}

        {!showConversationOnly && shoppingMode === "search" && (
          <>
            {!premium && (
              <form onSubmit={handleSearch} className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={() => {}}
                  readOnly
                  placeholder="Use the composer below to search"
                  className="flex-1 h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white opacity-60"
                />
              </form>
            )}
            {!premium && (
              <div className="flex flex-wrap gap-1">
                {SMART_SEARCH_EXAMPLES.slice(0, 3).map((ex) => (
                  <button key={ex} type="button" className="ai-prompt-chip text-[10px]" onClick={() => runSmartSearch(ex, allProducts || [])}>
                    {ex.slice(0, 28)}…
                  </button>
                ))}
              </div>
            )}
            {isTyping && <AILoading variant="dots" />}
            <YEBOSmartSearchResults data={smartSearchResults} compact premium={premium} />
          </>
        )}

        {!showConversationOnly && shoppingMode === "compare" && (
          <>
            <button type="button" onClick={handleCompare} className="w-full h-10 rounded-xl bg-yebone-primary/10 text-yebone-primary text-sm font-semibold yebone-btn-lift">
              Compare top marketplace picks
            </button>
            {isTyping && <AILoading variant="dots" />}
            <YEBOProductComparison data={comparisonResult} />
          </>
        )}

        {!showConversationOnly && shoppingMode === "budget" && (
          <YEBOBudgetAssistant onSubmit={handleBudget} advice={budgetAdvice} loading={budgetLoading || isTyping} premium={premium} />
        )}

        {!showConversationOnly && shoppingMode === "visual" && premium && (
          <div className="ai-visual-panel space-y-4 yebone-fade-up">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Upload a photo or use your camera to search visually.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="ai-visual-panel__action">
                <HiOutlineCamera size={22} />
                <span>Take Photo</span>
              </button>
              <button type="button" className="ai-visual-panel__action">
                <HiOutlinePhotograph size={22} />
                <span>Choose Image</span>
              </button>
            </div>
          </div>
        )}

        {!showConversationOnly && shoppingMode === "gift" && (
          <YEBOGiftFinder onSelect={handleGift} results={giftResults} loading={giftLoading || isTyping} />
        )}
      </div>
    </div>
  );
};

export default YEBOPanelIntelligence;
