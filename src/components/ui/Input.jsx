import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";

const Input = React.forwardRef(
  ({ label, error, helper, className, inputClassName, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={classNames("w-full yebone-form-field !mb-0", className)}>
        {label && (
          <label htmlFor={inputId} className={classNames(typography.label, "yebone-form-label !mb-0")}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={classNames(
            typography.body,
            "w-full min-h-[2.75rem] px-4 rounded-xl border bg-white dark:bg-gray-900 dark:text-white transition-all duration-200",
            error ? "border-red-500 focus:ring-red-500/20" : "border-gray-300 dark:border-gray-600 focus:border-yebone-primary focus:ring-2 focus:ring-yebone-primary/20",
            "outline-none",
            inputClassName
          )}
          {...props}
        />
        {helper && !error && <p className="yebone-form-helper">{helper}</p>}
        {error && <p className="yebone-form-error" role="alert">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
