import React from "react";
import logo from "../../Assests/Logo/logo.png";
import { typography } from "../../design-system/typography";
import { MARKETPLACE_NAME } from "../../ui-polish/brandConstants";

const AuthLayout = ({
  title,
  subtitle,
  children,
  wide = false,
  showLogo = true,
}) => (
  <>
    <div
      className={`auth-card auth-card-enter yebone-surface yebone-glass relative z-10 ${
        wide ? "auth-card-wide" : ""
      }`}
    >
      {showLogo && (
        <img src={logo} alt={MARKETPLACE_NAME} className="auth-logo" />
      )}
      {title && (
        <h1 className={`${typography.heading} text-center text-xl sm:text-2xl mb-2 font-Poppins`}>
          {title}
        </h1>
      )}
      {subtitle && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-6 leading-relaxed max-w-sm mx-auto">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  </>
);

export default AuthLayout;
