import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { server } from "../../server"; // Ensure this path is correct

const ResetPassword = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Password reset successful!");
        // Clear the form
        setNewPassword("");
        setConfirmPassword("");
        // Redirect after a short delay
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to reset password";
      toast.error(errorMessage);
      console.error("Reset password error:", err);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: "url('https://img.freepik.com/premium-photo/visualizing-ecommerce-shopping-cart-icon-connected-financial-time-management-symbols_1315577-762.jpg?w=740')",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-80"></div> {/* Overlay */}
      <div className="relative z-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-[#1f1f1f] dark:text-white py-8 px-4 shadow sm:rounded-lg sm:px-10 bg-opacity-90">
          <h2 className="text-center text-2xl font-bold text-gray-900 mb-6 dark:text-white">
            Reset Password
          </h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="new-password"
                  id="new-password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="appearance-none dark:bg-[#1f1f1f] dark:text-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  name="confirm-password"
                  id="confirm-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                {processing ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
