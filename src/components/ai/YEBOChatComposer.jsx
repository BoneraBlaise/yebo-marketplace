import React, { useRef, useState } from "react";
import { AiOutlineSend, AiOutlinePlus } from "react-icons/ai";
import { YEBO_CAPABILITIES } from "../../navigation/yeboCapabilities";

const YEBOChatComposer = ({
  shoppingMode,
  inputValue,
  setInputValue,
  onSend,
  onSearch,
  isTyping,
  onSetMode,
  onOpenCreate,
}) => {
  const [attachOpen, setAttachOpen] = useState(false);
  const attachRef = useRef(null);

  const placeholder =
    shoppingMode === "search"
      ? "Search products..."
      : shoppingMode === "compare"
        ? "Compare products..."
        : shoppingMode === "budget"
          ? "Describe your budget..."
          : "Ask YEBO anything...";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (shoppingMode === "search") {
      onSearch?.(inputValue);
      return;
    }
    onSend?.();
  };

  const handleCapability = (item) => {
    setAttachOpen(false);
    if (item.action === "property") {
      onOpenCreate?.("property");
      return;
    }
    onSetMode?.(item.mode);
  };

  return (
    <form onSubmit={handleSubmit} className="ai-composer">
      <div className="ai-composer__shell">
        <div className="relative" ref={attachRef}>
          <button
            type="button"
            className="ai-composer__attach-btn"
            aria-label="Open capabilities"
            aria-expanded={attachOpen}
            onClick={() => setAttachOpen((v) => !v)}
          >
            <AiOutlinePlus size={18} />
          </button>
          {attachOpen && (
            <>
              <div
                className="ai-composer__menu-backdrop"
                onClick={() => setAttachOpen(false)}
                aria-hidden
              />
              <div className="ai-composer__menu ai-composer__menu--attach" role="menu">
                {YEBO_CAPABILITIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    role="menuitem"
                    className="ai-composer__attach-row"
                    onClick={() => handleCapability(item)}
                  >
                    <span className="ai-composer__attach-icon" aria-hidden="true">
                      {item.icon}
                    </span>
                    <span className="ai-composer__attach-copy">
                      <span className="ai-composer__attach-title">{item.title}</span>
                      <span className="ai-composer__attach-desc">{item.desc}</span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="ai-composer__input dark:text-white"
          aria-label="YEBO message input"
        />

        <div className="ai-composer__actions">
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="ai-composer__send"
            aria-label="Send message"
          >
            <AiOutlineSend size={15} />
          </button>
        </div>
      </div>
    </form>
  );
};

export default YEBOChatComposer;
