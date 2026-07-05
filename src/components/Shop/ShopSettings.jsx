import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller?.name || "");
  const [description, setDescription] = useState(seller?.description || "");
  const [address, setAddress] = useState(seller?.address || "");
  const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber || "");
  const [zipCode, setZipcode] = useState(seller?.zipCode || "");
  const [paymentInfo, setPaymentInfo] = useState(seller?.paymentInfo || "");
  const dispatch = useDispatch();

  const handleImage = async (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
        axios
          .put(
            `${server}/shop/update-shop-avatar`,
            { avatar: reader.result },
            { withCredentials: true }
          )
          .then((res) => {
            dispatch(loadSeller());
            toast.success("Avatar updated successfully!");
          })
          .catch((error) => {
            toast.error(error.response.data.message);
          });
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-seller-info`,
        {
          name,
          address,
          zipCode,
          phoneNumber,
          description,
          paymentInfo,
        },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success("Shop info updated successfully!");
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 bg-gray-100 dark:bg-transparent">
      <div className="flex flex-col items-center w-full max-w-4xl bg-white dark:bg-[#1f1f1f] rounded-lg shadow-lg p-6">
        <div className="relative flex items-center justify-center mb-6">
          <img
            src={avatar || seller.avatar?.url}
            alt="Shop Avatar"
            className="w-32 h-32 rounded-full object-cover border"
          />
          <div className="absolute bottom-0 right-0 bg-gray-200 rounded-full p-2 cursor-pointer">
            <input
              type="file"
              id="image"
              className="hidden"
              onChange={handleImage}
            />
            <label htmlFor="image">
              <AiOutlineCamera className="text-gray-700 dark:text-green-700" />
            </label>
          </div>
        </div>

        <form className="w-full space-y-4" onSubmit={updateHandler}>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Name</label>
            <input
              type="text"
              placeholder="Enter shop name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`${styles.input} dark:bg-[#1f1f1f] w-full`}
              required
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Manual Payment</label>
            <input
              type="text"
              placeholder="Enter Manual Payment"
              value={paymentInfo}
              onChange={(e) => setPaymentInfo(e.target.value)}
              className={`${styles.input} dark:bg-[#1f1f1f] w-full`}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Description</label>
            <input
              type="text"
              placeholder="Enter shop description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${styles.input} dark:bg-[#1f1f1f] w-full`}
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Address</label>
            <input
              type="text"
              placeholder="Enter shop address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${styles.input} dark:bg-[#1f1f1f] w-full`}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Phone Number</label>
            <input
              type="tel"
              placeholder="Enter shop phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={`${styles.input} dark:bg-[#1f1f1f] w-full`}
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Zip Code</label>
            <input
              type="text"
              placeholder="Enter shop zip code"
              value={zipCode}
              onChange={(e) => setZipcode(e.target.value)}
              className={`${styles.input} dark:bg-[#1f1f1f] w-full`}
              required
            />
          </div>

          <button
            type="submit"
            className={`${styles.input} w-full py-2 bg-[#29625d] text-white font-semibold rounded`}
          >
            Update Shop
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
