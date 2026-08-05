import { React, useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { getAuthErrorMessage } from "../../config/authService";
import { establishSellerSession } from "../../utils/sellerSession";
import { syncVendorAuthToken } from "../../config/vendorSession";
import { SELLER_DASHBOARD_PATH, SELLER_ONBOARDING_PATH } from "../../utils/sellerNav";

const ShopLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSeller) navigate(SELLER_DASHBOARD_PATH, { replace: true });
  }, [isSeller, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${server}/shop/login-shop`,
        { email, password },
        { withCredentials: true }
      );
      if (res.data?.token) {
        syncVendorAuthToken(res.data.token);
      }
      await establishSellerSession(dispatch, res.data?.token);
      toast.success("Login Success!");
      navigate(SELLER_DASHBOARD_PATH);
    } catch (err) {
      toast.error(getAuthErrorMessage(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url("https://img.freepik.com/free-photo/online-shopping-shopping-cart-placed-alongside-notebook-blue_1150-19158.jpg?t=st=1733046026~exp=1733049626~hmac=28f86b1ecd0923c1f0444a0d39208d81fcfce23a02d64c1e18584712d3ddc16a&w=1380")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 bg-black opacity-90"></div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 p-4">
        <div className="bg-white dark:bg-[#1f1f1f] dark:text-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
            <h2 className="mb-2 text-center text-xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
              Shop sign in
            </h2>
            <p className="mb-6 text-center text-sm text-gray-500 dark:text-gray-300">
              Legacy seller sign-in for expired sessions or bookmarked links.
              {isAuthenticated ? " New sellers should use onboarding instead." : null}
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none dark:bg-[#1f1f1f] dark:text-gray-200 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  type={visible ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none dark:bg-[#1f1f1f] dark:text-gray-200 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-900 focus:border-green-900 sm:text-sm"
                />
                {visible ? (
                  <AiOutlineEye className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(false)} />
                ) : (
                  <AiOutlineEyeInvisible className="absolute right-2 top-2 cursor-pointer" size={25} onClick={() => setVisible(true)} />
                )}
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#29625d] hover:bg-black disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Submit"}
              </button>
            </div>
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Need a shop?</h4>
              <Link to={SELLER_ONBOARDING_PATH} className="text-green-900 pl-2">
                Start onboarding
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopLogin;
