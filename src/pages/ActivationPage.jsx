import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { server } from "../server";

const ActivationPage = () => {
  const { activation_token } = useParams();  // Retrieve the activation token from URL params
  const [error, setError] = useState(null);  // To store error messages
  const [success, setSuccess] = useState(false);  // To store success state

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        try {
          const response = await axios.post(`${server}/user/activation`, {
            activation_token,
          });

          console.log(response);  // You can handle response as needed
          setSuccess(true);  // Set success state to true if activation is successful
        } catch (err) {
          console.error(err);
          setError("Your token is expired or invalid!");  // Show error message if token is invalid
        }
      };
      sendRequest();
    }
  }, [activation_token]);  // Trigger useEffect when the token changes

  return (
    <div className="yebone-premium-screen bg-yebone-light-gray dark:bg-gray-950 dark:text-gray-200 w-full min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {error ? (
        <p>{error}</p>  // Show error message
      ) : success ? (
        <p>Your account has been activated successfully!</p>  // Show success message
      ) : (
        <p>Activating your account...</p>  // Loading message while the request is being processed
      )}
    </div>
  );
};

export default ActivationPage;
