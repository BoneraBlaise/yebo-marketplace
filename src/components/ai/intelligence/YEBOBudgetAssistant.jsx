import React, { useState } from "react";
import { BUDGET_OPTIONS } from "../../../ai/intelligence/yipMockData";
import { PremiumSelect } from "../../ui";
import AICard from "../primitives/AICard";
import AILoading from "../primitives/AILoading";

const PRESET_RANGES = [
  { label: "Under 20,000 RWF", min: "", max: "20000" },
  { label: "20,000 – 50,000 RWF", min: "20000", max: "50000" },
  { label: "50,000 – 100,000 RWF", min: "50000", max: "100000" },
  { label: "100,000+ RWF", min: "100000", max: "" },
];

const formatBudgetLabel = (min, max) => {
  if (min && max) return `${Number(min).toLocaleString()} – ${Number(max).toLocaleString()} RWF`;
  if (max) return `Under ${Number(max).toLocaleString()} RWF`;
  if (min) return `${Number(min).toLocaleString()}+ RWF`;
  return "Flexible";
};

const YEBOBudgetAssistant = ({ onSubmit, advice, loading, premium = false }) => {
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [category, setCategory] = useState(BUDGET_OPTIONS.categories[0]);
  const [purpose, setPurpose] = useState(BUDGET_OPTIONS.purposes[0]);
  const [activePreset, setActivePreset] = useState(null);

  const applyPreset = (preset) => {
    setActivePreset(preset.label);
    setMinBudget(preset.min);
    setMaxBudget(preset.max);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const budget = formatBudgetLabel(minBudget, maxBudget);
    onSubmit?.({ budget, category, purpose, minBudget, maxBudget });
  };

  return (
    <div className="space-y-4 yebone-fade-up">
      {!premium && (
        <p className="text-xs font-semibold text-yebone-primary">YEBO Budget Assistant</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <p className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-2">Quick presets</p>
          <div className="flex flex-wrap gap-2">
            {PRESET_RANGES.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`ai-budget-preset ${activePreset === preset.label ? "is-active" : ""}`}
                onClick={() => applyPreset(preset)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Minimum Budget</span>
            <input
              type="number"
              min="0"
              value={minBudget}
              onChange={(e) => {
                setActivePreset(null);
                setMinBudget(e.target.value);
              }}
              placeholder="e.g. 20000"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-600 dark:text-gray-300 mb-1 block">Maximum Budget</span>
            <input
              type="number"
              min="0"
              value={maxBudget}
              onChange={(e) => {
                setActivePreset(null);
                setMaxBudget(e.target.value);
              }}
              placeholder="e.g. 50000"
              className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white"
            />
          </label>
        </div>

        <PremiumSelect
          label="Category"
          value={category}
          onChange={setCategory}
          options={BUDGET_OPTIONS.categories.map((c) => ({ value: c, label: c }))}
        />

        <PremiumSelect
          label="Purpose"
          value={purpose}
          onChange={setPurpose}
          options={BUDGET_OPTIONS.purposes.map((p) => ({ value: p, label: p }))}
        />

        <button type="submit" className="w-full h-10 rounded-xl bg-yebone-primary text-white text-sm font-semibold yebone-btn-lift">
          Find deals
        </button>
      </form>

      {loading && <AILoading label="Finding the best options..." variant="dots" />}

      {advice && !loading && (
        <AICard padding="sm" glass>
          <p className="font-semibold text-sm dark:text-white mb-2">{advice.headline}</p>
          <ul className="text-sm text-gray-500 space-y-1 mb-3">
            {advice.tips?.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
          {advice.picks?.length > 0 && (
            <div className="space-y-1">
              {advice.picks.map((p) => (
                <p key={p} className="text-sm dark:text-gray-300">{p}</p>
              ))}
            </div>
          )}
        </AICard>
      )}
    </div>
  );
};

export default YEBOBudgetAssistant;
