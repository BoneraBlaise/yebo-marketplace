import React, { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi";
import { Container } from "../ui";
import AIInsightCard from "../ai/primitives/AIInsightCard";
import YEBOProactiveBanner from "../ai/intelligence/YEBOProactiveBanner";
import { YEBOCrossPageContinuity, YEBOSmartReminders } from "../ai/memory";
import { YEBODecisionHint } from "../ai/decision";
import { YEBOIntelligenceHint } from "../ai/intelligence";
import { PROACTIVE_SUGGESTIONS } from "../../ai/intelligence/yipMockData";

const AI_METRICS = [
  { label: "Match Score", value: "94%" },
  { label: "Confidence", value: "87%" },
  { label: "Trend", value: "Rising" },
  { label: "Region Popularity", value: "High in East Africa" },
];

const AI_INSIGHTS = [
  { label: "Recommended Size", value: "Best fit for this category" },
  { label: "Recommended Fit", value: "Standard fit profile" },
];

const ProductAISections = ({ category, onTryOn }) => {
  const [recOpen, setRecOpen] = useState(false);

  return (
    <section className="pdp-ai-compact" aria-label="AI Shopping Assistant">
      <Container>
        <div className="pdp-ai-compact__card">
          <h2 className="pdp-ai-compact__title">
            <span aria-hidden="true">✨</span>
            AI Shopping Assistant
          </h2>

          <div className="pdp-ai-compact__list">
            <button
              type="button"
              className={`pdp-ai-compact__row${recOpen ? " is-open" : ""}`}
              onClick={() => setRecOpen((v) => !v)}
              aria-expanded={recOpen}
            >
              <span>AI Recommendation</span>
              <HiOutlineChevronDown className="pdp-ai-compact__chevron" aria-hidden="true" />
            </button>

            {recOpen && (
              <div className="pdp-ai-compact__panel">
                <YEBOProactiveBanner suggestions={PROACTIVE_SUGGESTIONS} className="mb-4" />
                <YEBOCrossPageContinuity className="mb-3" limit={2} />
                <YEBODecisionHint scope="product" className="mb-3" />
                <YEBOIntelligenceHint scope="product" compact className="mb-3" />
                <YEBOSmartReminders compact className="mb-4" />

                <p className="pdp-ai-compact__reason">
                  {category
                    ? `YEBO recommends this ${category} item based on seller trust, competitive pricing, and regional buyer patterns.`
                    : "YEBO recommends this item based on seller trust, competitive pricing, and buyer satisfaction."}
                </p>

                <div className="pdp-ai-compact__metrics">
                  {AI_METRICS.map(({ label, value }) => (
                    <div key={label} className="pdp-ai-compact__metric">
                      <span>{label}</span>
                      <strong>{value}</strong>
                    </div>
                  ))}
                </div>

                <div className="pdp-ai-compact__insights">
                  {AI_INSIGHTS.map(({ label, value }) => (
                    <div key={label} className="pdp-ai-compact__insight">
                      <span>{label}</span>
                      <p>{value}</p>
                    </div>
                  ))}
                </div>

                <AIInsightCard
                  title="Recommendation reason"
                  value="Strong match based on category trends, price competitiveness, and regional popularity."
                  subtitle="Full AI scoring connects when backend is ready."
                  confidence={87}
                />
              </div>
            )}

            <div className="pdp-ai-compact__tryon">
              <div className="pdp-ai-compact__tryon-copy">
                <span aria-hidden="true">✨</span>
                <span>Try this on yourself</span>
              </div>
              <button type="button" className="pdp-ai-compact__tryon-btn" onClick={onTryOn}>
                Try Now
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default ProductAISections;
