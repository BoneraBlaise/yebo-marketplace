import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import AIResponseCard from "./AIResponseCard";
import { YEBO_WELCOME_MESSAGE } from "../../../navigation/yeboCapabilities";

const SUGGESTIONS = [
  "Find running shoes under 50K",
  "Compare top phones",
  "Best deals this week",
];

const AIConversation = ({
  messages = [],
  isTyping = false,
  className,
  emptyState,
  premium = false,
  onSuggestion,
}) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const showEmpty = !messages.length && !isTyping;

  if (showEmpty && !emptyState && premium) {
    return (
      <div className="ai-chat-empty ai-chat-empty--welcome">
        <div className="ai-chat-welcome">
          {YEBO_WELCOME_MESSAGE.split("\n\n").map((block) => (
            <p key={block.slice(0, 24)} className="ai-chat-welcome__block">
              {block}
            </p>
          ))}
        </div>
        <div className="ai-chat-suggestions">
          {SUGGESTIONS.map((s) => (
            <button key={s} type="button" className="ai-chat-suggestion" onClick={() => onSuggestion?.(s)}>
              {s}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showEmpty && emptyState) {
    return emptyState;
  }

  return (
    <div className={classNames("ai-chat-thread yebone-premium-scroll", className)}>
      {messages.map((msg) => (
        <AIResponseCard
          key={msg.id}
          role={msg.role}
          content={msg.content}
          placeholder={msg.placeholder || msg.isWelcome}
          recommendations={msg.recommendations || []}
          premium={premium}
          createdAt={msg.createdAt || msg.timestamp}
        />
      ))}
      {isTyping && (
        <div className="ai-typing-bubble self-start">
          <div className="ai-typing-dots">
            <span /><span /><span />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default AIConversation;
