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
    <div className="yebone-fade-up space-y-6 p-1">
      <div className="dashboard-section yebone-surface max-w-3xl mx-auto">
        <h2 className="font-Poppins text-xl font-semibold mb-6 dark:text-white text-center">
          Store settings
        </h2>

        <div className="relative flex items-center justify-center mb-8">
          <img
            src={avatar || seller.avatar?.url}
            alt="Shop Avatar"
            className="w-32 h-32 rounded-full object-cover border-4 border-yebone-primary/20"
          />
          <div className="absolute bottom-0 right-1/2 translate-x-16 bg-yebone-primary rounded-full p-2.5 cursor-pointer shadow-lg">
            <input type="file" id="image" className="hidden" onChange={handleImage} />
            <label htmlFor="image">
              <AiOutlineCamera className="text-white" />
            </label>
          </div>
        </div>

        <form className="w-full space-y-6" onSubmit={updateHandler}>
          <div className="vendor-form-section yebone-surface">
            <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Store profile</h3>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Name</label>
                <input
                  type="text"
                  placeholder="Enter shop name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`${styles.input} dark:bg-[#1f1f1f] w-full rounded-xl`}
                  required
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Description</label>
                <input
                  type="text"
                  placeholder="Enter shop description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className={`${styles.input} dark:bg-[#1f1f1f] w-full rounded-xl`}
                />
              </div>
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Manual Payment</label>
                <input
                  type="text"
                  placeholder="Enter Manual Payment"
                  value={paymentInfo}
                  onChange={(e) => setPaymentInfo(e.target.value)}
                  className={`${styles.input} dark:bg-[#1f1f1f] w-full rounded-xl`}
                />
              </div>
            </div>
          </div>

          <div className="vendor-form-section yebone-surface">
            <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Contact & address</h3>
            <div className="space-y-4">
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Shop Address</label>
                <input
                  type="text"
                  placeholder="Enter shop address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`${styles.input} dark:bg-[#1f1f1f] w-full rounded-xl`}
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
                  className={`${styles.input} dark:bg-[#1f1f1f] w-full rounded-xl`}
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
                  className={`${styles.input} dark:bg-[#1f1f1f] w-full rounded-xl`}
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-yebone-primary hover:opacity-90 text-white font-semibold rounded-xl transition-opacity yebone-btn-lift"
          >
            Update Shop
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShopSettings;
