import React from "react";
import "../adminControlCenters.css";

export const ControlCenterShell = ({ title, subtitle, children, actions = null }) => (
  <div className="admin-cc yebone-fade-up">
    <header className="admin-cc__header flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="admin-cc__title dark:text-white">{title}</h1>
        {subtitle ? <p className="admin-cc__subtitle">{subtitle}</p> : null}
      </div>
      {actions}
    </header>
    {children}
  </div>
);

export const ControlCenterTabs = ({ tabs, active, onChange }) => (
  <div className="admin-cc-tabs" role="tablist" aria-label="Control center sections">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={active === tab.id}
        className={`admin-cc-tab ${active === tab.id ? "admin-cc-tab--active" : ""}`}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export const ControlCenterCard = ({ children, className = "" }) => (
  <div className={`admin-cc-card ${className}`}>{children}</div>
);

export const ControlCenterSkeleton = ({ rows = 3 }) => (
  <div className="space-y-3" aria-busy="true" aria-label="Loading">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="admin-cc-skeleton" />
    ))}
  </div>
);

export const ControlCenterEmpty = ({ title, description }) => (
  <div className="admin-cc-empty admin-cc-card">
    <p className="font-medium text-gray-700 dark:text-gray-200">{title}</p>
    {description ? <p className="text-sm mt-1">{description}</p> : null}
  </div>
);

export const StickySaveBar = ({ dirty, saving, onSave, onDiscard, reason, onReasonChange }) => {
  if (!dirty) return null;
  return (
    <div className="admin-cc-sticky-save" role="region" aria-label="Unsaved changes">
      <div className="flex-1 min-w-[200px]">
        <p className="text-sm font-medium dark:text-white">Unsaved changes</p>
        {onReasonChange ? (
          <input
            type="text"
            value={reason || ""}
            onChange={(e) => onReasonChange(e.target.value)}
            placeholder="Reason for change (optional)"
            className="mt-2 w-full max-w-md h-9 px-3 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm"
            aria-label="Change reason"
          />
        ) : null}
      </div>
      <div className="flex gap-2">
        {onDiscard ? (
          <button type="button" className="admin-cc-btn admin-cc-btn--ghost" onClick={onDiscard}>
            Discard
          </button>
        ) : null}
        <button
          type="button"
          className="admin-cc-btn admin-cc-btn--primary"
          disabled={saving}
          onClick={onSave}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
};

export const ToggleSwitch = ({ enabled, onChange, label }) => (
  <button
    type="button"
    className={`admin-cc-toggle ${enabled ? "admin-cc-toggle--on" : ""}`}
    onClick={() => onChange(!enabled)}
    aria-pressed={enabled}
    aria-label={label}
  >
    <span className="admin-cc-toggle__knob" />
  </button>
);

export const MetricCard = ({ label, value }) => (
  <ControlCenterCard className="admin-cc-metric">
    <p className="admin-cc-metric__label">{label}</p>
    <p className="admin-cc-metric__value dark:text-white">{value}</p>
  </ControlCenterCard>
);

export const SimpleBarChart = ({ items = [], valueKey = "value", labelKey = "name" }) => {
  const max = Math.max(...items.map((item) => Number(item[valueKey] || 0)), 1);
  if (!items.length) return <ControlCenterEmpty title="No chart data yet" />;
  return (
    <div className="admin-cc-chart-bar" role="img" aria-label="Bar chart">
      {items.map((item) => (
        <div key={item[labelKey]} className="admin-cc-chart-bar__item">
          <div
            className="admin-cc-chart-bar__fill"
            style={{ height: `${(Number(item[valueKey] || 0) / max) * 100}%` }}
          />
          <span className="text-[10px] text-gray-500 truncate w-full text-center">{item[labelKey]}</span>
        </div>
      ))}
    </div>
  );
};

export const DataTable = ({ columns, rows, emptyMessage = "No records" }) => {
  if (!rows?.length) return <ControlCenterEmpty title={emptyMessage} />;
  return (
    <div className="admin-cc-table-wrap admin-cc-card !p-0 overflow-hidden">
      <table className="admin-cc-table">
        <thead>
          <tr className="text-gray-500">
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id || row.key}>
              {columns.map((col) => (
                <td key={col.key} className="dark:text-gray-200">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
