import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { RxAvatar } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../../server";
import { SELLER_DASHBOARD_PATH } from "../../utils/sellerNav";

const STEPS = [
  { id: "identity", label: "Identity" },
  { id: "business", label: "Business Information" },
  { id: "payment", label: "Payment Setup" },
  { id: "shop", label: "Shop Information" },
  { id: "review", label: "Review" },
  { id: "create", label: "Create Shop" },
];

const SellerOnboardingWizard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: userLoading } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);

  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [activationUrl, setActivationUrl] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentValue, setPaymentValue] = useState("");
  const [shopName, setShopName] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isSeller) {
      navigate(SELLER_DASHBOARD_PATH, { replace: true });
    }
  }, [isSeller, navigate]);

  useEffect(() => {
    if (!user) return;
    setName(user.name || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");
  }, [user]);

  const currentStep = STEPS[stepIndex];

  const canProceed = useMemo(() => {
    switch (currentStep?.id) {
      case "identity":
        return Boolean(name?.trim() && email?.trim());
      case "business":
        return Boolean(phoneNumber && address?.trim() && zipCode);
      case "payment":
        return Boolean(paymentMethod && paymentValue?.trim());
      case "shop":
        return Boolean(shopName?.trim() && password?.length >= 6);
      case "review":
        return true;
      default:
        return false;
    }
  }, [currentStep, name, email, phoneNumber, address, zipCode, paymentMethod, paymentValue, shopName, password]);

  const handleFileInputChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) setAvatar(reader.result);
    };
    if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const goNext = () => {
    if (!canProceed) {
      toast.error("Please complete the required fields before continuing.");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleCreateShop = async () => {
    setSubmitting(true);
    const paymentInfo = `${paymentMethod}:${paymentValue}`;
    try {
      const res = await axios.post(`${server}/shop/create-shop`, {
        name: shopName,
        email,
        password,
        avatar,
        zipCode,
        address,
        phoneNumber,
        paymentInfo,
      });
      toast.success(res.data.message);
      if (res.data.activationUrl) {
        setActivationUrl(res.data.activationUrl);
      }
      setCompleted(true);
      setStepIndex(STEPS.length - 1);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create shop.");
    } finally {
      setSubmitting(false);
    }
  };

  if (userLoading) {
    return <p className="text-center py-16 text-gray-500">Loading your account…</p>;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto py-16 px-4 text-center space-y-4">
        <h1 className="text-2xl font-semibold">Become a Seller</h1>
        <p className="text-gray-600 dark:text-gray-300">
          Sign in with your Yebone customer account to start seller onboarding. One account for shopping and selling.
        </p>
        <Link
          to="/login"
          state={{ from: "/seller/onboarding" }}
          className="inline-flex min-h-[44px] items-center px-6 rounded-xl bg-[#29625d] text-white font-medium"
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-white">Seller Onboarding</h1>
        <p className="text-gray-500 mt-1">
          Complete each step using your existing Yebone account — no separate seller login required.
        </p>
      </div>

      <ol className="flex flex-wrap gap-2" aria-label="Onboarding progress">
        {STEPS.map((step, index) => (
          <li
            key={step.id}
            className={`text-xs sm:text-sm px-3 py-1.5 rounded-full border ${
              index === stepIndex
                ? "bg-[#29625d] text-white border-[#29625d]"
                : index < stepIndex
                  ? "bg-green-50 text-green-800 border-green-200"
                  : "bg-gray-50 text-gray-500 border-gray-200 dark:bg-gray-900 dark:border-gray-700"
            }`}
          >
            {index + 1}. {step.label}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 space-y-6">
        {currentStep.id === "identity" && (
          <>
            <h2 className="text-xl font-semibold">Identity Verification</h2>
            <p className="text-sm text-gray-500">Confirm the identity tied to your customer account.</p>
            <label className="block text-sm font-medium">Full name</label>
            <input className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={name} onChange={(e) => setName(e.target.value)} required />
            <label className="block text-sm font-medium">Email</label>
            <input type="email" className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </>
        )}

        {currentStep.id === "business" && (
          <>
            <h2 className="text-xl font-semibold">Business Information</h2>
            <label className="block text-sm font-medium">Phone number</label>
            <input type="tel" className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            <label className="block text-sm font-medium">Business address</label>
            <input className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={address} onChange={(e) => setAddress(e.target.value)} required />
            <label className="block text-sm font-medium">Zip code</label>
            <input className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required />
          </>
        )}

        {currentStep.id === "payment" && (
          <>
            <h2 className="text-xl font-semibold">Payment Setup</h2>
            <label className="block text-sm font-medium">Payment method</label>
            <select className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} required>
              <option value="">Select payment method</option>
              <option value="Phone">Phone</option>
              <option value="Momo Pay">Momo Pay</option>
              <option value="Bitcoin">Bitcoin</option>
              <option value="Bank">Bank</option>
              <option value="Other">Other</option>
            </select>
            {paymentMethod ? (
              <>
                <label className="block text-sm font-medium">{paymentMethod} details</label>
                <input className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={paymentValue} onChange={(e) => setPaymentValue(e.target.value)} required />
              </>
            ) : null}
          </>
        )}

        {currentStep.id === "shop" && (
          <>
            <h2 className="text-xl font-semibold">Shop Information</h2>
            <label className="block text-sm font-medium">Shop name</label>
            <input className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
            <div className="flex items-center gap-3">
              <span className="inline-block h-10 w-10 rounded-full overflow-hidden">
                {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <RxAvatar className="h-10 w-10" />}
              </span>
              <label className="cursor-pointer px-4 py-2 rounded-xl border text-sm font-medium">
                Upload shop logo
                <input type="file" accept="image/*" className="sr-only" onChange={handleFileInputChange} />
              </label>
            </div>
            <label className="block text-sm font-medium">Shop access password</label>
            <p className="text-xs text-gray-500">Used once to secure your seller session. Same email as your customer account.</p>
            <div className="relative">
              <input
                type={visible ? "text" : "password"}
                className="w-full h-11 px-4 rounded-xl border dark:bg-gray-950"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button type="button" className="absolute right-3 top-2.5" onClick={() => setVisible((v) => !v)} aria-label={visible ? "Hide password" : "Show password"}>
                {visible ? <AiOutlineEye size={22} /> : <AiOutlineEyeInvisible size={22} />}
              </button>
            </div>
          </>
        )}

        {currentStep.id === "review" && (
          <>
            <h2 className="text-xl font-semibold">Review</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div><dt className="text-gray-500">Name</dt><dd className="font-medium">{name}</dd></div>
              <div><dt className="text-gray-500">Email</dt><dd className="font-medium">{email}</dd></div>
              <div><dt className="text-gray-500">Phone</dt><dd className="font-medium">{phoneNumber}</dd></div>
              <div><dt className="text-gray-500">Address</dt><dd className="font-medium">{address}</dd></div>
              <div><dt className="text-gray-500">Zip</dt><dd className="font-medium">{zipCode}</dd></div>
              <div><dt className="text-gray-500">Payment</dt><dd className="font-medium">{paymentMethod}: {paymentValue}</dd></div>
              <div><dt className="text-gray-500">Shop name</dt><dd className="font-medium">{shopName}</dd></div>
            </dl>
          </>
        )}

        {currentStep.id === "create" && (
          <>
            <h2 className="text-xl font-semibold">{completed ? "Shop created" : "Create Shop"}</h2>
            {completed ? (
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                {activationUrl ? (
                  <>
                    <p>SMTP is not configured in this environment. Activate your shop using this link:</p>
                    <a href={activationUrl} className="block break-all text-[#29625d] font-medium underline">{activationUrl}</a>
                  </>
                ) : (
                  <p>We sent an activation link to <strong>{email}</strong>. Open it to activate your shop — you will be signed in automatically.</p>
                )}
                <p>Already activated? Go straight to your seller dashboard.</p>
                <Link to={SELLER_DASHBOARD_PATH} className="inline-flex min-h-[44px] items-center px-5 rounded-xl bg-[#29625d] text-white font-medium">
                  Seller Dashboard
                </Link>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Submit your shop for creation. You will receive an email to activate your seller account.</p>
            )}
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-3 justify-between">
        <button type="button" className="min-h-[44px] px-5 rounded-xl border font-medium disabled:opacity-40" onClick={goBack} disabled={stepIndex === 0 || completed}>
          Back
        </button>
        {currentStep.id === "review" ? (
          <button type="button" className="min-h-[44px] px-5 rounded-xl bg-[#29625d] text-white font-medium" onClick={goNext}>
            Continue to create shop
          </button>
        ) : currentStep.id === "create" && !completed ? (
          <button type="button" className="min-h-[44px] px-5 rounded-xl bg-[#29625d] text-white font-medium disabled:opacity-50" onClick={handleCreateShop} disabled={submitting}>
            {submitting ? "Creating…" : "Create Shop"}
          </button>
        ) : currentStep.id !== "create" ? (
          <button type="button" className="min-h-[44px] px-5 rounded-xl bg-[#29625d] text-white font-medium disabled:opacity-50" onClick={goNext} disabled={!canProceed}>
            Continue
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default SellerOnboardingWizard;
