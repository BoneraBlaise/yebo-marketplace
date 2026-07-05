import { React, useState } from "react";
import { ClipLoader } from "react-spinners";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
  HiOutlineUser,
} from "react-icons/hi";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Button } from "../ui";
import {
  AuthLayout,
  AuthFloatingInput,
  AuthGoogleButton,
  AuthDivider,
  AuthPasswordStrength,
} from "../Auth";

const Singup = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    axios
      .post(`${server}/user/create-user`, { name, email, password, avatar })
      .then((res) => {
        toast.success(res.data.message);
        setName("");
        setEmail("");
        setPassword("");
        setAvatar();
        setLoading(false);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setLoading(false);
      });
  };

  const handleGoogleLogin = () => {
    window.location.href = `${server}/auth/google`;
  };

  return (
    <AuthLayout
      wide
      title="Create your account"
      subtitle="Join Yebone and discover premium products from verified sellers."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <AuthGoogleButton onClick={handleGoogleLogin} disabled={loading}>
          {t("auth.signUpWithGoogle")}
        </AuthGoogleButton>

        <AuthDivider text={t("auth.orContinueWith")} />

        <AuthFloatingInput
          id="name"
          name="text"
          type="text"
          label={t("auth.fullName")}
          icon={HiOutlineUser}
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          success={name.trim().length >= 2}
        />

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

        <div>
          <AuthFloatingInput
            id="password"
            name="password"
            label={t("auth.password")}
            icon={HiOutlineLockClosed}
            autoComplete="new-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            showPasswordToggle
            visible={visible}
            onToggleVisible={() => setVisible(!visible)}
          />
          <AuthPasswordStrength password={password} />
        </div>

        <div>
          <label
            htmlFor="file-input"
            className="block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-2"
          >
            {t("auth.uploadFile")}
          </label>
          <div className="flex items-center gap-4 p-3 rounded-xl border border-gray-200/80 dark:border-gray-700 bg-white/50 dark:bg-white/5">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full overflow-hidden bg-yebone-light-gray border border-gray-200 dark:border-gray-700">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <RxAvatar className="h-7 w-7 text-yebone-primary" />
              )}
            </span>
            <label
              htmlFor="file-input"
              className="flex-1 cursor-pointer rounded-xl border border-dashed border-yebone-primary/30 px-4 py-2.5 text-center text-sm font-medium text-yebone-primary hover:bg-yebone-primary/5 transition-colors"
            >
              Choose profile photo
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

        <Button
          type="submit"
          size="lg"
          className="w-full yebone-btn-lift"
          disabled={loading}
        >
          {loading ? <ClipLoader color="#fff" size={22} /> : t("auth.submit")}
        </Button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          {t("auth.alreadyHaveAccount")}{" "}
          <Link
            to="/login"
            className="font-semibold text-yebone-primary hover:underline"
          >
            {t("auth.signIn")}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Singup;
