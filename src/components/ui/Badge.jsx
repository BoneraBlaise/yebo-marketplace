import React from "react";
import classNames from "classnames";

const variants = {
  primary: "bg-yebone-primary text-white",
  gold: "bg-yebone-gold text-yebone-dark-text",
  outline: "border border-yebone-primary text-yebone-primary bg-transparent",
  muted: "bg-yebone-light-gray text-yebone-dark-text dark:bg-gray-800 dark:text-gray-200",
};

const Badge = ({ children, variant = "primary", className, ...props }) => (
  <span
    className={classNames(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
      variants[variant],
      className
    )}
    {...props}
  >
    {children}
  </span>
);

export default Badge;
