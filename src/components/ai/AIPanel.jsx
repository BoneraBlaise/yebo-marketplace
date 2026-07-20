import React, { useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineSparkles } from "react-icons/hi";
import { AiOutlineSend } from "react-icons/ai";
import { useAI } from "./core/AIContext";
import YEBOErrorState from "../../ai/components/YEBOErrorState";
import YEBOPanelIntelligence from "./intelligence/YEBOPanelIntelligence";
import YEBOWelcomeBack from "./memory/YEBOWelcomeBack";
import YEBOProviderStatus from "./orchestration/YEBOProviderStatus";
import YEBOKnowledgeHint from "./knowledge/YEBOKnowledgeHint";
import YEBOAgentHint from "./agents/YEBOAgentHint";
import { Badge } from "../ui";
import "./core/ai.css";

const AIPanel = () => {
  const {
    isPanelOpen,
    closePanel,
    shoppingMode,
    inputValue,
    setInputValue,
    sendMessage,
    isTyping,
    isStreaming,
    lastError,
    pendingAction,
    confirmPendingAction,
    cancelPendingAction,
    assistantProviderIndicator,
  } = useAI();

  useEffect(() => {
    if (!isPanelOpen) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") closePanel();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isPanelOpen, closePanel]);

  if (!isPanelOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (shoppingMode === "chat") sendMessage(inputValue);
  };

  const activeProviderLabel = assistantProviderIndicator
    ? `${assistantProviderIndicator.emoji} ${assistantProviderIndicator.label}`
    : "🔴 Offline";

  return (
    <>
      <div className="ai-panel-overlay" onClick={closePanel} aria-hidden />
      <aside
        className="ai-panel"
        role="dialog"
        aria-modal="true"
        aria-label="Chat with YEBO"
      >
        <div className="shrink-0 flex items-center justify-between gap-3 px-4 py-3.5 border-b border-gray-100/80 dark:border-gray-800/80 yebone-glass bg-white/90 dark:bg-gray-950/90">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yebone-primary to-yebone-primary-dark flex items-center justify-center shrink-0">
              <HiOutlineSparkles className="text-yebone-gold" size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="font-Poppins font-semibold text-base dark:text-white truncate">YEBO</h2>
              <p className="text-[11px] text-gray-500 truncate">
                Shopping intelligence · Powered by YIP
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closePanel}
            className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center yebone-btn-lift shrink-0"
            aria-label="Close YEBO assistant"
          >
            <RxCross1 size={20} />
          </button>
        </div>

        <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
          {lastError && (
            <YEBOErrorState error={lastError} onRetry={() => sendMessage(inputValue)} className="mb-3" />
          )}
          {pendingAction && (
            <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 p-3 mb-3">
              <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                Confirmation required
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-200 mb-3">
                {pendingAction.summary}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={confirmPendingAction}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-lg bg-yebone-primary text-white text-xs font-medium disabled:opacity-50"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  onClick={cancelPendingAction}
                  disabled={isTyping}
                  className="px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 text-xs font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          <YEBOWelcomeBack className="mb-3" />
          <YEBOProviderStatus compact className="mb-3" />
          <YEBOKnowledgeHint query="shipping" compact className="mb-3" />
          <YEBOAgentHint task="find product" compact className="mb-3" />
          <YEBOPanelIntelligence />
        </div>

        {shoppingMode === "chat" && (
          <form
            onSubmit={handleSubmit}
            className="shrink-0 px-4 py-3.5 border-t border-gray-100/80 dark:border-gray-800/80 yebone-glass bg-white/90 dark:bg-gray-950/90"
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold" className="text-[10px]">YEBO</Badge>
              <span className="text-[10px] text-gray-400">
                Active Provider · {activeProviderLabel}
                {isStreaming ? " · streaming" : ""}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask YEBO anything..."
                className="flex-1 h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white focus:border-yebone-primary focus:ring-4 focus:ring-yebone-primary/10 outline-none transition"
                aria-label="YEBO message input"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-11 h-11 rounded-xl bg-yebone-primary text-white flex items-center justify-center yebone-btn-lift disabled:opacity-50 shrink-0"
                aria-label="Send message"
              >
                <AiOutlineSend size={18} />
              </button>
            </div>
          </form>
        )}
      </aside>
    </>
  );
};

export default AIPanel;
