import React from "react";
import { AuthLayout } from "../../design-system/layouts";
import { Card, Progress } from "../../design-system/components";
import { logShellDiagnostics } from "../diagnostics/ShellDiagnostics";

const AUTH_STEPS = {
  login: { title: "Sign In", step: 1, total: 1 },
  register: { title: "Create Account", step: 1, total: 2 },
  "register-verify": { title: "Verify Email", step: 2, total: 2 },
  "forgot-password": { title: "Forgot Password", step: 1, total: 2 },
  "reset-password": { title: "Reset Password", step: 2, total: 2 },
  "email-verification": { title: "Email Verification", step: 1, total: 1 },
  "multi-step": { title: "Authentication", step: null, total: null },
};

/** Authentication layout shell — no auth logic — Phase 8H.1 */
export const AuthLayoutShell = ({
  variant = "login",
  step = null,
  totalSteps = null,
  children,
  footer,
  className = "",
}) => {
  const meta = AUTH_STEPS[variant] || AUTH_STEPS.login;
  const currentStep = step ?? meta.step;
  const total = totalSteps ?? meta.total;

  logShellDiagnostics("layout", { layout: "auth", variant, step: currentStep });

  return (
    <AuthLayout className={className}>
      <Card className="w-full">
        <header className="mb-6 text-center">
          <h1 className="text-xl font-Poppins font-semibold">{meta.title}</h1>
          {total > 1 && currentStep && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-2">Step {currentStep} of {total}</p>
              <Progress value={(currentStep / total) * 100} />
            </div>
          )}
        </header>
        <div data-auth-variant={variant} role="region" aria-label={meta.title}>
          {children}
        </div>
        {footer && <footer className="mt-6 text-center text-sm text-gray-500">{footer}</footer>}
      </Card>
    </AuthLayout>
  );
};

export const LoginLayoutShell = (props) => <AuthLayoutShell variant="login" {...props} />;
export const RegisterLayoutShell = (props) => <AuthLayoutShell variant="register" {...props} />;
export const ForgotPasswordLayoutShell = (props) => <AuthLayoutShell variant="forgot-password" {...props} />;
export const ResetPasswordLayoutShell = (props) => <AuthLayoutShell variant="reset-password" {...props} />;
export const EmailVerificationLayoutShell = (props) => <AuthLayoutShell variant="email-verification" {...props} />;
export const MultiStepAuthLayoutShell = (props) => <AuthLayoutShell variant="multi-step" {...props} />;

export default AuthLayoutShell;
