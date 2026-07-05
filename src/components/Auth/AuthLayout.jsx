import React from "react";
import logo from "../../Assests/Logo/logo.png";
import { typography } from "../../design-system/typography";

const AuthLayout = ({
  title,
  subtitle,
  children,
  wide = false,
  showLogo = true,
}) => (
  <div className="auth-page">
    <div className="auth-bg-shape auth-bg-shape-1" aria-hidden="true" />
    <div className="auth-bg-shape auth-bg-shape-2" aria-hidden="true" />
    <div className="auth-bg-shape auth-bg-shape-3" aria-hidden="true" />

    <div
      className={`auth-card auth-card-enter yebone-surface yebone-glass relative z-10 ${
        wide ? "auth-card-wide" : ""
      }`}
    >
      {showLogo && (
        <img src={logo} alt="Yebone" className="auth-logo" />
      )}
      {title && (
        <h1 className={`${typography.heading} text-center text-xl sm:text-2xl mb-2`}>
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  </div>
);

export default AuthLayout;
