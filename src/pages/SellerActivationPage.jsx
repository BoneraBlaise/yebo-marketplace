import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const SellerActivationPage = () => {
  const { activation_token } = useParams();  // Get the token from the URL parameter
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          // Send POST request with the token in the URL
          const response = await axios.post(`${server}/shop/activation/${activation_token}`);
          setMessage("Your account has been created successfully!");  // Success message
        } catch (err) {
          setError(true);  // Error state if the token is invalid or expired
          setMessage(err.response?.data?.message || "An error occurred.");  // Set the error message
        }
      };
      sendRequest();
    }
  }, [activation_token]); // Re-run the effect when activation_token changes

  return (
    <div className="yebone-premium-screen bg-yebone-light-gray dark:bg-gray-950 dark:text-gray-200 w-full min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {error ? (
        <p>{message}</p>  // Display the error message if token is invalid/expired
      ) : (
        <p>{message}</p>  // Display success message
      )}
    </div>
  );
};

export default SellerActivationPage;
