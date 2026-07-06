import React from "react";
import classNames from "classnames";
import {
  HiOutlineSearch,
  HiOutlineEye,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
} from "react-icons/hi";

const ICONS = {
  search: HiOutlineSearch,
  eye: HiOutlineEye,
  wallet: HiOutlineCurrencyDollar,
  sparkles: HiOutlineSparkles,
};

const AIActionButton = ({ label, icon = "sparkles", onClick, className, size = "md" }) => {
  const Icon = ICONS[icon] || HiOutlineSparkles;
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={onClick}
      className={classNames(
        "inline-flex items-center gap-2 rounded-xl font-semibold",
        "bg-yebone-primary/10 text-yebone-primary border border-yebone-primary/15",
        "hover:bg-yebone-primary/15 yebone-btn-lift transition",
        "dark:bg-yebone-primary/20 dark:text-yebone-gold dark:border-yebone-gold/20",
        sizeClass,
        className
      )}
    >
      <Icon size={size === "sm" ? 14 : 16} />
      {label}
    </button>
  );
};

export default AIActionButton;
