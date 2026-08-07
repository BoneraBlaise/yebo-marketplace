import React from "react";
import classNames from "classnames";
import YEBOSmartSearchResults from "../intelligence/YEBOSmartSearchResults";

const formatTime = (ts) => {
  if (!ts) return null;
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return null;
  }
};

const AIResponseCard = ({
  content,
  role = "assistant",
  className,
  placeholder = false,
  recommendations = [],
  premium = false,
  createdAt,
}) => (
  <div
    className={classNames(
      premium
        ? role === "user"
          ? "ai-message-user--premium"
          : "ai-message-assistant--premium"
        : role === "user"
          ? "ai-message-user"
          : "ai-message-assistant",
      className
    )}
  >
    <p className="m-0 whitespace-pre-wrap">{content}</p>
    {role === "assistant" && recommendations.length > 0 && (
      <YEBOSmartSearchResults
        compact
        premium={premium}
        data={{
          results: recommendations,
          summary: content,
          parsedIntent: premium ? null : { type: "recommendation" },
        }}
      />
    )}
    {premium && createdAt && (
      <span className="ai-message__time">{formatTime(createdAt)}</span>
    )}
  </div>
);

export default AIResponseCard;
