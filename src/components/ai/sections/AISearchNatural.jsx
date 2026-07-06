import React, { useState } from "react";
import { useSelector } from "react-redux";
import { HiOutlineSparkles } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { useAIOptional } from "../core/AIContext";
import AICard from "../primitives/AICard";
import AILoading from "../primitives/AILoading";
import YEBOSmartSearchResults from "../intelligence/YEBOSmartSearchResults";
import { YEBODecisionHint } from "../decision";
import { YEBOIntelligenceHint } from "../intelligence";
import { Badge } from "../../ui";
import { SMART_SEARCH_EXAMPLES } from "../../../ai/intelligence/yipMockData";

/**
 * Natural language search UI — mock results via YIP.
 * Does not modify existing search logic or navigation.
 */
const AISearchNatural = ({ className }) => {
  const ai = useAIOptional();
  const { allProducts } = useSelector((state) => state.products);
  const [query, setQuery] = useState("");
  const [previewLoading, setPreviewLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handlePreview = async (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    setPreviewLoading(true);
    setResults(null);
    if (ai?.runSmartSearch) {
      const data = await ai.runSmartSearch(trimmed, allProducts || []);
      setResults(data);
    } else {
      setTimeout(() => {
        setResults({ query: trimmed, results: [], tips: ["Open YEBO for full experience"] });
      }, 800);
    }
    setPreviewLoading(false);
  };

  const handleExample = (example) => {
    setQuery(example);
    setResults(null);
  };

  const handleOpenAssistant = () => {
    if (ai) {
      ai.setShoppingMode?.("search");
      ai.openPanel();
      if (query.trim()) ai.runSmartSearch?.(query.trim(), allProducts || []);
    }
  };

  return (
    <AICard className={className} glass>
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="gold">YEBO Search</Badge>
        <span className="text-xs font-semibold text-yebone-primary flex items-center gap-1">
          <HiOutlineSparkles size={14} /> Smart shopping search
        </span>
        <span className="text-[10px] text-gray-400 ml-auto">Header search unchanged</span>
      </div>

      <form onSubmit={handlePreview} className="relative mb-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try: "I need white sneakers under 50000 RWF"'
          className="w-full h-12 pl-4 pr-24 rounded-xl border-2 border-yebone-primary/20 bg-white dark:bg-gray-900 dark:text-white focus:border-yebone-primary focus:ring-4 focus:ring-yebone-primary/10 outline-none transition text-sm"
          aria-label="YEBO natural language search"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-9 px-3 rounded-lg bg-yebone-primary text-white text-xs font-semibold flex items-center gap-1 yebone-btn-lift"
        >
          <AiOutlineSearch size={16} /> Ask YEBO
        </button>
      </form>

      <YEBODecisionHint scope="search" compact className="mb-3" />
      <YEBOIntelligenceHint scope="search" compact className="mb-3" />

      <div className="flex flex-wrap gap-2 mb-4">
        {SMART_SEARCH_EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            className="ai-prompt-chip text-[11px]"
            onClick={() => handleExample(ex)}
          >
            {ex}
          </button>
        ))}
      </div>

      {previewLoading && <AILoading label="YEBO is thinking..." variant="dots" />}

      {results && !previewLoading && (
        <>
          <YEBOSmartSearchResults data={results} />
          <button
            type="button"
            onClick={handleOpenAssistant}
            className="mt-3 text-xs font-semibold text-yebone-primary hover:underline"
          >
            Continue in YEBO assistant →
          </button>
        </>
      )}
    </AICard>
  );
};

export default AISearchNatural;
