import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { HiOutlineLockClosed } from "react-icons/hi";
import { server } from "../../server";
import { Button } from "../ui";
import {
  AuthLayout,
  AuthPageChrome,
  AuthFloatingInput,
  AuthPasswordStrength,
} from "../Auth";
import { MARKETPLACE_NAME } from "../../ui-polish/brandConstants";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [visibleNew, setVisibleNew] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post(
        `${server}/user/reset-password`,
        {
          token,
          newPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful!");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
      console.error("Reset password error:", err);
    } finally {
      setProcessing(false);
    }
  };

  const passwordsMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  return (
    <AuthPageChrome>
      <AuthLayout
        title="Reset password"
        subtitle={`Choose a strong new password for your ${MARKETPLACE_NAME} account.`}
        showLogo={false}
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
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
          {processing ? "Resetting..." : "Reset password"}
        </Button>
      </form>
    </AuthLayout>
    </AuthPageChrome>
  );
};

export default ResetPassword;
