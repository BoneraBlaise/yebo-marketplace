import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { server } from "../../server";
import { Button } from "../ui";
import {
  AuthLayout,
  AuthPageChrome,
  AuthFloatingInput,
  AuthPasswordStrength,
  AuthOtpInput,
} from "../Auth";
import { isPasswordPolicyValid } from "../Auth/AuthPasswordStrength";
import { MARKETPLACE_NAME } from "../../ui-polish/brandConstants";

const OTP_TTL_MS = 10 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;
const GENERIC_SENT_MESSAGE =
  "If an account exists, a verification code has been sent.";

function formatCountdown(ms) {
  const totalSec = Math.max(0, Math.ceil(ms / 1000));
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

const SESSION_EXPIRED_PATTERN = /session has expired|reset session has expired|reset link has expired/i;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetSessionToken, setResetSessionToken] = useState("");
  const [processing, setProcessing] = useState(false);
  const [otpExpiresAt, setOtpExpiresAt] = useState(null);
  const [resendAvailableAt, setResendAvailableAt] = useState(null);
  const [countdownMs, setCountdownMs] = useState(0);
  const [resendCountdownMs, setResendCountdownMs] = useState(0);
  const [visibleNew, setVisibleNew] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);

  const startOtpTimers = useCallback((expiresInMs = OTP_TTL_MS) => {
    const now = Date.now();
    setOtpExpiresAt(now + expiresInMs);
    setResendAvailableAt(now + RESEND_COOLDOWN_MS);
  }, []);

  useEffect(() => {
    const token = searchParams.get("token");
    const urlStep = searchParams.get("step");

    if (urlStep === "reset" && token) {
      setProcessing(true);
      axios
        .post(`${server}/user/validate-reset-token`, { token })
        .then((res) => {
          if (res.data.success && res.data.resetSessionToken) {
            setResetSessionToken(res.data.resetSessionToken);
            setStep("password");
          }
        })
        .catch((err) => {
          const message = err.response?.data?.message || "Invalid or expired reset link.";
          if (SESSION_EXPIRED_PATTERN.test(message)) {
            setStep("sessionExpired");
          } else {
            toast.error(message);
          }
        })
        .finally(() => setProcessing(false));
    }
  }, [searchParams]);

  useEffect(() => {
    if (!otpExpiresAt && !resendAvailableAt) return undefined;

    const tick = () => {
      const now = Date.now();
      if (otpExpiresAt) setCountdownMs(Math.max(0, otpExpiresAt - now));
      if (resendAvailableAt) setResendCountdownMs(Math.max(0, resendAvailableAt - now));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [otpExpiresAt, resendAvailableAt]);

  const handleSendCode = async (e) => {
    e?.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(`${server}/user/forgot-password`, { email });
      if (response.data.success) {
        toast.success(response.data.message || GENERIC_SENT_MESSAGE);
        startOtpTimers(response.data.expiresInMs || OTP_TTL_MS);
        setOtp("");
        setStep("otp");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send verification code");
    } finally {
      setProcessing(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCountdownMs > 0) return;
    await handleSendCode();
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast.error("Please enter the 6-digit verification code");
      return;
    }

    if (countdownMs <= 0) {
      toast.error("Verification code has expired. Please request a new one.");
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(`${server}/user/verify-reset-otp`, {
        email,
        otp,
      });

      if (response.data.success) {
        setResetSessionToken(response.data.resetSessionToken);
        toast.success("Code verified!");
        setStep("password");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid verification code");
    } finally {
      setProcessing(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!isPasswordPolicyValid(newPassword)) {
      toast.error("Password does not meet security requirements");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(`${server}/user/reset-password`, {
        resetSessionToken,
        newPassword,
      });

      if (response.data.success) {
        setStep("success");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (err) {
      const message = err.response?.data?.message || "Failed to reset password";
      if (SESSION_EXPIRED_PATTERN.test(message)) {
        setStep("sessionExpired");
      } else {
        toast.error(message);
      }
    } finally {
      setProcessing(false);
    }
  };

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  if (step === "sessionExpired") {
    return (
      <AuthPageChrome>
        <AuthLayout
          title="Session expired"
          subtitle="Your password reset session has expired. Request a new verification code to continue."
        >
          <div className="space-y-4 py-2">
            <Button
              type="button"
              size="lg"
              className="w-full yebone-btn-lift"
              onClick={() => {
                setResetSessionToken("");
                setOtp("");
                setStep("email");
              }}
            >
              Request New Code
            </Button>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link to="/login" className="font-semibold text-yebone-primary hover:underline">
                Back to Login
              </Link>
            </p>
          </div>
        </AuthLayout>
      </AuthPageChrome>
    );
  }

  if (step === "success") {
    return (
      <AuthPageChrome>
        <AuthLayout
          title="Password updated"
          subtitle="Your password has been reset successfully. Redirecting to sign in..."
        >
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <span className="text-3xl text-green-600">✓</span>
            </div>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full px-8 py-3 text-base rounded-xl min-h-[3rem] bg-yebone-primary text-white hover:bg-yebone-primary-dark yebone-btn-lift font-semibold"
            >
              Back to Login
            </Link>
          </div>
        </AuthLayout>
      </AuthPageChrome>
    );
  }

  if (step === "password") {
    return (
      <AuthPageChrome>
        <AuthLayout
          title="Create new password"
          subtitle={`Choose a strong password for your ${MARKETPLACE_NAME} account.`}
        >
          <form className="space-y-4" onSubmit={handleResetPassword} noValidate>
            <div>
              <AuthFloatingInput
                id="new-password"
                name="new-password"
                label="New password"
                icon={HiOutlineLockClosed}
                autoComplete="new-password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                showPasswordToggle
                visible={visibleNew}
                onToggleVisible={() => setVisibleNew(!visibleNew)}
              />
              <AuthPasswordStrength password={newPassword} />
            </div>

            <AuthFloatingInput
              id="confirm-password"
              name="confirm-password"
              label="Confirm password"
              icon={HiOutlineLockClosed}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              showPasswordToggle
              visible={visibleConfirm}
              onToggleVisible={() => setVisibleConfirm(!visibleConfirm)}
              success={passwordsMatch}
              error={
                confirmPassword.length > 0 && !passwordsMatch
                  ? "Passwords do not match"
                  : undefined
              }
            />

            <Button
              type="submit"
              size="lg"
              className="w-full yebone-btn-lift mt-2"
              disabled={processing}
            >
              {processing ? "Resetting..." : "Reset Password"}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              <Link to="/login" className="font-semibold text-yebone-primary hover:underline">
                Back to Login
              </Link>
            </p>
          </form>
        </AuthLayout>
      </AuthPageChrome>
    );
  }

  if (step === "otp") {
    return (
      <AuthPageChrome>
        <AuthLayout
          title="Enter verification code"
          subtitle={`We sent a 6-digit code to ${email}. It expires in ${formatCountdown(countdownMs)}.`}
        >
          <form className="space-y-5" onSubmit={handleVerifyOtp} noValidate>
            <AuthOtpInput value={otp} onChange={setOtp} disabled={processing} />

            <Button
              type="submit"
              size="lg"
              className="w-full yebone-btn-lift"
              disabled={processing || countdownMs <= 0}
            >
              {processing ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="text-center space-y-2">
              {resendCountdownMs > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend code in {Math.ceil(resendCountdownMs / 1000)}s
                </p>
              ) : (
                <button
                  type="button"
                  className="text-sm font-semibold text-yebone-primary hover:underline disabled:opacity-50"
                  disabled={processing}
                  onClick={handleResendCode}
                >
                  Resend Code
                </button>
              )}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <button
                  type="button"
                  className="font-semibold text-yebone-primary hover:underline"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                  }}
                >
                  Change email
                </button>
                {" · "}
                <Link to="/login" className="font-semibold text-yebone-primary hover:underline">
                  Back to Login
                </Link>
              </p>
            </div>
          </form>
        </AuthLayout>
      </AuthPageChrome>
    );
  }

  return (
    <AuthPageChrome>
      <AuthLayout
        title="Forgot password?"
        subtitle={`Enter your email and we'll send a verification code to your ${MARKETPLACE_NAME} account.`}
      >
        <form className="space-y-5" onSubmit={handleSendCode} noValidate>
          <AuthFloatingInput
            id="email"
            name="email"
            type="email"
            label="Email address"
            icon={HiOutlineMail}
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            success={email.includes("@") && email.includes(".")}
          />

          <Button
            type="submit"
            size="lg"
            className="w-full yebone-btn-lift"
            disabled={processing}
          >
            {processing ? "Sending..." : "Send Code"}
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-yebone-primary hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </AuthLayout>
    </AuthPageChrome>
  );
};

export default ForgotPassword;
