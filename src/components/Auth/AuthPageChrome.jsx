import React from "react";
import { ThemeToggle } from "../../design-system/navigation/ThemeToggle";
import { MARKETPLACE_NAME, MARKETPLACE_TAGLINE } from "../../ui-polish/brandConstants";

/** Premium auth chrome — theme + branding — Phase 8I.1 */
const AuthPageChrome = ({ children }) => (
  <div className="auth-page">
    <div className="auth-bg-shape auth-bg-shape-1" aria-hidden="true" />
    <div className="auth-bg-shape auth-bg-shape-2" aria-hidden="true" />
    <div className="auth-bg-shape auth-bg-shape-3" aria-hidden="true" />

    <div className="fixed top-4 right-4 z-20" role="region" aria-label="Theme settings">
      <ThemeToggle />
    </div>

    <div className="auth-brand-lockup auth-card-enter" aria-hidden="true">
      <span className="auth-brand-name">{MARKETPLACE_NAME}</span>
      <span className="auth-brand-tagline">{MARKETPLACE_TAGLINE}</span>
    </div>

    {children}

    <p className="auth-footer-note">
      {MARKETPLACE_NAME} · Africa&apos;s AI-powered marketplace
    </p>
  </div>
);

export default AuthPageChrome;
