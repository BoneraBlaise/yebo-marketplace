import React from "react";
import { Input, Select, Textarea } from "../components";
import { typography } from "../typography";

export const FormField = ({ label, error, helper, children, required, htmlFor }) => (
  <div className="yebone-form-field">
    {label && (
      <label htmlFor={htmlFor} className={`${typography.label} yebone-form-label`}>
        {label}{required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
      </label>
    )}
    {children}
    {helper && !error && <p className="yebone-form-helper">{helper}</p>}
    {error && <p className="yebone-form-error" role="alert">{error}</p>}
  </div>
);

export const FormGroup = ({ legend, description, children }) => (
  <fieldset className="rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-5 md:p-6 space-y-4 bg-white/50 dark:bg-gray-900/30">
    {legend && <legend className={`${typography.sectionTitle} px-1 mb-1`}>{legend}</legend>}
    {description && <p className={`${typography.caption} -mt-2 mb-2`}>{description}</p>}
    {children}
  </fieldset>
);

export const FormInput = ({ label, error, helper, id, ...props }) => (
  <FormField label={label} error={error} helper={helper} required={props.required} htmlFor={id || props.name}>
    <Input id={id || props.name} error={error} aria-invalid={!!error} {...props} />
  </FormField>
);

export const FormSelect = ({ label, error, helper, children, id, ...props }) => (
  <FormField label={label} error={error} helper={helper} htmlFor={id || props.name}>
    <Select id={id || props.name} {...props}>{children}</Select>
  </FormField>
);

export const FormTextarea = ({ label, error, helper, id, ...props }) => (
  <FormField label={label} error={error} helper={helper} htmlFor={id || props.name}>
    <Textarea id={id || props.name} {...props} />
  </FormField>
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

export default { FormField, FormGroup, FormInput, FormSelect, FormTextarea, useFormValidation };
