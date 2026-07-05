import React, { useState, useEffect } from "react";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import styles from "../../styles/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { Link } from "react-router-dom";
import { MdTrackChanges } from "react-icons/md";
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
  getCommissionDashboard,
} from "../../redux/actions/order";
import {
  FaMoneyBillWave,
  FaClock,
  FaShoppingCart,
  FaChartLine,
} from "react-icons/fa";
import CommissionDashboard from "../Commission/CommissionDashboard";

const ProfileContent = ({ active }) => {
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
      {/* profile */}
      {active === 1 && (
        <>
          <div className="rounded-md border-[1px] m-2 px-3 py-2 text-sm font-medium ">
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
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />
              <div className="w-[30px] h-[30px] bg-[#0d9b4d] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
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
          <div className="w-full px-5 mb-20">
            <form onSubmit={handleSubmit} aria-required={true}>
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
              <button
                type="submit"
                disabled={loading}
                className={`w-[250px] h-[40px] border bg-[#29625d] text-center text-white rounded-[3px] mt-8 cursor-pointer ${
                  loading ? 'opacity-70' : ''
                }`}
              >
                {loading ? "Updating..." : "Update"}
              </button>
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
  const { orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "dark:text-white", // Ensure white text in header
      cellClassName: "dark:text-white", // Ensure white text in cells
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white", // Ensure white text in cells
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white", // Ensure white text in cells
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      headerClassName: "dark:text-white",
      renderCell: (params) => {
        return (
          <Link to={`/user/order/${params.id}`}>
            <Button className="dark:bg-black p-1 dark:bg-gray-800">
              {" "}
              {/* Ensure button is styled for dark mode */}
              <AiOutlineArrowRight size={20} className="dark:text-white" />
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "RWF " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1 dark:text-white">
      {" "}
      {/* Parent div for dark mode */}
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        className="dark:text-white" // Ensure DataGrid is styled for dark mode
      />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const eligibleOrders =
    orders && orders.filter((item) => item.status === "Processing refund");

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} className="dark:text-white" />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "RWF " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        autoHeight
        disableSelectionOnClick
        className="dark:text-white"
      />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",

      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} className="dark:text-white" />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.length,
        total: "RWF " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid
        rows={row}
        columns={columns}
        pageSize={10}
        disableSelectionOnClick
        autoHeight
        className="dark:text-white"
      />
    </div>
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
    <div className="w-full px-5">
      <h1 className="block text-[25px] text-center font-[600] text-[#000000ba] dark:text-gray-200 pb-2">
        Change Password
      </h1>
      <div className="w-full">
        <form
          aria-required
          onSubmit={passwordChangeHandler}
          className="flex flex-col items-center"
        >
          <div className=" w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-white !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-white !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className=" w-[100%] 800px:w-[50%] mt-2">
            <label className="block pb-2">Confirm your password</label>
            <input
              type="password"
              className={`${styles.input} dark:bg-[#1f1f1f] dark:text-white !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input
              className={`w-[95%] h-[40px] border bg-[#29625d] text-center text-white hover:bg-black rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
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

      {/* My Addresses Section */}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-semibold text-[#000000ba] dark:text-gray-200 pb-2">
          My Addresses
        </h1>
        <button
          onClick={() => setOpen(true)}
          className="bg-[#29625d] text-white rounded-md px-4 py-2"
        >
          Add New
        </button>
      </div>

      <br />

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">
          You don't have any saved address!
        </h5>
      )}

      {user &&
        user.addresses.map((item, index) => (
          <div
            key={index}
            className="w-full bg-white dark:bg-[#1f1f1f] h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-semibold">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6 className="text-[12px] 800px:text-[unset]">
                {user.phoneNumber}
              </h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ProfileContent;
