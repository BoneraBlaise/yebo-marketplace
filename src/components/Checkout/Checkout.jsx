import React, { useState } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { trackCommissionClick } from "../../redux/actions/order";
import { useReferral } from "../../context/ReferralContext";

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
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { referralProducts } = useReferral();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleReferralCode = () => {
      // Get referral code from URL
      const urlParams = new URLSearchParams(window.location.search);
      const refCode = urlParams.get('ref');
      
      if (refCode) {
        // Store referral code in localStorage
        localStorage.setItem('referralCode', refCode);
        
        // Track the click
        dispatch(trackCommissionClick(refCode));
      }
    };

    handleReferralCode();
  }, [dispatch]);

  // Calculate prices including won bids
  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // Calculate shipping based on price tiers
  const calculateShipping = (price) => {
    if (price >= 500000) return 10000;
    if (price >= 100000) return 5000;
    if (price >= 50000) return 4000;
    return 1000;
  };

  const shipping = calculateShipping(subTotalPrice);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate address fields
    if (!address1 || !country || !city || !zipCode) {
      toast.error("Please fill in all shipping details!");
      return;
    }

    // Add referral codes to cart items if applicable
    const cartWithReferrals = cart.map(item => {
      const referralCode = referralProducts.get(item._id);
      return referralCode ? { ...item, referralCode } : item;
    });

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
      discountPrice: discountPrice || 0,
    };

    // Handle different order types
    if (location.state?.wonBid) {
      const wonBid = location.state.wonBid;
      orderData = {
        ...orderData,
        cart: cartWithReferrals.filter(item => item._id === wonBid._id),
        totalPrice: wonBid.discountPrice + shipping,
        subTotalPrice: wonBid.discountPrice,
        orderType: 'won_bid',
        bidId: wonBid.bidId
      };
    } else if (location.state?.flashSale) {
      const flashSale = location.state.flashSale;
      orderData = {
        ...orderData,
        cart: cartWithReferrals.filter(item => item._id === flashSale._id),
        totalPrice: flashSale.discountPrice + shipping,
        subTotalPrice: flashSale.discountPrice,
        orderType: 'flash_sale'
      };
    } else {
      // Regular order
      orderData = {
        ...orderData,
        totalPrice,
        subTotalPrice,
        orderType: 'regular'
      };
    }

    // Save to localStorage
    localStorage.setItem("latestOrder", JSON.stringify(orderData));

    // Navigate to payment
    navigate("/payment");
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  // Calculate total price including shipping
  const totalPrice = cart.length > 0
    ? (parseFloat(subTotalPrice) + shipping).toFixed(2)
    : couponCodeData
      ? (subTotalPrice + shipping - discountPercentenge).toFixed(2)
      : (subTotalPrice + shipping).toFixed(2);

  console.log(discountPercentenge);

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
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
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            isWonBid={!!wonBid}
            wonBid={wonBid}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={handleSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

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
}) => {
  return (
    <div className="w-full 800px:w-[95%] bg-white dark:bg-[#1f1f1f] dark:text-gray-200 rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={user?.name || ""}
              required
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-gray-200 !w-[95%]`}
              readOnly
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              value={user?.email || ""}
              required
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-gray-200`}
              readOnly
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={user?.phoneNumber || ""}
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-gray-200 !w-[95%]`}
              readOnly
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="number"
              value={zipCode || ""}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-gray-200`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Country</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px] dark:bg-[#1f1f1f] dark:text-gray-200"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">City</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px] dark:bg-[#1f1f1f] dark:text-gray-200"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Address1</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-gray-200 !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Address2</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-gray-200`}
            />
          </div>
        </div>

        <div></div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div>
          {user?.addresses?.map((item, index) => (
            <div className="w-full flex mt-1" key={index}>
              <input
                type="checkbox"
                className="mr-3 dark:bg-[#1f1f1f] dark:text-gray-200"
                value={item.addressType}
                onClick={() => {
                  setAddress1(item.address1);
                  setAddress2(item.address2);
                  setZipCode(item.zipCode);
                  setCountry(item.country);
                  setCity(item.city);
                }}
              />
              <h2>{item.addressType}</h2>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
  isWonBid,
  wonBid
}) => {
  const getShippingTierText = (price) => {
    if (price >= 500000) return "(Premium Shipping)";
    if (price >= 100000) return "(Express Shipping)";
    if (price >= 50000) return "(Standard Shipping)";
    return "(Basic Shipping)";
  };

  return (
    <div className="w-full bg-white dark:bg-gray-800 dark:text-white rounded-md p-5 pb-8">
      {isWonBid ? (
        <>
          <div className="flex justify-between">
            <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">Won Bid Amount:</h3>
            <h5 className="text-[18px] font-[600]">RWF {wonBid?.discountPrice?.toLocaleString() || "0"}</h5>
          </div>
          <br />
          <div className="flex justify-between border-b pb-3">
            <div>
              <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">Shipping:</h3>
              <p className="text-xs text-gray-500">{getShippingTierText(wonBid?.discountPrice || 0)}</p>
            </div>
            <h5 className="text-[18px] font-[600]">RWF {shipping?.toLocaleString() || "0"}</h5>
          </div>
          <h5 className="text-[18px] font-[600] text-end pt-3">Total: RWF {totalPrice}</h5>
        </>
      ) : (
        <>
          <div className="flex justify-between">
            <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">subtotal:</h3>
            <h5 className="text-[18px] font-[600]">RWF {subTotalPrice?.toLocaleString()}</h5>
          </div>
          <br />
          <div className="flex justify-between">
            <div>
              <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">shipping:</h3>
              <p className="text-xs text-gray-500">{getShippingTierText(subTotalPrice)}</p>
            </div>
            <h5 className="text-[18px] font-[600]">RWF {shipping?.toLocaleString()}</h5>
          </div>
          <br />
          <div className="flex justify-between border-b pb-3">
            <h3 className="text-[16px] font-[400] text-[#000000a4] dark:text-gray-200">Discount:</h3>
            <h5 className="text-[18px] font-[600]">
              - {discountPercentenge ? "RWF " + discountPercentenge.toString() : null}
            </h5>
          </div>
          <h5 className="text-[18px] font-[600] text-end pt-3">RWF {totalPrice}</h5>
          <br />
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className={`${styles.input} h-[40px] pl-2 dark:bg-gray-800 dark:text-gray-200`}
              placeholder="Coupoun code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              required
            />
            <input
              className={`w-full h-[40px] border border-[#29625d] text-center text-[#29625d] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Apply code"
              type="submit"
            />
          </form>
        </>
      )}
    </div>
  );
};

export default Checkout;
