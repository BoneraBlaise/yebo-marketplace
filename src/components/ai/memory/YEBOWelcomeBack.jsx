import React, { useEffect } from "react";
import { HiOutlineSparkles } from "react-icons/hi";
import { useAIOptional } from "../core/AIContext";
import { useYEBOMemoryOptional } from "../../../ai/hooks/useYEBOMemory";
import { SHOPPING_SCOPES } from "../../../ai/memory/YEBOShoppingContext";

/** "Welcome back" banner driven by YEBO session memory */
const YEBOWelcomeBack = ({ className, onAction }) => {
  const ai = useAIOptional();
  const yeboMemory = useYEBOMemoryOptional();

  useEffect(() => {
    yeboMemory?.setActiveScope?.(SHOPPING_SCOPES.HOMEPAGE);
  }, [yeboMemory]);

  const message =
    yeboMemory?.getWelcomeMessage?.() ||
    ai?.getWelcomeMessage?.() ||
    "Welcome back — YEBO remembers your shopping session.";

  return (
    <div
      className={`yebone-glass rounded-xl border border-yebone-primary/20 p-4 yebone-fade-up ${className || ""}`}
      role="status"
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-yebone-primary/10 flex items-center justify-center shrink-0">
          <HiOutlineSparkles className="text-yebone-primary" size={18} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider font-semibold text-yebone-primary mb-1">
            YEBO remembers
          </p>
          <p className="text-sm font-semibold dark:text-white">{message}</p>
          <button
            type="button"
            onClick={() => {
              onAction?.();
              ai?.openPanel?.();
            }}
            className="text-xs font-semibold text-yebone-primary hover:underline mt-2"
          >
            Chat with YEBO →
          </button>
        </div>
      </div>
    </div>
  );
};

export default YEBOWelcomeBack;
