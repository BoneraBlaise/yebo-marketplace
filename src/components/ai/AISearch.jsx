import React from "react";
import classNames from "classnames";
import { HiOutlineSparkles } from "react-icons/hi";
import { AiOutlineSearch } from "react-icons/ai";
import { useAIOptional } from "./core/AIContext";
import Badge from "../ui/Badge";
import "./core/ai.css";

/**
 * Homepage AI search card — opens global assistant on interaction.
 * Presentation only; no search backend.
 */
const AISearch = ({ className, placeholder = "Ask YEBO to find products..." }) => {
  const ai = useAIOptional();

  const handleFocus = () => {
    ai?.openPanel();
  };

  return (
    <div
      className={classNames(
        "relative w-full rounded-2xl border border-yebone-primary/15 yebone-glass p-5 yebone-card-lift",
        className
      )}
      aria-label="AI Search"
    >
      <div className="flex items-center gap-2 mb-3">
        <Badge variant="gold">AI Search</Badge>
        <span className="text-xs font-semibold text-yebone-primary flex items-center gap-1">
          <HiOutlineSparkles size={14} /> Ask AI
        </span>
      </div>
      <div className="relative">
        <input
          type="text"
          readOnly
          onFocus={handleFocus}
          onClick={handleFocus}
          placeholder={placeholder}
          className="w-full h-12 pl-4 pr-12 rounded-xl border-2 border-yebone-primary/20 bg-white dark:bg-gray-800 dark:text-white cursor-pointer focus:border-yebone-primary focus:ring-4 focus:ring-yebone-primary/10 outline-none transition text-sm"
          aria-label="Open AI search assistant"
        />
        <AiOutlineSearch
          size={22}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-yebone-primary pointer-events-none"
        />
      </div>
      <p className="text-[11px] text-gray-400 mt-3">
        Tap to chat with YEBO · Powered by YIP
      </p>
    </div>
  );
};

export default AISearch;
