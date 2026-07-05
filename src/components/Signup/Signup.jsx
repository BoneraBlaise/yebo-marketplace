import { React, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { ClipLoader } from "react-spinners";  // Import ClipLoader
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import logo from "../../Assests/Logo/logo.png";
import { FcGoogle } from 'react-icons/fc';
import { useTranslation } from "react-i18next";

const Singup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state


  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when form is submitted

    axios
      .post(`${server}/user/create-user`, { name, email, password, avatar })
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar();
        setLoading(false); // Reset loading state
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false); // Reset loading state in case of error
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${server}/auth/google`;
  };

  return (
    <div
      className="relative h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center"
      style={{
        backgroundImage: `url("https://img.freepik.com/free-photo/commerce-push-ecommerce-store-cart-supermarket_1418-13.jpg?t=st=1725965121~exp=1725968721~hmac=3b023393b534f75dba167e733ba30b86c11f0c6659bd9f777ee371368f5b5e13&w=740")`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black opacity-80"></div>

      {/* Content */}
      <div className="relative ml-2 mr-2 z-10 sm:mx-auto sm:w-full sm:max-w-md rounded-lg">
        <div className="bg-white dark:bg-[#1f1f1f] py-8 px-4 shadow sm:rounded-lg sm:px-10 bg-opacity-90">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img src={logo} alt="logo" className="mx-auto h-12 w-auto mb-4" />
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="mt-6">
             

              <div className="mt-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-white bg-white dark:bg-[#1f1f1f] hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <FcGoogle className="h-5 w-5 mr-2" />
                  {t("auth.signUpWithGoogle")}
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
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                {t("auth.fullName")}
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="appearance-none block dark:bg-[#1f1f1f] dark:text-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
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
                  className="appearance-none block dark:bg-[#1f1f1f] dark:text-white w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer dark:text-white"
                    size={25}
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer dark:text-white"
                    size={25}
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              ></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8 dark:text-white" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-[#1f1f1f] hover:bg-gray-50"
                >
                  <span>{t("auth.uploadFile")}</span>
                  <input
                    type="file"
                    name="avatar"
                    id="file-input"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileInputChange}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#29625d] hover:bg-green-900"
              >
                {loading ? (
                  <ClipLoader color="#fff" size={24} />
                ) : (
                  t("auth.submit")
                )}
              </button>
            </div>
           
            <div className={`${styles.noramlFlex} w-full`}>
              <h4 className="text-gray-700 dark:text-gray-200">{t("auth.alreadyHaveAccount")}</h4>
              <Link to="/login" className="text-green-900 pl-2">
                {t("auth.signIn")}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Singup;
