import React from "react";
import classNames from "classnames";

const MODES = [
  { id: "chat", label: "Chat" },
  { id: "search", label: "Search" },
  { id: "compare", label: "Compare" },
  { id: "budget", label: "Budget" },
  { id: "gift", label: "Gifts" },
];

const YEBOPanelModes = ({ active, onChange, className }) => (
  <div className={classNames("flex gap-1 overflow-x-auto hide-scrollbar pb-1", className)} role="tablist">
    {MODES.map(({ id, label }) => (
      <button
        key={id}
        type="button"
        role="tab"
        aria-selected={active === id}
        onClick={() => onChange(id)}
        className={classNames(
          "shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition yebone-btn-lift",
          active === id
            ? "bg-yebone-primary text-white shadow-md"
            : "bg-yebone-primary/10 text-yebone-primary hover:bg-yebone-primary/15"
        )}
      >
        {label}
      </button>
    ))}
  </div>
);

export default YEBOPanelModes;
