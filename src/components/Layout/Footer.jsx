import React, { useState, useEffect } from "react";
import {
  AiFillFacebook,
  AiFillInstagram,
  AiFillYoutube,
  AiOutlineTwitter,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { footercompanyLinks, footerProductLinks, footerSupportLinks } from "../../static/data";
import logo from "../../Assests/Logo/logo.png";
import BottomNav from "./BottomNav"; // Import the BottomNav component
import { useTranslation } from "react-i18next";

const Footer = () => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 900);
    };

    handleResize(); // Call once to set initial state
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isSmallScreen) {
    return <BottomNav />;
  }

  return (
    <div className="bg-white dark:bg-[#05040e] dark:text-gray-200 text-gray-800 h-auto mb-[-24px]">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:px-8 px-5 py-16 sm:text-center mx-auto">
        <ul className="px-5 text-center sm:text-start flex sm:block flex-col items-center">
          <img
            src={logo}
            alt="Logo"
            className="filter invert-100 brightness-0 dark:invert"
          />
          <br />
          <p>{t("footer.youNeedItWeGotIt")}</p> {/* Translated slogan */}
          <div className="flex items-center mt-[15px]">
            <AiFillFacebook size={25} className="cursor-pointer" />
            <AiOutlineTwitter
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillInstagram
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
            <AiFillYoutube
              size={25}
              style={{ marginLeft: "15px", cursor: "pointer" }}
            />
          </div>
        </ul>

        {/* Product Links */}
        <ul className="text-center sm:text-start">
          {footerProductLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-600 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {t(`footer.${link.name.replace(/ & /g, "And").toLowerCase()}`)} {/* Ensure proper key format */}
              </Link>
            </li>
          ))}
        </ul>

        {/* Company Links */}
        <ul className="text-center sm:text-start">
          {footercompanyLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-600 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {t(`footer.${link.name.replace(/ & /g, "And").toLowerCase()}`)} {/* Ensure proper key format */}
              </Link>
            </li>
          ))}
        </ul>

        {/* Support Links */}
        <ul className="text-center sm:text-start">
          {footerSupportLinks.map((link, index) => (
            <li key={index}>
              <Link
                className="text-gray-600 hover:text-teal-400 duration-300 text-sm cursor-pointer leading-6"
                to={link.link}
              >
                {t(`footer.${link.name.replace(/ & /g, "And").toLowerCase()}`)} {/* Ensure proper key format */}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 text-center pt-2 text-gray-600 text-sm pb-8"
      >
        <span>© 2024 guriraline. All rights reserved.</span>
        <span>{t('footer.terms')} · {t('footer.privacy policy')}</span> {/* Translated Terms and Privacy Policy */}
        <div className="sm:block flex items-center justify-center w-full">
          <img src={logo} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
