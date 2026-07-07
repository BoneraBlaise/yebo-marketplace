import React from "react";
import { focusRingClass } from "../accessibility";
import { motionClasses } from "../motion/MotionSystem";
import { logDesignSystemDiagnostics } from "../diagnostics/DesignSystemDiagnostics";

const baseBtn = `inline-flex items-center justify-center rounded-xl font-Poppins font-semibold shadow-sm ${focusRingClass} ${motionClasses.micro} disabled:opacity-50 disabled:cursor-not-allowed`;

export const Button = ({ children, variant = "primary", size = "md", disabled, loading, className = "", ...props }) => {
  const variants = {
    primary: "bg-yebone-primary text-white hover:bg-yebone-primary-dark active:scale-[0.98] shadow-yebo",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700",
    outline: "bg-transparent border-2 border-yebone-primary text-yebone-primary hover:bg-yebone-primary hover:text-white shadow-none",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none",
    danger: "bg-red-600 text-white hover:bg-red-700 active:scale-[0.98]",
  };
  const sizes = { sm: "px-3 py-1.5 text-xs min-h-[2rem]", md: "px-4 py-2.5 text-sm min-h-[2.5rem]", lg: "px-6 py-3 text-base min-h-[3rem]" };
  logDesignSystemDiagnostics("component", { component: "Button", variant });
  return (
    <button type="button" disabled={disabled || loading} className={`${baseBtn} ${variants[variant]} ${sizes[size]} ${loading ? "opacity-80" : ""} ${className}`} {...props}>
      {loading ? <span className="inline-flex items-center gap-2"><span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />{children}</span> : children}
    </button>
  );
};

export const IconButton = ({ children, label, className = "", ...props }) => (
  <button type="button" aria-label={label} className={`p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 ${focusRingClass} ${className}`} {...props}>{children}</button>
);

export const Card = ({ children, className = "", ...props }) => (
  <div className={`rounded-2xl border border-gray-200/80 dark:border-gray-700/80 bg-white dark:bg-gray-900 shadow-yebo p-5 md:p-6 ${motionClasses.cardHover} ${className}`} {...props}>{children}</div>
);

export const StatisticCard = ({ label, value, trend, className = "" }) => (
  <Card className={className}>
    <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">{label}</p>
    <p className="text-2xl md:text-3xl font-bold mt-1 font-Poppins">{value}</p>
    {trend && <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">{trend}</p>}
  </Card>
);

export const KPICard = StatisticCard;

export const Input = ({ className = "", error, ...props }) => (
  <input className={`w-full px-4 py-2.5 rounded-xl border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-800 text-sm ${focusRingClass} ${motionClasses.micro} ${className}`} {...props} />
);

export const Textarea = (props) => <textarea className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm ${focusRingClass}`} {...props} />;
export const SearchInput = (props) => <Input type="search" {...props} />;
export const Select = ({ children, className = "", ...props }) => <select className={`w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm ${focusRingClass} ${className}`} {...props}>{children}</select>;
export const Checkbox = (props) => <input type="checkbox" className={`rounded ${focusRingClass}`} {...props} />;
export const Radio = (props) => <input type="radio" className={focusRingClass} {...props} />;
export const Switch = ({ checked, onChange, label }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
    <span className={`w-10 h-5 rounded-full transition-colors ${checked ? "bg-yebone-primary" : "bg-gray-300"}`} />
    {label}
  </label>
);
export const Toggle = Switch;
export const Badge = ({ children, variant = "default", className = "" }) => {
  const v = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    success: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
  };
  return <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide ${v[variant]} ${className}`}>{children}</span>;
};
export const Chip = ({ children, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-sm">{children}{onRemove && <button type="button" onClick={onRemove} aria-label="Remove">×</button>}</span>
);
export const Avatar = ({ name, src, size = "md" }) => {
  const s = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-12 h-12" };
  return src ? <img src={src} alt={name} className={`${s[size]} rounded-full object-cover`} /> : <div className={`${s[size]} rounded-full bg-yebone-primary text-white flex items-center justify-center text-sm font-bold`}>{name?.[0]}</div>;
};
export const Tooltip = ({ children, text }) => <span title={text} className="relative">{children}</span>;
export const Popover = ({ open, children }) => open ? <div className="absolute z-[1500] mt-1 p-2 rounded-lg shadow-lg bg-white dark:bg-gray-900 border">{children}</div> : null;
export const Dropdown = ({ trigger, children, open }) => (
  <div className="relative">{trigger}{open && <div className="absolute right-0 mt-1 min-w-[8rem] rounded-lg shadow-lg bg-white dark:bg-gray-900 border py-1 z-[1000]">{children}</div>}</div>
);
export const Menu = ({ items = [] }) => <ul role="menu">{items.map((item) => <li key={item.id} role="menuitem"><button type="button" className={`w-full text-left px-4 py-2 hover:bg-gray-100 ${focusRingClass}`} onClick={item.onClick}>{item.label}</button></li>)}</ul>;
export const Accordion = ({ items = [] }) => (
  <div>{items.map((item) => <details key={item.id} className="border-b py-2"><summary className="cursor-pointer font-medium">{item.title}</summary><p className="pt-2 text-sm text-gray-600">{item.content}</p></details>)}</div>
);
export const Tabs = ({ tabs = [], active, onChange }) => (
  <div role="tablist" className="flex gap-1 border-b border-gray-200 dark:border-gray-700 overflow-x-auto pb-px">
    {tabs.map((tab) => (
      <button key={tab.id} role="tab" aria-selected={active === tab.id} type="button" onClick={() => onChange?.(tab.id)} className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px ${motionClasses.micro} ${active === tab.id ? "border-yebone-primary text-yebone-primary" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"} ${focusRingClass}`}>{tab.label}</button>
    ))}
  </div>
);
export const Dialog = ({ open, title, children, onClose }) => open ? (
  <div role="dialog" aria-modal="true" aria-label={title} className={`fixed inset-0 z-[1300] flex items-center justify-center bg-black/50 backdrop-blur-sm ${motionClasses.dialog}`}>
    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 md:p-8 max-w-lg w-full mx-4 shadow-yebo-lg border border-gray-200/80 dark:border-gray-700/80">
      <h2 className="text-lg font-Poppins font-semibold mb-4">{title}</h2>
      {children}
      <Button variant="ghost" onClick={onClose} className="mt-4">Close</Button>
    </div>
  </div>
) : null;
export const Modal = Dialog;
export const Drawer = ({ open, children, side = "right" }) => open ? <div className={`fixed inset-y-0 ${side === "right" ? "right-0" : "left-0"} w-80 md:w-96 bg-white dark:bg-gray-900 shadow-yebo-lg z-[1300] p-5 md:p-6 border-l border-gray-200 dark:border-gray-700 ${motionClasses.dialog}`}>{children}</div> : null;
export const Sheet = Drawer;
export const Progress = ({ value = 0, max = 100 }) => (
  <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
    <div className="h-full bg-yebone-primary transition-all duration-500" style={{ width: `${(value / max) * 100}%` }} />
  </div>
);
export const Spinner = ({ size = "md" }) => {
  const s = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };
  return <div className={`${s[size]} border-2 border-yebone-primary border-t-transparent rounded-full animate-spin`} role="status" aria-label="Loading" />;
};
export const Skeleton = ({ className = "h-4 w-full" }) => <div className={`yebone-skeleton rounded-lg ${className}`} aria-hidden="true" />;
export const Pagination = ({ page = 1, totalPages = 1, onChange }) => (
  <div className="flex gap-2 items-center">
    <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => onChange?.(page - 1)}>Prev</Button>
    <span className="text-sm tabular-nums">{page} / {totalPages}</span>
    <Button size="sm" variant="ghost" disabled={page >= totalPages} onClick={() => onChange?.(page + 1)}>Next</Button>
  </div>
);
export const DataTable = ({ columns = [], rows = [], emptyTitle = "No results", emptyDescription }) => {
  if (!rows.length) {
    return (
      <div className="yebone-table-wrap">
        <EmptyState title={emptyTitle} description={emptyDescription || "Try adjusting your filters or search."} />
      </div>
    );
  }
  return (
    <div className="yebone-table-wrap max-h-[480px] overflow-auto">
      <table className="yebone-table">
        <thead><tr>{columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr></thead>
        <tbody>{rows.map((row, i) => (
          <tr key={row.id || i}>{columns.map((c) => <td key={c.key}>{row[c.key]}</td>)}</tr>
        ))}</tbody>
      </table>
    </div>
  );
};
export const DataGrid = DataTable;
export const EmptyState = ({ title = "No data", description, action, icon }) => (
  <div className="text-center py-16 px-6">
    {icon && <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>}
    <p className="yebone-h3">{title}</p>
    {description && <p className="yebone-caption mt-2 max-w-md mx-auto">{description}</p>}
    {action && <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">{action}</div>}
  </div>
);
export const LoadingState = ({ message = "Loading...", skeleton = false }) => skeleton ? (
  <div className="yebone-skeleton-grid py-4" aria-busy="true" aria-label={message}>
    {[1, 2, 3, 4].map((n) => <div key={n} className="yebone-skeleton yebone-skeleton-card" />)}
  </div>
) : (
  <div className="flex flex-col items-center gap-3 py-10"><Spinner /><p className="text-sm text-gray-500">{message}</p></div>
);
export const ErrorState = ({ message = "Something went wrong", retry }) => (
  <div className="text-center py-8 px-4"><p className="text-red-600 dark:text-red-400 font-medium">{message}</p>{retry && <Button variant="ghost" onClick={retry} className="mt-3">Retry</Button>}</div>
);
export const SuccessState = ({ message = "Success" }) => <div className="text-center py-8 text-green-600 dark:text-green-400"><p className="font-medium">{message}</p></div>;

export default {
  Button, IconButton, Card, StatisticCard, KPICard, Input, Textarea, SearchInput, Select,
  Checkbox, Radio, Switch, Toggle, Badge, Chip, Avatar, Tooltip, Popover, Dropdown, Menu,
  Accordion, Tabs, Dialog, Modal, Drawer, Sheet, Progress, Spinner, Skeleton, Pagination,
  DataTable, DataGrid, EmptyState, LoadingState, ErrorState, SuccessState,
};
