import React from "react";
import { useLocation } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import { useAI } from "./core/AIContext";
import AIPanel from "./AIPanel";
import "./core/ai.css";

const HIDDEN_PATHS = ["/login", "/sign-up", "/payment", "/shop-login"];

const GlobalAIFab = () => {
  const { openPanel, isPanelOpen } = useAI();
  const { pathname } = useLocation();

  const isHidden = HIDDEN_PATHS.some((p) => pathname.startsWith(p));
  const isDashboard = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  const isCheckout = pathname === "/checkout";

  if (isHidden) return null;

  const fabClass = isDashboard || isCheckout ? "ai-fab ai-fab--offset-mobile" : "ai-fab ai-fab--default";

  return (
    <>
      {!isPanelOpen && (
        <button
          type="button"
          onClick={openPanel}
          className={`${fabClass} yebone-animate-float`}
          aria-label="Open YEBO Assistant"
          title="Chat with YEBO"
        >
          <HiOutlineSparkles size={24} className="text-yebone-gold" />
        </button>
      )}
      <AIPanel />
    </>
  );
};

export default GlobalAIFab;
