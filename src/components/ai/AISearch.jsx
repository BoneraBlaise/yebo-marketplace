import React from "react";
import classNames from "classnames";
import { AiOutlineSearch } from "react-icons/ai";
import { typography } from "../../design-system/typography";
import Badge from "../ui/Badge";

/**
 * Placeholder for future AI-powered search. No functionality yet.
 */
const AISearch = ({ className, placeholder = "Ask Yebone AI to find products..." }) => (
  <div
    className={classNames(
      "relative w-full rounded-xl border-2 border-dashed border-yebone-primary/40 bg-yebone-light-gray/50 dark:bg-gray-900/50 p-4",
      className
    )}
    aria-label="AI Search placeholder"
  >
    <div className="flex items-center gap-2 mb-3">
      <Badge variant="gold">Coming soon</Badge>
      <span className={classNames(typography.caption, "font-medium")}>AI Search</span>
    </div>
    <div className="relative opacity-60 pointer-events-none">
      <input
        type="text"
        disabled
        placeholder={placeholder}
        className="w-full h-11 pl-4 pr-12 rounded-lg border border-yebone-primary/30 bg-white dark:bg-gray-800 dark:text-white"
      />
      <AiOutlineSearch
        size={22}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-yebone-primary"
      />
    </div>
  </div>
);

export default AISearch;
