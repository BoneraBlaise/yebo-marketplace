import React from "react";

const InlineField = ({
  label,
  required,
  error,
  children,
  htmlFor,
  hint,
}) => (
  <div className="seller-xp-field">
    {label && (
      <label htmlFor={htmlFor}>
        {label}
        {required ? " *" : ""}
      </label>
    )}
    {children}
    {error ? (
      <p className="seller-xp-error" role="alert" id={htmlFor ? `${htmlFor}-error` : undefined}>
        {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-gray-400 mt-1">{hint}</p>
    ) : null}
  </div>
);

export default InlineField;
