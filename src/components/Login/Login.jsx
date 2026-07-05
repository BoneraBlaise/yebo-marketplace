import { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import logo from "../../Assests/Logo/logo.png";
import { server } from "../../server";
import { ClipLoader } from "react-spinners";  // Importing the spinner
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);  // Track loading state

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const error = params.get('error');
    
    if (token) {
      Cookies.set("token", token, { expires: 90 });
      toast.success(t("auth.googleLoginSuccess"));
      navigate("/");
      window.location.reload();
    } else if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${server}/user/login-user`,
        { email, password },
        { withCredentials: true }
      );

      const token = res.data.token;

      // Always set the cookie with a 90-day expiration
      Cookies.set("token", token, { expires: 90 });

      toast.success(t("auth.loginSuccess"));
      navigate("/");
      window.location.reload();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error(t("auth.loginError"));
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };
// Update the handleGoogleLogin function
const handleGoogleLogin = () => {
  window.location.href = `${server}/auth/google`;  // Update the URL to match backend route
};



  return (
    <div
      className="relative h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage: `url("https://img.freepik.com/premium-photo/visualizing-ecommerce-shopping-cart-icon-connected-financial-time-management-symbols_1315577-762.jpg?w=740")`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      <div className="relative ml-2 mr-2 z-10 sm:mx-auto sm:w-full sm:max-w-md bg-white dark:bg-[#1f1f1f] dark:text-white bg-opacity-90 shadow-lg rounded-lg p-6">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="h-12 w-auto" />
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-[#1f1f1f] hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <FcGoogle className="h-5 w-5 mr-2" />
              {t("auth.signInWithGoogle")}
            </button>
          </div>
          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-[#1f1f1f] text-gray-500">
                {t("auth.orContinueWith")}
              </span>
            </div>
          </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white">
          {t("auth.emailAddress")}
        </label>
        <div className="mt-1">
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="appearance-none block dark:bg-[#1f1f1f] dark:text-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-white">
          {t("auth.password")}
        </label>
        <div className="mt-1 relative">
          <input
            type={visible ? "text" : "password"}
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="appearance-none dark:bg-[#1f1f1f] dark:text-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
          />
          <span className="absolute right-2 top-2">
            {visible ? (
              <AiOutlineEye
                className="cursor-pointer"
                size={20}
                onClick={() => setVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="cursor-pointer"
                size={20}
                onClick={() => setVisible(true)}
              />
            )}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            name="remember-me"
            id="remember-me"
            className="h-4 w-4 text-green-900 focus:ring-green-900 border-gray-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-200">
            {t("auth.rememberMe")}
          </label>
        </div>
        <div className="text-sm">
          <Link to="/forgot-password" className="font-medium text-green-900 hover:text-green-500">
            {t("auth.forgotPassword")}
          </Link>
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="w-full h-10 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#29625d] hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-900"
          disabled={loading}  // Disable the button when loading
        >
          {loading ? (
            <ClipLoader size={20} color="#fff" />  // Spinner component
          ) : (
            <span>{t("auth.signIn")}</span>
          )}
        </button>
      </div>
      <div className="flex justify-center">
        <p className="text-sm text-gray-900 dark:text-gray-200">
          {t("auth.noAccount")}{" "}
          <Link to="/sign-up" className="font-medium text-green-900 hover:text-green-500">
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </form>
      </div >
    </div >
  );
};

export default Login;
