import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout, AuthPageChrome } from "../Auth";
import { MARKETPLACE_NAME } from "../../ui-polish/brandConstants";

/**
 * Legacy route handler — link-based reset replaced by OTP flow in Phase 3.
 */
const ResetPassword = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/forgot-password"), 5000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <AuthPageChrome>
      <AuthLayout
        title="Password reset updated"
        subtitle={`${MARKETPLACE_NAME} now uses a secure verification code. Please request a new code to reset your password.`}
      >
        <div className="space-y-4 text-center">
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center w-full px-8 py-3 text-base rounded-xl min-h-[3rem] bg-yebone-primary text-white hover:bg-yebone-primary-dark yebone-btn-lift font-semibold"
          >
            Go to Forgot Password
          </Link>
          <Link to="/login" className="text-sm font-semibold text-yebone-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </AuthLayout>
    </AuthPageChrome>
  );
};

export default ResetPassword;
