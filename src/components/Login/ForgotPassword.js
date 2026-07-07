import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { HiOutlineMail } from "react-icons/hi";
import { server } from "../../server";
import { Button } from "../ui";
import { AuthLayout, AuthPageChrome, AuthFloatingInput } from "../Auth";
import { brandCopy, MARKETPLACE_NAME } from "../../ui-polish/brandConstants";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setProcessing(true);

    try {
      const response = await axios.post(
        `${server}/user/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success("Password reset link sent to your email!");
        setEmail("");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send reset link";
      toast.error(errorMessage);
      console.error("Password reset error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <AuthPageChrome>
      <AuthLayout
        title="Forgot password?"
        subtitle={`Enter your email and we'll send a secure reset link to your ${MARKETPLACE_NAME} account.`}
      >
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
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
          {processing ? "Sending..." : "Send reset link"}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-yebone-primary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
    </AuthPageChrome>
  );
};

export default ForgotPassword;
