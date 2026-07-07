import React from "react";
import { focusRingClass } from "../accessibility";
import { motionClasses } from "../motion/MotionSystem";
import { logDesignSystemDiagnostics } from "../diagnostics/DesignSystemDiagnostics";

const baseBtn = `inline-flex items-center justify-center rounded-lg font-Poppins font-semibold ${focusRingClass} ${motionClasses.micro}`;

export const Button = ({ children, variant = "primary", size = "md", disabled, className = "", ...props }) => {
  const variants = {
    primary: "bg-yebone-primary text-white hover:bg-yebone-primary-dark",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white",
    ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-4 py-2 text-sm", lg: "px-6 py-3 text-base" };
  logDesignSystemDiagnostics("component", { component: "Button", variant });
  return (
    <button type="button" disabled={disabled} className={`${baseBtn} ${variants[variant]} ${sizes[size]} disabled:opacity-50 ${className}`} {...props}>
      {children}
    </button>
  );
};

export const IconButton = ({ children, label, className = "", ...props }) => (
  <button type="button" aria-label={label} className={`p-2 rounded-lg ${focusRingClass} ${className}`} {...props}>{children}</button>
);

export const Card = ({ children, className = "", ...props }) => (
  <div className={`rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm p-4 ${motionClasses.cardHover} ${className}`} {...props}>{children}</div>
);

export const StatisticCard = ({ label, value, trend, className = "" }) => (
  <Card className={className}><p className="text-sm text-gray-500">{label}</p><p className="text-2xl font-bold">{value}</p>{trend && <p className="text-xs text-green-600">{trend}</p>}</Card>
);

export const KPICard = StatisticCard;

export const Input = ({ className = "", error, ...props }) => (
  <input className={`w-full px-3 py-2 rounded-lg border ${error ? "border-red-500" : "border-gray-300 dark:border-gray-600"} bg-white dark:bg-gray-800 ${focusRingClass} ${className}`} {...props} />
);

export const Textarea = (props) => <textarea className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 ${focusRingClass}`} {...props} />;
export const SearchInput = (props) => <Input type="search" {...props} />;
export const Select = ({ children, className = "", ...props }) => <select className={`w-full px-3 py-2 rounded-lg border border-gray-300 ${focusRingClass} ${className}`} {...props}>{children}</select>;
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
export const Badge = ({ children, variant = "default" }) => {
  const v = { default: "bg-gray-100 text-gray-800", success: "bg-green-100 text-green-800", warning: "bg-yellow-100 text-yellow-800", error: "bg-red-100 text-red-800" };
  return <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${v[variant]}`}>{children}</span>;
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
  <div role="tablist" className="flex gap-1 border-b">{tabs.map((tab) => (
    <button key={tab.id} role="tab" aria-selected={active === tab.id} type="button" onClick={() => onChange?.(tab.id)} className={`px-4 py-2 text-sm font-medium border-b-2 ${active === tab.id ? "border-yebone-primary text-yebone-primary" : "border-transparent"} ${focusRingClass}`}>{tab.label}</button>
  ))}</div>
);
export const Dialog = ({ open, title, children, onClose }) => open ? (
  <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[1300] flex items-center justify-center bg-black/50">
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 max-w-lg w-full mx-4 shadow-xl"><h2 className="text-lg font-semibold mb-4">{title}</h2>{children}<Button variant="ghost" onClick={onClose} className="mt-4">Close</Button></div>
  </div>
) : null;
export const Modal = Dialog;
export const Drawer = ({ open, children, side = "right" }) => open ? <div className={`fixed inset-y-0 ${side === "right" ? "right-0" : "left-0"} w-80 bg-white dark:bg-gray-900 shadow-xl z-[1300] p-4`}>{children}</div> : null;
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
export const Skeleton = ({ className = "h-4 w-full" }) => <div className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`} aria-hidden="true" />;
export const Pagination = ({ page = 1, totalPages = 1, onChange }) => (
  <div className="flex gap-2 items-center">
    <Button size="sm" variant="ghost" disabled={page <= 1} onClick={() => onChange?.(page - 1)}>Prev</Button>
    <span className="text-sm">{page} / {totalPages}</span>
    <Button size="sm" variant="ghost" disabled={page >= totalPages} onClick={() => onChange?.(page + 1)}>Next</Button>
  </div>
);
export const DataTable = ({ columns = [], rows = [] }) => (
  <table className="w-full text-sm"><thead><tr>{columns.map((c) => <th key={c.key} className="text-left p-2 border-b">{c.label}</th>)}</tr></thead>
  <tbody>{rows.map((row, i) => <tr key={row.id || i}>{columns.map((c) => <td key={c.key} className="p-2 border-b">{row[c.key]}</td>)}</tr>)}</tbody></table>
);
export const DataGrid = DataTable;
export const EmptyState = ({ title = "No data", description, action }) => (
  <div className="text-center py-12"><p className="font-semibold">{title}</p>{description && <p className="text-sm text-gray-500 mt-1">{description}</p>}{action}</div>
);
export const LoadingState = ({ message = "Loading..." }) => <div className="flex flex-col items-center gap-2 py-8"><Spinner /><p className="text-sm text-gray-500">{message}</p></div>;
export const ErrorState = ({ message = "Something went wrong", retry }) => (
  <div className="text-center py-8 text-red-600"><p>{message}</p>{retry && <Button variant="ghost" onClick={retry} className="mt-2">Retry</Button>}</div>
);
export const SuccessState = ({ message = "Success" }) => <div className="text-center py-8 text-green-600"><p>{message}</p></div>;

export default {
  Button, IconButton, Card, StatisticCard, KPICard, Input, Textarea, SearchInput, Select,
  Checkbox, Radio, Switch, Toggle, Badge, Chip, Avatar, Tooltip, Popover, Dropdown, Menu,
  Accordion, Tabs, Dialog, Modal, Drawer, Sheet, Progress, Spinner, Skeleton, Pagination,
  DataTable, DataGrid, EmptyState, LoadingState, ErrorState, SuccessState,
};
