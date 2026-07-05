import React from "react";
import classNames from "classnames";
import { typography } from "../../design-system/typography";

const Input = React.forwardRef(
  ({ label, error, className, inputClassName, id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className={classNames("w-full", className)}>
        {label && (
          <label
            htmlFor={inputId}
            className={classNames(typography.caption, "block mb-1.5 font-medium")}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={classNames(
            typography.body,
            "w-full h-10 px-3 rounded-md border-2 border-yebone-primary bg-white dark:bg-gray-900 dark:text-white focus:ring-2 focus:ring-yebone-primary focus:ring-opacity-30 outline-none transition",
            error && "border-red-500",
            inputClassName
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
