import React from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const AuthFloatingInput = ({
  id,
  name,
  type = "text",
  label,
  value,
  onChange,
  icon: Icon,
  required,
  autoComplete,
  showPasswordToggle,
  visible,
  onToggleVisible,
  error,
  success,
  className = "",
  ...props
}) => {
  const inputType =
    showPasswordToggle ? (visible ? "text" : "password") : type;

  return (
    <div className={`auth-floating-field ${className}`}>
      {Icon && (
        <Icon className="auth-field-icon" size={18} aria-hidden="true" />
      )}
      <input
        id={id}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        placeholder=" "
        className={`auth-floating-input dark:text-white ${
          error ? "is-error" : success ? "is-success" : ""
        }`}
        aria-invalid={Boolean(error)}
        {...props}
      />
      <label htmlFor={id} className="auth-floating-label">
        {label}
      </label>
      {showPasswordToggle && (
        <button
          type="button"
          className="auth-toggle-password"
          onClick={onToggleVisible}
          aria-label={visible ? "Hide password" : "Show password"}
          tabIndex={-1}
        >
          {visible ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20} />}
        </button>
      )}
      {error && (
        <p className="mt-1.5 text-xs text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default AuthFloatingInput;
