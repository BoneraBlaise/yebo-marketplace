import React from "react";
import { AiOutlineLogin } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
  MdOutlineWbSunny
} from "react-icons/md";
import { FiMessageSquare } from "react-icons/fi";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { IoMoonOutline } from "react-icons/io5";
import { useTheme } from "../../context/ThemeContext";
import { FaCreativeCommonsSamplingPlus } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.user);
  const { t } = useTranslation();

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.response.data.message);
      });
  };

  return (
    <div className="w-full bg-white dark:bg-[#1f1f1f] dark:text-gray-200 shadow-sm rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "green" : ""} />
        <span className={`pl-3 ${active === 1 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.myProfile")}
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "green" : ""} />
        <span className={`pl-3 ${active === 2 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.orders")}
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "green" : ""} />
        <span className={`pl-3 ${active === 3 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.refunds")}
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(4) || navigate("/inbox")}
      >
        <FiMessageSquare size={20} color={active === 4 ? "green" : ""} />
        <span className={`pl-3 ${active === 4 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.inbox")}
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "green" : ""} />
        <span className={`pl-3 ${active === 5 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.trackOrder")}
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={20} color={active === 6 ? "green" : ""} />
        <span className={`pl-3 ${active === 6 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.changePassword")}
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "green" : ""} />
        <span className={`pl-3 ${active === 7 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.address")}
        </span>
      </div>

      {/* Theme Toggle - Icon Button */}
      <div className="flex items-center cursor-pointer w-full mb-8" onClick={toggleTheme}>
        <span className="flex items-center">
          {theme === "dark" ? (
            <MdOutlineWbSunny size={20} className="text-white" />
          ) : (
            <IoMoonOutline size={20} className="text-black" />
          )}
          <span className={`pl-3 ${theme === "dark" ? "text-white" : "text-black"} 800px:block hidden`}>
            {t("profile.theme")}
          </span>
        </span>
      </div>

      {/* Admin Dashboard link - conditionally rendered */}
      {user && user?.role === "Admin" && (
        <Link to="/admin/dashboard">
          <div
            className="flex items-center cursor-pointer w-full mb-8"
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings size={20} color={active === 8 ? "green" : ""} />
            <span className={`pl-3 ${active === 8 ? "text-green-500" : ""} 800px:block hidden`}>
              {t("profile.adminDashboard")}
            </span>
          </div>
        </Link>
      )}

      {/* Add Commission Dashboard menu item */}
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(9)}
      >
        <FaCreativeCommonsSamplingPlus size={20} color={active === 9 ? "green" : ""} />
        <span className={`pl-3 ${active === 9 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.commissionDashboard")}
        </span>
      </div>

      {/* Logout */}
      <div
        className="single_item flex items-center cursor-pointer w-full mb-8"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={20} color={active === 8 ? "green" : ""} />
        <span className={`pl-3 ${active === 8 ? "text-green-500" : ""} 800px:block hidden`}>
          {t("profile.logout")}
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;
