import React from "react";
import { FcGoogle } from "react-icons/fc";

const AuthGoogleButton = ({ children, onClick, disabled }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className="auth-google-btn yebone-btn-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
  >
    <FcGoogle size={20} aria-hidden="true" />
    {children}
  </button>
);

export default AuthGoogleButton;
