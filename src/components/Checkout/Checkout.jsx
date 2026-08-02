import React, { useState, useEffect } from "react";
import { Country, State } from "country-state-city";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { trackCommissionClick } from "../../redux/actions/order";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import { useReferral } from "../../context/ReferralContext";
import { validateGrowthCoupon } from "../../services/growthConfigurationService";
import { fetchNegotiatedCheckout } from "../../services/communicationService";
import { Container } from "../ui";
import CheckoutOrderSummary from "./CheckoutOrderSummary";
import CheckoutCartItem from "./CheckoutCartItem";
import CheckoutEmptyCart from "./CheckoutEmptyCart";
import CheckoutDeliveryMethods from "./CheckoutDeliveryMethods";
import CheckoutAIAssistant from "./CheckoutAIAssistant";
import "./checkout.css";

const applyAddress = (address, setters) => {
  setters.setAddress1(address.address1 || "");
  setters.setAddress2(address.address2 || "");
  setters.setZipCode(address.zipCode || "");
  setters.setCountry(address.country || "");
  setters.setCity(address.city || "");
};

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  const location = useLocation();
  const wonBid = location.state?.wonBid;
  const searchParams = new URLSearchParams(location.search);
  const offerIdParam = searchParams.get("offerId");
  const offerTokenParam = searchParams.get("token");
  const [negotiatedOffer, setNegotiatedOffer] = useState(null);
  const [negotiatedCartItem, setNegotiatedCartItem] = useState(null);
  const [negotiatedLoading, setNegotiatedLoading] = useState(Boolean(offerIdParam && offerTokenParam));
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [addressInitialized, setAddressInitialized] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referralProducts, getReferralPayload } = useReferral();

  const addressSetters = { setAddress1, setAddress2, setZipCode, setCountry, setCity };

  useEffect(() => {
    if (!offerIdParam || !offerTokenParam) return;
    let cancelled = false;
    (async () => {
      setNegotiatedLoading(true);
      try {
        const payload = await fetchNegotiatedCheckout({
          offerId: offerIdParam,
          token: offerTokenParam,
        });
        if (cancelled) return;
        setNegotiatedOffer(payload.negotiatedOffer);
        setNegotiatedCartItem(payload.cart?.[0] || null);
      } catch (error) {
        if (!cancelled) {
          toast.error(error.response?.data?.message || "Negotiated offer unavailable");
          navigate("/inbox");
        }
      } finally {
        if (!cancelled) setNegotiatedLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [offerIdParam, offerTokenParam, navigate]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get("ref");
    if (refCode) {
      dispatch(trackCommissionClick(refCode));
    }
  }, [dispatch]);

  useEffect(() => {
    if (addressInitialized || !user?.addresses?.length) return;
    const defaultAddress =
      user.addresses.find((item) => item.isDefault) || user.addresses[0];
    applyAddress(defaultAddress, addressSetters);
    setSelectedAddressIndex(0);
    setAddressInitialized(true);
  }, [user?.addresses, addressInitialized]);

  const subTotalPrice = negotiatedCartItem
    ? Number(negotiatedCartItem.discountPrice || negotiatedCartItem.price || 0)
    : cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

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

    if (negotiatedOffer && negotiatedCartItem) {
      orderData = {
        ...orderData,
        cart: [negotiatedCartItem],
        totalPrice: Number(negotiatedCartItem.discountPrice || negotiatedCartItem.price) + shipping,
        subTotalPrice: Number(negotiatedCartItem.discountPrice || negotiatedCartItem.price),
        orderType: "negotiated_offer",
        negotiatedOffer,
      };
    } else if (location.state?.wonBid) {
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

  const handleSelectSavedAddress = (index) => {
    const address = user.addresses[index];
    if (!address) return;
    setSelectedAddressIndex(index);
    applyAddress(address, addressSetters);
  };

  if (negotiatedLoading) {
    return (
      <Container className="checkout-page">
        <p className="checkout-page__loading">Loading checkout…</p>
      </Container>
    );
  }

  if (!wonBid && !negotiatedCartItem && cart.length === 0) {
    return <CheckoutEmptyCart />;
  }

  return (
    <>
      <Container className="checkout-page">
        <div className="checkout-layout">
          <div className="checkout-layout__main">
            {negotiatedCartItem && (
              <section className="checkout-section">
                <h2 className="checkout-section__title">Cart</h2>
                <CheckoutCartItem
                  data={{ ...negotiatedCartItem, qty: 1 }}
                  quantityChangeHandler={() => {}}
                  removeFromCartHandler={() => {}}
                  hasReferral={false}
                  compact
                />
              </section>
            )}

            {!wonBid && !negotiatedCartItem && cart.length > 0 && (
              <section className="checkout-section">
                <h2 className="checkout-section__title">
                  Cart ({cart.length})
                </h2>
                <div className="checkout-cart-list">
                  {cart.map((item, index) => (
                    <CheckoutCartItem
                      key={item._id || index}
                      data={item}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                      hasReferral={referralProducts.has(item._id) || item.referralCode}
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
              address1={address1}
              setAddress1={setAddress1}
              address2={address2}
              setAddress2={setAddress2}
              zipCode={zipCode}
              setZipCode={setZipCode}
              selectedAddressIndex={selectedAddressIndex}
              onSelectSavedAddress={handleSelectSavedAddress}
            />

            <CheckoutDeliveryMethods value={deliveryMethod} onChange={setDeliveryMethod} />

            <CheckoutAIAssistant />
          </div>

          <aside className="checkout-layout__aside">
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
              checkoutLabel="Pay now"
            />
          </aside>
        </div>
      </Container>

      <div className="checkout-mobile-bar">
        <p className="checkout-mobile-bar__total">
          RWF {Number(totalPrice).toLocaleString()}
        </p>
        <button type="button" className="checkout-mobile-bar__pay" onClick={handleSubmit}>
          Pay now
        </button>
      </div>
    </>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  selectedAddressIndex,
  onSelectSavedAddress,
}) => (
  <section className="checkout-section">
    <h2 className="checkout-section__title">Shipping address</h2>

    {user?.addresses?.length > 0 && (
      <div className="checkout-saved-addresses">
        <p className="checkout-saved-addresses__label">Saved addresses</p>
        <div className="checkout-saved-addresses__list">
          {user.addresses.map((item, index) => (
            <button
              key={`${item.addressType}-${index}`}
              type="button"
              className={`checkout-saved-addresses__chip${
                selectedAddressIndex === index ? " is-selected" : ""
              }`}
              onClick={() => onSelectSavedAddress(index)}
            >
              {item.addressType || `Address ${index + 1}`}
            </button>
          ))}
        </div>
      </div>
    )}

    <form className="checkout-shipping-form" onSubmit={(e) => e.preventDefault()}>
      <div className="checkout-shipping-form__grid">
        <div className="checkout-field-wrap">
          <label htmlFor="checkout-name">Full name</label>
          <input id="checkout-name" type="text" value={user?.name || ""} readOnly className="checkout-field" />
        </div>
        <div className="checkout-field-wrap">
          <label htmlFor="checkout-email">Email</label>
          <input id="checkout-email" type="email" value={user?.email || ""} readOnly className="checkout-field" />
        </div>
        <div className="checkout-field-wrap">
          <label htmlFor="checkout-phone">Phone</label>
          <input id="checkout-phone" type="tel" value={user?.phoneNumber || ""} readOnly className="checkout-field" />
        </div>
        <div className="checkout-field-wrap">
          <label htmlFor="checkout-zip">Zip code</label>
          <input
            id="checkout-zip"
            type="text"
            inputMode="numeric"
            value={zipCode || ""}
            onChange={(e) => setZipCode(e.target.value)}
            required
            className="checkout-field"
          />
        </div>
        <div className="checkout-field-wrap">
          <label htmlFor="checkout-country">Country</label>
          <select
            id="checkout-country"
            className="checkout-field"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            <option value="">Choose country</option>
            {Country?.getAllCountries().map((item) => (
              <option key={item.isoCode} value={item.isoCode}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="checkout-field-wrap">
          <label htmlFor="checkout-city">City</label>
          <select id="checkout-city" className="checkout-field" value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Choose city</option>
            {State?.getStatesOfCountry(country).map((item) => (
              <option key={item.isoCode} value={item.isoCode}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="checkout-field-wrap checkout-field-wrap--full">
          <label htmlFor="checkout-address1">Address line 1</label>
          <input
            id="checkout-address1"
            type="text"
            required
            value={address1}
            onChange={(e) => setAddress1(e.target.value)}
            className="checkout-field"
          />
        </div>
        <div className="checkout-field-wrap checkout-field-wrap--full">
          <label htmlFor="checkout-address2">Address line 2</label>
          <input
            id="checkout-address2"
            type="text"
            value={address2}
            onChange={(e) => setAddress2(e.target.value)}
            required
            className="checkout-field"
          />
        </div>
      </div>
    </form>
  </section>
);

export default Checkout;
