import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { server } from "../server";
import { establishSellerSession } from "../utils/sellerSession";
import { SELLER_DASHBOARD_PATH } from "../utils/sellerNav";

const SellerActivationPage = () => {
  const { activation_token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("Activating your shop…");

  useEffect(() => {
    if (!activation_token) return undefined;

    let cancelled = false;

    const sendRequest = async () => {
      try {
        const response = await axios.post(`${server}/shop/activation/${activation_token}`, {}, { withCredentials: true });
        if (cancelled) return;
        await establishSellerSession(dispatch, response.data?.token);
        setMessage("Your shop is active. Redirecting to your seller dashboard…");
        setTimeout(() => navigate(SELLER_DASHBOARD_PATH, { replace: true }), 1200);
      } catch (err) {
        if (cancelled) return;
        setError(true);
        setMessage(err.response?.data?.message || "Activation failed. The link may be invalid or expired.");
      }
    };

    sendRequest();
    return () => {
      cancelled = true;
    };
  }, [activation_token, dispatch, navigate]);

  return (
    <div className="yebone-premium-screen bg-yebone-light-gray dark:bg-gray-950 dark:text-gray-200 w-full min-h-screen flex flex-col items-center justify-center px-4 text-center space-y-4">
      <p>{message}</p>
      {error ? (
        <Link to="/seller/onboarding" className="text-[#29625d] font-medium underline">
          Return to seller onboarding
        </Link>
      ) : null}
    </div>
  );
};

export default SellerActivationPage;
