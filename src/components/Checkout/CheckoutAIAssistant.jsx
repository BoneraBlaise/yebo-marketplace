import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { CHECKOUT_INTELLIGENCE_EXTRAS } from "../../ai/intelligence/yipMockData";
import YEBODecisionHint from "../ai/decision/YEBODecisionHint";
import YEBOIntelligenceHint from "../ai/intelligence/YEBOIntelligenceHint";

const CheckoutAIAssistant = () => {
  const [open, setOpen] = useState(false);

  return (
    <section className="checkout-ai" aria-label="AI Shopping Assistant">
      <div className="checkout-ai__card">
        <button
          type="button"
          className={`checkout-ai__toggle${open ? " is-open" : ""}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <span>
            <span aria-hidden="true">✨</span> AI Shopping Assistant
          </span>
          <HiOutlineChevronDown className="checkout-ai__chevron" aria-hidden="true" />
        </button>

        {open && (
          <div className="checkout-ai__panel">
            <YEBODecisionHint scope="checkout" className="mb-2" />
            <YEBOIntelligenceHint scope="checkout" compact className="mb-3" />
            <div className="checkout-ai__metrics">
              {CHECKOUT_INTELLIGENCE_EXTRAS.map(({ id, title, value, confidence }) => (
                <div key={id} className="checkout-ai__metric">
                  <span>{title}</span>
                  <strong>{value}</strong>
                  {confidence != null && (
                    <em>{confidence}% confidence</em>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CheckoutAIAssistant;
