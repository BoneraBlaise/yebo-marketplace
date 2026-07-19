import React, { useState } from "react";
import { Country, State } from "country-state-city";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { trackCommissionClick } from "../../redux/actions/order";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { useReferral } from "../../context/ReferralContext";
import { validateGrowthCoupon } from "../../services/growthConfigurationService";
import { Container, Button } from "../ui";
import { typography } from "../../design-system/typography";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutCartItem from "./CheckoutCartItem";
import CheckoutEmptyCart from "./CheckoutEmptyCart";
import CheckoutDeliveryMethods from "./CheckoutDeliveryMethods";
import { YEBOCheckoutIntelligence } from "../ai";
import "./checkout.css";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const location = useLocation();
  const wonBid = location.state?.wonBid;
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referralProducts, getReferralPayload } = useReferral();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");
    if (refCode) {
      dispatch(trackCommissionClick(refCode));
    }
  }, [dispatch]);

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const calculateShipping = (price) => {
    if (price >= 500000) return 10000;
    if (price >= 100000) return 5000;
    if (price >= 50000) return 4000;
    return 1000;
  };

  const shipping = calculateShipping(subTotalPrice);

  const handleCouponSubmit = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      toast.error("Enter a coupon code");
      return;
    }

    try {
      const result = await validateGrowthCoupon({
        code: couponCode.trim(),
        cart: cart.map((item) => ({
          _id: item._id,
          shopId: item.shopId || item.shop?._id,
          category: item.category,
          brand: item.tags || item.brand,
          discountPrice: item.discountPrice,
          price: item.price,
          qty: item.qty,
        })),
        cartTotal: subTotalPrice,
      });

      if (result.valid) {
        setCouponCodeData(result.coupon);
        setDiscountPrice(result.coupon.discountAmount);
        toast.success("Coupon applied");
      } else {
        setCouponCodeData(null);
        setDiscountPrice(null);
        toast.error(result.reason || "Invalid coupon");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.data?.reason ||
          error?.response?.data?.message ||
          "Unable to validate coupon"
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!address1 || !country || !city || !zipCode) {
      toast.error("Please fill in all shipping details!");
      return;
    }

    if (!deliveryMethod) {
      toast.error("Please choose a delivery method!");
      return;
    }

    const cartWithReferrals = cart.map((item) => {
      const referralCode = referralProducts.get(item._id);
      return referralCode ? { ...item, referralCode } : item;
    });

    const { attributionTokens } = getReferralPayload();

    let orderData = {
      shippingAddress: {
        address1,
        address2,
        zipCode,
        country,
        city,
      },
      user: {
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      cart: cartWithReferrals,
      shipping,
      deliveryMethod,
      discountPrice: discountPrice || 0,
      attributionTokens,
      couponCode: couponCodeData?.code || null,
    };

    if (location.state?.wonBid) {
      const wonBidState = location.state.wonBid;
      orderData = {
        ...orderData,
        cart: cartWithReferrals.filter((item) => item._id === wonBidState._id),
        totalPrice: wonBidState.discountPrice + shipping,
        subTotalPrice: wonBidState.discountPrice,
        orderType: "won_bid",
        bidId: wonBidState.bidId,
      };
    } else if (location.state?.flashSale) {
      const flashSale = location.state.flashSale;
      orderData = {
        ...orderData,
        cart: cartWithReferrals.filter((item) => item._id === flashSale._id),
        totalPrice: flashSale.discountPrice + shipping,
        subTotalPrice: flashSale.discountPrice,
        orderType: "flash_sale",
      };
    } else {
      orderData = {
        ...orderData,
        totalPrice,
        subTotalPrice,
        orderType: "regular",
      };
    }

    localStorage.setItem("latestOrder", JSON.stringify(orderData));
    navigate("/payment");
  };

  const discountAmount = couponCodeData ? Number(discountPrice || 0) : 0;

  const totalPrice = (parseFloat(subTotalPrice) + shipping - discountAmount).toFixed(2);

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  if (!wonBid && cart.length === 0) {
    return <CheckoutEmptyCart />;
  }

  return (
    <>
      <Container className="py-8 lg:py-12 pb-28 lg:pb-12">
        <div className="mb-8 yebone-fade-up">
          <h1 className={`${typography.heading} mb-2`}>Checkout</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Review your items and complete shipping details on Yebone.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          <div className="lg:col-span-2 space-y-6 yebone-fade-up">
            {!wonBid && cart.length > 0 && (
              <section className="yebone-surface rounded-[1.75rem] p-6 lg:p-8">
                <h2 className={`${typography.subheading} mb-5`}>
                  Cart ({cart.length} {cart.length === 1 ? "item" : "items"})
                </h2>
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <CheckoutCartItem
                      key={item._id || index}
                      data={item}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                      hasReferral={
                        referralProducts.has(item._id) || item.referralCode
                      }
                    />
                  ))}
                </div>
              </section>
            )}

            <ShippingInfo
              user={user}
              country={country}
              setCountry={setCountry}
              city={city}
              setCity={setCity}
              userInfo={userInfo}
              setUserInfo={setUserInfo}
              address1={address1}
              setAddress1={setAddress1}
              address2={address2}
              setAddress2={setAddress2}
              zipCode={zipCode}
              setZipCode={setZipCode}
            />

            <CheckoutDeliveryMethods value={deliveryMethod} onChange={setDeliveryMethod} />
          </div>

          <div className="space-y-6">
            <YEBOCheckoutIntelligence />
            <CheckoutOrderSummary
            subTotalPrice={subTotalPrice}
            shipping={shipping}
            totalPrice={totalPrice}
            discountAmount={discountAmount}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            handleCouponSubmit={handleCouponSubmit}
            handleSubmit={handleSubmit}
            isWonBid={!!wonBid}
            wonBid={wonBid}
          />
          </div>
        </div>
      </Container>

      <div className="checkout-mobile-bar fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl px-4 py-3 flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500">Total</p>
          <p className="font-Poppins font-bold text-yebone-primary text-lg tabular-nums">
            RWF {Number(totalPrice).toLocaleString()}
          </p>
        </div>
        <Button size="md" className="yebone-btn-lift shrink-0" onClick={handleSubmit}>
          Pay now
        </Button>
      </div>
    </>
  );
};

const fieldClass =
  "w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-yebone-primary focus:ring-4 focus:ring-yebone-primary/10 outline-none transition text-sm dark:text-white";

const selectClass =
  "w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-yebone-primary outline-none transition text-sm dark:text-white";

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => (
  <section className="yebone-surface rounded-[1.75rem] p-6 lg:p-8">
    <h2 className={`${typography.subheading} mb-6`}>Shipping address</h2>
    <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Full name
          </label>
          <input type="text" value={user?.name || ""} readOnly className={fieldClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Email
          </label>
          <input type="email" value={user?.email || ""} readOnly className={fieldClass} />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Phone
          </label>
          <input type="number" value={user?.phoneNumber || ""} readOnly className={fieldClass} />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Zip code
          </label>
          <input
            type="number"
            value={zipCode || ""}
            onChange={(e) => setZipCode(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Country
          </label>
          <select
            className={selectClass}
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Choose your country</option>
            {Country?.getAllCountries().map((item) => (
              <option key={item.isoCode} value={item.isoCode}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            City
          </label>
          <select className={selectClass} value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Choose your city</option>
            {State?.getStatesOfCountry(country).map((item) => (
              <option key={item.isoCode} value={item.isoCode}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Address line 1
          </label>
          <input
            type="text"
            required
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className={fieldClass}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
            Address line 2
          </label>
          <input
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            required
            className={fieldClass}
          />
        </div>
      </div>
    </form>

    <button
      type="button"
      className="mt-6 text-sm font-semibold text-yebone-primary hover:underline yebone-btn-lift"
      onClick={() => setUserInfo(!userInfo)}
    >
      Choose from saved addresses
    </button>

    {userInfo && user?.addresses?.length > 0 && (
      <div className="mt-4 space-y-2">
        {user.addresses.map((item, index) => (
          <label
            key={index}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-yebone-primary/40 cursor-pointer transition yebone-card-lift"
          >
            <input
              type="checkbox"
              className="accent-yebone-primary"
              value={item.addressType}
              onChange={() => {
                setAddress1(item.address1);
                setAddress2(item.address2);
                setZipCode(item.zipCode);
                setCountry(item.country);
                setCity(item.city);
              }}
            />
            <span className="text-sm font-medium dark:text-white">{item.addressType}</span>
          </label>
        ))}
      </div>
    )}
  </section>
);

export default Checkout;
