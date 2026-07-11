import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineClock,
  HiOutlineBell,
  HiOutlineLocationMarker,
  HiOutlineCreditCard,
  HiOutlineCog,
  HiOutlineViewGrid,
  HiOutlineSparkles,
} from "react-icons/hi";
import { AiOutlineLogin } from "react-icons/ai";
import { logoutUser } from "../../config/authService";

const MobileProfileMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);

  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const goToProfile = (active) => {
    onClose();
    navigate("/profile", { state: { active } });
  };

  const logoutHandler = async () => {
    await logoutUser();
    toast.success("Logged out");
    onClose();
    navigate("/login");
    window.location.reload();
  };

  if (!open) return null;

  const menuItemClass =
    "home-mobile-profile__item w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium transition";

  return (
    <div className="home-mobile-profile lg:hidden" role="dialog" aria-modal="true" aria-label="Account menu">
      <button
        type="button"
        className="home-mobile-profile__overlay"
        onClick={onClose}
        aria-label="Close account menu"
      />
      <div ref={panelRef} className="home-mobile-profile__panel">
        <div className="home-mobile-profile__header">
          <div>
            <p className="text-xs uppercase tracking-wider opacity-60">Account</p>
            <p className="font-semibold text-base mt-0.5">
              {isAuthenticated ? user?.name || "My account" : "Welcome to Yebone"}
            </p>
          </div>
          <button type="button" onClick={onClose} className="home-header__icon-btn" aria-label="Close">
            <RxCross1 size={20} />
          </button>
        </div>

        <nav className="home-mobile-profile__nav">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className={menuItemClass} onClick={onClose}>
                <AiOutlineLogin size={20} />
                Login
              </Link>
              <Link to="/sign-up" className={menuItemClass} onClick={onClose}>
                <HiOutlineUser size={20} />
                Sign Up
              </Link>
              <Link to="/shop-create" className={menuItemClass} onClick={onClose}>
                <HiOutlineSparkles size={20} />
                Sell with Us
              </Link>
            </>
          ) : (
            <>
              <button type="button" className={menuItemClass} onClick={() => goToProfile(1)}>
                <HiOutlineUser size={20} />
                My Profile
              </button>
              <button type="button" className={menuItemClass} onClick={() => goToProfile(2)}>
                <HiOutlineShoppingBag size={20} />
                Orders
              </button>
              <button type="button" className={menuItemClass} onClick={() => goToProfile(10)}>
                <HiOutlineHeart size={20} />
                Wishlist
              </button>
              <Link to="/#recently-viewed" className={menuItemClass} onClick={onClose}>
                <HiOutlineClock size={20} />
                Recently Viewed
              </Link>
              <button type="button" className={menuItemClass} onClick={() => goToProfile(12)}>
                <HiOutlineBell size={20} />
                Notifications
              </button>
              <button type="button" className={menuItemClass} onClick={() => goToProfile(7)}>
                <HiOutlineLocationMarker size={20} />
                Addresses
              </button>
              <Link to="/payment" className={menuItemClass} onClick={onClose}>
                <HiOutlineCreditCard size={20} />
                Payment Methods
              </Link>
              {isSeller ? (
                <Link to="/dashboard" className={menuItemClass} onClick={onClose}>
                  <HiOutlineViewGrid size={20} />
                  Vendor Dashboard
                </Link>
              ) : (
                <Link to="/shop-create" className={menuItemClass} onClick={onClose}>
                  <HiOutlineSparkles size={20} />
                  Become a Seller
                </Link>
              )}
              <button type="button" className={menuItemClass} onClick={() => goToProfile(13)}>
                <HiOutlineCog size={20} />
                Settings
              </button>
              <button
                type="button"
                className={`${menuItemClass} home-mobile-profile__logout`}
                onClick={logoutHandler}
              >
                <AiOutlineLogin size={20} />
                Logout
              </button>
            </>
          )}
        </nav>
      </div>
    </div>
  );
};

export default MobileProfileMenu;
