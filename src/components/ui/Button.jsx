import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";

const variants = {
  primary:
    "bg-yebone-primary text-white hover:bg-yebone-primary-dark focus:ring-yebone-primary",
  secondary:
    "bg-yebone-gold text-yebone-dark-text hover:opacity-90 focus:ring-yebone-gold",
  outline:
    "border-2 border-yebone-primary text-yebone-primary bg-transparent hover:bg-yebone-primary hover:text-white",
  ghost:
    "bg-transparent text-yebone-primary hover:bg-yebone-light-gray dark:hover:bg-gray-800",
};

const sizes = {
  sm: "px-4 py-2 text-sm rounded-md",
  md: "px-6 py-2.5 rounded-lg",
  lg: "px-8 py-3 text-base rounded-lg",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  disabled = false,
  ...props
}) => (
  <button
    type={type}
    disabled={disabled}
    className={classNames(
      typography.button,
      "inline-flex items-center justify-center transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
