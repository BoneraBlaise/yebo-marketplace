import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { RxCross1 } from "react-icons/rx";
import {
  HiOutlineUser,
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineLocationMarker,
  HiOutlineCog,
  HiOutlineViewGrid,
  HiOutlineChartBar,
  HiOutlineCube,
  HiOutlineCurrencyDollar,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineDesktopComputer,
} from "react-icons/hi";
import { AiOutlineLogin, AiOutlineShoppingCart } from "react-icons/ai";
import { FiMessageSquare } from "react-icons/fi";
import { logoutUser } from "../../config/authService";
import { resolveSellerNavAction, SELLER_DASHBOARD_PATH, SELLER_ONBOARDING_PATH } from "../../utils/sellerNav";
import { useMarketplaceMode } from "../../context/MarketplaceModeContext";
import { useTheme } from "../../context/ThemeContext";

const ProfileHubRoleSwitch = ({ onSwitch }) => {
  const { mode, switchToCustomerMode, switchToSellerMode } = useMarketplaceMode();

  return (
    <div className="profile-hub__role" role="radiogroup" aria-label="Switch role">
      <p className="profile-hub__role-label">Switch Role</p>
      <button
        type="button"
        role="radio"
        aria-checked={mode === "customer"}
        className={`profile-hub__role-option ${mode === "customer" ? "is-active" : ""}`}
        onClick={() => {
          switchToCustomerMode();
          onSwitch?.();
        }}
      >
        <span className="profile-hub__role-dot" aria-hidden="true" />
        Customer
      </button>
      <button
        type="button"
        role="radio"
        aria-checked={mode === "seller"}
        className={`profile-hub__role-option ${mode === "seller" ? "is-active" : ""}`}
        onClick={() => {
          switchToSellerMode();
          onSwitch?.();
        }}
      >
        <span className="profile-hub__role-dot" aria-hidden="true" />
        Seller
      </button>
    </div>
  );
};

const APPEARANCE_OPTIONS = [
  { id: "light", label: "Light", icon: HiOutlineSun },
  { id: "dark", label: "Dark", icon: HiOutlineMoon },
  { id: "system", label: "System", icon: HiOutlineDesktopComputer },
];

const ProfileHubAppearance = () => {
  const { themePreference, setThemePreference } = useTheme();

  return (
    <div className="profile-hub__appearance" role="radiogroup" aria-label="Appearance">
      <p className="profile-hub__appearance-label">Appearance</p>
      <div className="profile-hub__appearance-row">
        {APPEARANCE_OPTIONS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={themePreference === id}
            className={`profile-hub__appearance-option${themePreference === id ? " is-active" : ""}`}
            onClick={() => setThemePreference(id)}
          >
            <Icon size={18} aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Unified profile navigation hub.
 * variant: "sheet" (mobile bottom sheet) | "popover" (desktop/tablet dropdown)
 */
const ProfileHub = ({ open, onClose, variant = "sheet", anchorRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const panelRef = useRef(null);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { setMode } = useMarketplaceMode();

  const isSheet = variant === "sheet";
  const inboxPath = isSeller ? "/dashboard-messages" : "/inbox";
  const dashboardPath = isSeller ? SELLER_DASHBOARD_PATH : "/profile";
  const sellerNav = resolveSellerNavAction({ isAuthenticated, isSeller });

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    if (isSheet) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      if (isSheet) document.body.style.overflow = "";
    };
  }, [open, onClose, isSheet]);

  useEffect(() => {
    if (!open || isSheet || !anchorRef?.current) return undefined;
    const onDoc = (e) => {
      if (
        panelRef.current?.contains(e.target) ||
        anchorRef.current?.contains(e.target)
      ) {
        return;
      }
      onClose();
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, isSheet, anchorRef, onClose]);

  if (!open) return null;

  const go = (path, state) => {
    onClose();
    navigate(path, state ? { state } : undefined);
  };

  const goProfileTab = (active) => go("/profile", { active });

  const logoutHandler = async () => {
    await logoutUser();
    dispatch({ type: "LoadUserFail", payload: "Logged out" });
    toast.success("Logged out");
    onClose();
    navigate("/login");
  };

  const Item = ({ icon: Icon, children, onClick, to, className = "" }) => {
    const cls = `profile-hub__item ${className}`.trim();
    if (to) {
      return (
        <Link to={to} className={cls} onClick={onClose}>
          <Icon size={20} aria-hidden="true" />
          {children}
        </Link>
      );
    }
    return (
      <button type="button" className={cls} onClick={onClick}>
        <Icon size={20} aria-hidden="true" />
        {children}
      </button>
    );
  };

  const content = (
    <>
      <div className="profile-hub__header">
        <div>
          <p className="profile-hub__eyebrow">Account</p>
          <p className="profile-hub__name">
            {isAuthenticated ? user?.name || "My account" : "Welcome to Yebone"}
          </p>
        </div>
        <button type="button" onClick={onClose} className="profile-hub__close" aria-label="Close">
          <RxCross1 size={18} />
        </button>
      </div>

      <nav className="profile-hub__nav">
        {!isAuthenticated ? (
          <>
            <Item icon={AiOutlineLogin} to="/login">Login</Item>
            <Item icon={HiOutlineUser} to="/sign-up">Sign Up</Item>
            <Item icon={HiOutlineSparkles} to={SELLER_ONBOARDING_PATH}>Sell with Us</Item>
            <div className="profile-hub__divider" role="separator" />
            <ProfileHubAppearance />
          </>
        ) : (
          <>
            <Item icon={HiOutlineUser} onClick={() => goProfileTab(1)}>Profile</Item>
            <Item
              icon={HiOutlineViewGrid}
              onClick={() => {
                if (isSeller) setMode("seller");
                go(dashboardPath);
              }}
            >
              Dashboard
            </Item>

            <div className="profile-hub__divider" role="separator" />
            <Item icon={FiMessageSquare} to={inboxPath}>Inbox</Item>
            <Item icon={HiOutlineBell} onClick={() => goProfileTab(12)}>Notifications</Item>
            <Item icon={HiOutlineHeart} onClick={() => goProfileTab(10)}>Wishlist</Item>

            <div className="profile-hub__divider" role="separator" />

            {!isSeller ? (
              <>
                <Item icon={HiOutlineShoppingBag} onClick={() => goProfileTab(2)}>Orders</Item>
                <Item icon={AiOutlineShoppingCart} onClick={() => goProfileTab(0)}>Cart</Item>
                <Item icon={HiOutlineHeart} onClick={() => goProfileTab(10)}>Saved Items</Item>
                <Item icon={HiOutlineLocationMarker} onClick={() => goProfileTab(7)}>Addresses</Item>
              </>
            ) : (
              <>
                <Item icon={HiOutlineShoppingBag} to="/dashboard-orders">Orders</Item>
                <Item icon={HiOutlineCube} to="/dashboard-products">Products</Item>
                <Item
                  icon={HiOutlineViewGrid}
                  onClick={() => {
                    setMode("seller");
                    go(SELLER_DASHBOARD_PATH);
                  }}
                >
                  My Shop
                </Item>
                <Item icon={HiOutlineChartBar} to="/dashboard#vendor-analytics">Analytics</Item>
                <Item icon={HiOutlineCurrencyDollar} to="/dashboard-withdraw-money">Payments</Item>
              </>
            )}

            <div className="profile-hub__divider" role="separator" />
            <Item icon={HiOutlineCog} onClick={() => goProfileTab(13)}>Settings</Item>
            <ProfileHubAppearance />

            {isSeller ? <ProfileHubRoleSwitch onSwitch={onClose} /> : null}

            {!isSeller && sellerNav.variant !== "seller" ? (
              <Item icon={HiOutlineSparkles} to={sellerNav.to}>{sellerNav.label}</Item>
            ) : null}

            <div className="profile-hub__divider" role="separator" />
            <Item icon={AiOutlineLogin} onClick={logoutHandler} className="profile-hub__item--logout">
              Logout
            </Item>
          </>
        )}
      </nav>
    </>
  );

  if (isSheet) {
    return (
      <div className="profile-hub-backdrop" role="presentation" onClick={onClose}>
        <div
          ref={panelRef}
          className="profile-hub profile-hub--sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Account menu"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="profile-hub__handle" aria-hidden="true" />
          <div className="profile-hub__sheet-scroll">{content}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className="profile-hub profile-hub--popover"
      role="dialog"
      aria-modal="false"
      aria-label="Account menu"
    >
      {content}
    </div>
  );
};

export default React.memo(ProfileHub);
