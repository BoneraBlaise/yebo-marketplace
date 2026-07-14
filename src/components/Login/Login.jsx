import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { ClipLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { Button } from "../ui";
import {
  AuthLayout,
  AuthPageChrome,
  AuthFloatingInput,
  AuthGoogleButton,
  AuthDivider,
} from "../Auth";
import { brandCopy } from "../../ui-polish/brandConstants";
import { useDispatch } from "react-redux";
import { setAuthToken } from "../../config/authStorage";
import {
  buildGoogleAuthUrl,
  describeAxiosFailure,
  formatAxiosErrorDetails,
} from "../../config/authService";
import { getRuntimeApiDiagnostics } from "../../config/serverConfig";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (token) {
      setAuthToken(token);
      toast.success(t("auth.googleLoginSuccess"));
      navigate("/");
    } else if (error) {
      toast.error(decodeURIComponent(error));
    }
  }, [navigate, t]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const loginUrl = `${server}/user/login-user`;
    console.info("[Login] Attempt", { loginUrl, ...getRuntimeApiDiagnostics() });

    try {
      const res = await axios.post(
        loginUrl,
        { email, password },
        { withCredentials: true }
      );

      const token = res.data.token;

      setAuthToken(token);
      dispatch({
        type: "LoadUserSuccess",
        payload: res.data.user,
      });

      toast.success(t("auth.loginSuccess"));
      navigate("/profile");
    } catch (err) {
      const details = formatAxiosErrorDetails(err);
      console.error("[Login] Failed", details, err);
      toast.error(describeAxiosFailure(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = buildGoogleAuthUrl();
  };

  return (
    <AuthPageChrome>
      <AuthLayout
        title={t("auth.signIn")}
        subtitle={`${brandCopy.marketplaceWelcome} — sign in to continue shopping.`}
      >
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthGoogleButton onClick={handleGoogleLogin} disabled={loading}>
          {t("auth.signInWithGoogle")}
        </AuthGoogleButton>

        <AuthDivider text={t("auth.orContinueWith")} />

        <AuthFloatingInput
          id="email"
          name="email"
          type="email"
          label={t("auth.emailAddress")}
          icon={HiOutlineMail}
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          success={email.includes("@") && email.includes(".")}
        />

        <AuthFloatingInput
          id="password"
          name="password"
          label={t("auth.password")}
          icon={HiOutlineLockClosed}
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPasswordToggle
          visible={visible}
          onToggleVisible={() => setVisible(!visible)}
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="remember-me"
              id="remember-me"
              className="auth-checkbox"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {t("auth.rememberMe")}
            </span>
          </label>
          <Link
            to="/forgot-password"
            className="text-sm font-semibold text-yebone-primary hover:text-yebone-primary-dark transition-colors"
          >
            {t("auth.forgotPassword")}
          </Link>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full yebone-btn-lift mt-2"
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="#fff" /> : t("auth.signIn")}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 pt-2">
          {t("auth.noAccount")}{" "}
          <Link
            to="/sign-up"
            className="font-semibold text-yebone-primary hover:underline"
          >
            {t("auth.signUp")}
          </Link>
        </p>
        <div className="auth-trust-row" aria-label="Trust indicators">
          <span className="auth-trust-item">🔒 Secure login</span>
          <span className="auth-trust-item">✨ Powered by YEBO AI</span>
          <span className="auth-trust-item">🛡️ Verified sellers</span>
        </div>
      </form>
    </AuthLayout>
    </AuthPageChrome>
  );
};

export default Login;
