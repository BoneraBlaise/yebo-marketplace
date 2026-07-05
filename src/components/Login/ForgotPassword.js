import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import logo from "../../Assests/Logo/logo.png"; // Update with correct path if needed
import { server } from "../../server"; // Update with correct path if needed

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
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Password reset link sent to your email!");
        setEmail(""); // Clear the email field
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to send reset link";
      toast.error(errorMessage);
      console.error("Password reset error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage: `url("https://img.freepik.com/premium-photo/visualizing-ecommerce-shopping-cart-icon-connected-financial-time-management-symbols_1315577-762.jpg?w=740")`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      {/* Content */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1f1f1f] dark:text-white py-8 px-4 shadow sm:rounded-lg sm:px-10 bg-opacity-90 shadow-lg rounded-lg">
          <div className="flex justify-center mb-4">
            <img src={logo} alt="logo" className="h-12 w-auto" />
          </div>
          <h2 className="text-center text-2xl font-bold text-[#29625d] mb-6">
            Forgot Password
          </h2>
          <p className="text-center text-sm text-gray-600 mb-6 dark:text-gray-400">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none dark:bg-[#1f1f1f] dark:text-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="w-full h-10 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#29625d] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900"
                disabled={processing}
              >
                {processing ? "Sending..." : "Send Reset Link"}
              </button>
            </div>
            <div className="flex justify-center">
              <p className="text-sm text-gray-900 dark:text-gray-200">
                Remember your password?{" "}
                <Link to="/login" className="font-medium text-green-900 hover:text-green-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
