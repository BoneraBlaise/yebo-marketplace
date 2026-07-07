import React from "react";
import { Input, Select } from "../components";

export const FormField = ({ label, error, children, required }) => (
  <div className="space-y-1">
    {label && <label className="block text-sm font-medium">{label}{required && " *"}</label>}
    {children}
    {error && <p className="text-xs text-red-600" role="alert">{error}</p>}
  </div>
);

export const FormGroup = ({ legend, children }) => (
  <fieldset className="space-y-4 border rounded-lg p-4">
    {legend && <legend className="text-sm font-semibold px-1">{legend}</legend>}
    {children}
  </fieldset>
);

export const FormInput = ({ label, error, ...props }) => (
  <FormField label={label} error={error} required={props.required}><Input error={error} {...props} /></FormField>
);

export const FormSelect = ({ label, error, children, ...props }) => (
  <FormField label={label} error={error}><Select {...props}>{children}</Select></FormField>
);

export const useFormValidation = (rules = {}) => {
  const validate = (values) => {
    const errors = {};
    Object.entries(rules).forEach(([field, rule]) => {
      if (rule.required && !values[field]) errors[field] = rule.message || "Required";
    });
    return { valid: Object.keys(errors).length === 0, errors };
  };
  return { validate };
};

export default { FormField, FormGroup, FormInput, FormSelect, useFormValidation };
