import React, { useState, useEffect } from "react";
import {
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { IoIosArrowForward } from "react-icons/io";
import {
  deleteUserAddress,
  loadUser,
  updatUserAddress,
  updateUserInformation,
  joinCommissionProgram,
  updateUserAvatar,
} from "../../redux/actions/user";
import { Country, State } from "country-state-city";
import { toast } from "react-toastify";
import axios from "axios";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import {
  DashboardHome,
  DashboardWishlist,
  ReferralCenter,
  DashboardNotifications,
  DashboardSettings,
  DashboardOrderList,
  DashboardEmptyState,
} from "../Dashboard";
import CommissionDashboard from "../Commission/CommissionDashboard";
import { Button, Badge } from "../ui";

const ProfileContent = ({ active, setActive }) => {
  const { user, error, successMessage, loading } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearErrors" });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: "clearMessages" });
    }
  }, [error, successMessage]);

  const validateForm = () => {
    if (!name || !email || !phoneNumber || !password) {
      toast.error("Please fill all required fields");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    try {
      await dispatch(updateUserInformation(name, email, phoneNumber, password));
      setPassword(""); // Clear password after successful update
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        dispatch(updateUserAvatar(reader.result));
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      {active === 0 && <DashboardHome setActive={setActive} />}

      {active === 10 && <DashboardWishlist />}

      {active === 11 && <ReferralCenter />}

      {active === 12 && <DashboardNotifications />}

      {active === 13 && <DashboardSettings setActive={setActive} />}

      {/* profile */}
      {active === 1 && (
        <>
          <div className="rounded-xl border border-yebone-primary/15 m-2 px-4 py-3 text-sm font-medium yebone-surface">
            {isSeller ? "Check your" : "Start Selling"}
            <Link
              className="w-[50px]"
              to={`${isSeller ? "/dashboard" : "/shop-login"}`}
            >
              <span className="text-[#29625d] m-1 flex items-center">
                {isSeller ? "Seller Dashboard" : "Start Selling"}{" "}
                <IoIosArrowForward className="ml-1" />
              </span>
            </Link>
          </div>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={user?.avatar?.url}
                className="w-[140px] h-[140px] rounded-full object-cover border-[3px] border-yebone-primary shadow-lg"
                alt={user?.name || "Profile"}
              />
              <div className="w-[36px] h-[36px] bg-yebone-primary rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px] yebone-btn-lift">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                  accept="image/*"
                />
                <label htmlFor="image" className="cursor-pointer">
                  <AiOutlineCamera className="text-white" />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-2 md:px-5 mb-8">
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Profile completion</span>
                <span>{user?.name && user?.email && user?.phoneNumber ? "100%" : "70%"}</span>
              </div>
              <div className="dashboard-chart-bar">
                <div
                  className="dashboard-chart-bar-fill"
                  style={{ width: user?.name && user?.email && user?.phoneNumber ? "100%" : "70%" }}
                />
              </div>
            </div>
            <form onSubmit={handleSubmit} aria-required={true} className="space-y-4">
              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 dark:bg-[#1f1f1f]`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0 dark:bg-[#1f1f1f]`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full 800px:flex block pb-3">
                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 dark:bg-[#1f1f1f]`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <div className=" w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0 dark:bg-[#1f1f1f]`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <Button type="submit" disabled={loading} className="yebone-btn-lift mt-4">
                {loading ? "Updating..." : "Update profile"}
              </Button>
            </form>
          </div>
        </>
      )}

      {/* order */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refund */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/* Track order */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/* Change Password */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*  user Address */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}

      {/* Commission Dashboard */}
      {active === 9 && (
        <div>
          <CommissionDashboard />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders, error } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  return (
    <DashboardOrderList
      orders={orders || []}
      emptyTitle="No orders yet"
      emptyMessage="Your order history will appear here after you shop on Yebone."
      error={error}
      onRetry={() => user?._id && dispatch(getAllOrdersOfUser(user._id))}
    />
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  return (
    <DashboardOrderList
      orders={eligibleOrders || []}
      emptyTitle="No refund orders"
      emptyMessage="Orders with refund status will appear here."
      error={error}
      onRetry={() => user?._id && dispatch(getAllOrdersOfUser(user._id))}
    />
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders, error } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?._id) dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user?._id]);

  return (
    <DashboardOrderList
      orders={orders || []}
      showTrack
      emptyTitle="No orders to track"
      emptyMessage="Place an order to start tracking delivery."
      error={error}
      onRetry={() => user?._id && dispatch(getAllOrdersOfUser(user._id))}
    />
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validatePasswords = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all password fields");
      return false;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return false;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const passwordChangeHandler = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true }
      );
      
      toast.success(data.message || "Password updated successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
        Update your password to keep your account secure.
      </p>
      <form aria-required onSubmit={passwordChangeHandler} className="space-y-4">
        <div>
          <label className="block pb-2 text-sm font-medium">Enter your old password</label>
          <input
            type="password"
            className={`${styles.input} dark:bg-[#1f1f1f] dark:text-white w-full rounded-xl`}
            required
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block pb-2 text-sm font-medium">Enter your new password</label>
          <input
            type="password"
            className={`${styles.input} dark:bg-[#1f1f1f] dark:text-white w-full rounded-xl`}
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div>
          <label className="block pb-2 text-sm font-medium">Confirm your password</label>
          <input
            type="password"
            className={`${styles.input} dark:bg-[#1f1f1f] dark:text-white w-full rounded-xl`}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full yebone-btn-lift">
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: "Default",
    },
    {
      name: "Home",
    },
    {
      name: "Office",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!country || !city || !address1 || !addressType || !zipCode) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      await dispatch(
        updatUserAddress(country, city, address1, address2, zipCode, addressType)
      );
      setOpen(false);
      setCountry("");
      setCity("");
      setAddress1("");
      setAddress2("");
      setZipCode("");
      setAddressType("");
      dispatch(loadUser()); // Reload user data to get updated addresses
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to add address");
    }
  };

  const handleDelete = async (item) => {
    try {
      // Find the address index
      const addressIndex = user.addresses.findIndex(
        (addr) => 
          addr.addressType === item.addressType &&
          addr.address1 === item.address1 &&
          addr.address2 === item.address2
      );

      if (addressIndex === -1) {
        toast.error("Address not found");
        return;
      }

      await dispatch(deleteUserAddress(addressIndex));
      dispatch(loadUser()); // Reload user data
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete address");
    }
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center z-50">
          <div className="w-[90%] md:w-[75%] h-[80vh] bg-white dark:bg-[#1f1f1f] dark:text-gray-200 rounded shadow relative overflow-y-scroll hide-scrollbar">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={20}
                className="cursor-pointer text-red-500"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-[25px] font-Poppins font-semibold text-gray-800 dark:text-gray-200">
              Add New Address
            </h1>
            <div className="w-full">
              <form onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4 space-y-6">
                  {/* Country Field */}
                  <div className="w-full">
                    <label className="block text-lg font-semibold mb-2">
                      Country
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full py-2 px-4 rounded-md border border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Choose your country</option>
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option
                            key={item.isoCode}
                            value={item.isoCode}
                            className="dark:bg-[#2a2a2a]"
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* City Field */}
                  <div className="w-full">
                    <label className="block text-lg font-semibold mb-2">
                      Choose your City
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full py-2 px-4 rounded-md border border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Choose your city</option>
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option
                            key={item.isoCode}
                            value={item.isoCode}
                            className="dark:bg-[#2a2a2a]"
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Address 1 Field */}
                  <div className="w-full">
                    <label className="block text-lg font-semibold mb-2">
                      Address 1
                    </label>
                    <input
                      type="text"
                      className={`${styles.input} w-full py-2 px-4 rounded-md border border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  {/* Address 2 Field */}
                  <div className="w-full">
                    <label className="block text-lg font-semibold mb-2">
                      Address 2
                    </label>
                    <input
                      type="text"
                      className={`${styles.input} w-full py-2 px-4 rounded-md border border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  {/* Zip Code Field */}
                  <div className="w-full">
                    <label className="block text-lg font-semibold mb-2">
                      Zip Code
                    </label>
                    <input
                      type="number"
                      className={`${styles.input} w-full py-2 px-4 rounded-md border border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  {/* Address Type Field */}
                  <div className="w-full">
                    <label className="block text-lg font-semibold mb-2">
                      Address Type
                    </label>
                    <select
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                      className="w-full py-2 px-4 rounded-md border border-gray-300 dark:bg-[#2a2a2a] dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Choose your address type</option>
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option
                            key={item.name}
                            value={item.name}
                            className="dark:bg-[#2a2a2a]"
                          >
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div className="w-full pt-4">
                    <input
                      type="submit"
                      value="Add Address"
                      className="w-full py-2 bg-[#29625d] text-white text-lg rounded-md cursor-pointer hover:bg-[#1f4e45] transition"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="flex w-full items-center justify-between mb-6">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {user?.addresses?.length || 0} saved address(es)
        </p>
        <Button onClick={() => setOpen(true)} className="yebone-btn-lift" size="sm">
          Add address
        </Button>
      </div>

      {user && user.addresses.length === 0 && (
        <DashboardEmptyState
          title="No saved addresses"
          message="Add a delivery address for faster checkout."
          actionLabel="Add address"
          onAction={() => setOpen(true)}
        />
      )}

      <div className="grid sm:grid-cols-2 gap-4">
      {user &&
        user.addresses.map((item, index) => (
          <div
            key={index}
            className="dashboard-address-card yebone-surface flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={item.addressType === "Default" ? "primary" : "muted"}>
                  {item.addressType}
                </Badge>
              </div>
              <p className="text-sm dark:text-gray-200">
                {item.address1} {item.address2}
              </p>
              <p className="text-xs text-gray-500 mt-1">{user.phoneNumber}</p>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 self-start"
              onClick={() => handleDelete(item)}
              aria-label="Delete address"
            >
              <AiOutlineDelete size={22} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfileContent;
