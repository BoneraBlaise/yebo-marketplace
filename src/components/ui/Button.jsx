import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";

const variants = {
  primary:
    "bg-yebone-primary text-white hover:bg-yebone-primary-dark focus:ring-yebone-primary shadow-yebo active:scale-[0.98]",
  secondary:
    "bg-yebone-gold text-yebone-dark-text hover:opacity-90 focus:ring-yebone-gold",
  outline:
    "border-2 border-yebone-primary text-yebone-primary bg-transparent hover:bg-yebone-primary hover:text-white focus:ring-yebone-primary shadow-none",
  ghost:
    "bg-transparent text-yebone-primary hover:bg-yebone-light-gray dark:hover:bg-gray-800 shadow-none",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:scale-[0.98]",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-xl min-h-[2rem]",
  md: "px-6 py-2.5 rounded-xl min-h-[2.5rem]",
  lg: "px-8 py-3 text-base rounded-xl min-h-[3rem]",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  loading = false,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled || loading}
    className={classNames(
      typography.button,
      "inline-flex items-center justify-center gap-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      loading && "opacity-80",
      className
    )}
    {...props}
  >
    {loading && (
      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" aria-hidden="true" />
    )}
    {children}
  </button>
);

export default Button;
