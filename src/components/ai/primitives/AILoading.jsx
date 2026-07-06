import React from "react";
import classNames from "classnames";

const AILoading = ({ label = "YEBO is thinking...", className, variant = "shimmer" }) => (
  <div className={classNames("flex flex-col items-center gap-3 py-6", className)} role="status" aria-live="polite">
    {variant === "dots" ? (
      <div className="ai-typing-dots" aria-hidden>
        <span /><span /><span />
      </div>
    ) : (
      <div className="w-full max-w-xs h-2 rounded-full ai-shimmer overflow-hidden" aria-hidden />
    )}
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
  </div>
);

export default AILoading;
