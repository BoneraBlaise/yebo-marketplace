import React from "react";
import { YIP_PUBLIC_NAME } from "../config/yipConfig";

/** Streaming / typing indicator for YEBO */
const YIPStreamingIndicator = ({ label, variant = "dots" }) => (
  <div className="ai-message-assistant self-start" role="status" aria-live="polite">
    <span className="text-[10px] font-semibold text-yebone-primary uppercase tracking-wider mb-1 block">
      {YIP_PUBLIC_NAME} is thinking...
    </span>
    {variant === "partial" ? (
      <p className="text-sm text-gray-600 dark:text-gray-300 animate-pulse">Streaming response...</p>
    ) : (
      <div className="ai-typing-dots py-1">
        <span /><span /><span />
      </div>
    )}
  </div>
);

export default YIPStreamingIndicator;
