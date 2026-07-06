import React, { useEffect, useRef } from "react";
import classNames from "classnames";
import AIResponseCard from "./AIResponseCard";

const AIConversation = ({ messages = [], isTyping = false, className, emptyState }) => {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  if (!messages.length && emptyState) {
    return emptyState;
  }

  return (
    <div className={classNames("flex flex-col gap-3 overflow-y-auto flex-1 min-h-0 px-1", className)}>
      {messages.map((msg) => (
        <AIResponseCard
          key={msg.id}
          role={msg.role}
          content={msg.content}
          placeholder={msg.placeholder || msg.isWelcome}
        />
      ))}
      {isTyping && (
        <div className="ai-message-assistant self-start">
          <div className="ai-typing-dots py-1">
            <span /><span /><span />
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
};

export default AIConversation;
