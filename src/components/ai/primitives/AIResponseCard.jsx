import React from "react";
import classNames from "classnames";
import { HiOutlineSparkles } from "react-icons/hi";
import AICard from "./AICard";

const AIResponseCard = ({ content, role = "assistant", className, placeholder = false }) => (
  <div
    className={classNames(
      role === "user" ? "ai-message-user" : "ai-message-assistant",
      className
    )}
  >
    {role === "assistant" && (
      <span className="flex items-center gap-1 text-[10px] font-semibold text-yebone-primary uppercase tracking-wider mb-1">
        <HiOutlineSparkles size={12} />
        YEBO
      </span>
    )}
    <p>{content}</p>
    {placeholder && (
      <p className="text-[10px] text-gray-400 mt-2 italic">Presentation preview · No AI backend</p>
    )}
  </div>
);

/** Card-style AI insight block for dashboards and PDP */
export const AIInsightResponseCard = ({ title, body, confidence, className }) => (
  <AICard className={className} padding="sm">
    <p className="text-xs font-semibold text-yebone-primary mb-1">{title}</p>
    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{body}</p>
    {confidence != null && (
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full rounded-full bg-yebone-primary" style={{ width: `${confidence}%` }} />
        </div>
        <span className="text-xs font-semibold text-yebone-primary">{confidence}%</span>
      </div>
    )}
  </AICard>
);

export default AIResponseCard;
