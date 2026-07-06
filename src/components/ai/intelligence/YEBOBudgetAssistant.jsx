import React, { useState } from "react";
import { BUDGET_OPTIONS } from "../../../ai/intelligence/yipMockData";
import AICard from "../primitives/AICard";
import AILoading from "../primitives/AILoading";

const YEBOBudgetAssistant = ({ onSubmit, advice, loading }) => {
  const [budget, setBudget] = useState(BUDGET_OPTIONS.ranges[1]);
  const [category, setCategory] = useState(BUDGET_OPTIONS.categories[0]);
  const [purpose, setPurpose] = useState(BUDGET_OPTIONS.purposes[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ budget, category, purpose });
  };

  return (
    <div className="space-y-3 yebone-fade-up">
      <p className="text-xs font-semibold text-yebone-primary">YEBO Budget Assistant</p>
      <form onSubmit={handleSubmit} className="space-y-2">
        <label className="block text-[10px] font-semibold text-gray-500 uppercase">Budget</label>
        <select
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
        >
          {BUDGET_OPTIONS.ranges.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <label className="block text-[10px] font-semibold text-gray-500 uppercase">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
        >
          {BUDGET_OPTIONS.categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <label className="block text-[10px] font-semibold text-gray-500 uppercase">Purpose</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
        >
          {BUDGET_OPTIONS.purposes.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <button type="submit" className="w-full h-10 rounded-xl bg-yebone-primary text-white text-sm font-semibold yebone-btn-lift">
          Get YEBO advice
        </button>
      </form>

      {loading && <AILoading label="YEBO is thinking..." variant="dots" />}

      {advice && !loading && (
        <AICard padding="sm" glass>
          <p className="font-semibold text-sm dark:text-white mb-2">{advice.headline}</p>
          <ul className="text-[11px] text-gray-500 space-y-1 mb-3">
            {advice.tips?.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          <p className="text-[10px] font-semibold text-yebone-primary uppercase mb-1">Mock picks</p>
          {advice.picks?.map((p) => (
            <p key={p} className="text-xs dark:text-gray-300">{p}</p>
          ))}
        </AICard>
      )}
    </div>
  );
};

export default YEBOBudgetAssistant;
