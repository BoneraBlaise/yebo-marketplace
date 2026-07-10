import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { HiOutlineSparkles } from "react-icons/hi";
import { IoNotificationsOutline } from "react-icons/io5";
import DropDown from "../Layout/DropDown";
import Navbar from "../Layout/Navbar";
import LanguageSwitcher from "../LanguageSwitcher";
import MobileCategoriesPanel from "./MobileCategoriesPanel";
import {
  CountrySwitcher,
  NotificationsPanel,
  WishlistPanel,
  CartPanel,
} from "../Layout/overlays";
import useHeaderDropdown from "../Layout/overlays/useHeaderDropdown";
import { buildMobileNavCategories } from "./mainCategoryHierarchy";
import useSiteSearch from "../../hooks/useSiteSearch";
import { Container } from "../ui";
import YeboneLogo from "./YeboneLogo";
import SkipToContent from "../Layout/SkipToContent";
import "./home.css";

/** Presentation-only unread count for notification badge (Phase 8H.11) */
const NOTIFICATION_UNREAD_MOCK = 2;

const HomeHeader = ({ activeHeading: _activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const notificationsRef = useRef(null);
  const wishlistRef = useRef(null);
  const cartRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const {
    searchTerm,
    searchData,
    handleSearchChange,
    handleSearchSubmit,
    setSearchData,
  } = useSiteSearch();

  const marketplaceNavCategories = useMemo(() => buildMobileNavCategories(), []);

  const sellerAction = isSeller
    ? { label: "Vendor Dashboard", to: "/dashboard" }
    : isAuthenticated
      ? { label: "Become a Seller", to: "/shop-create" }
      : { label: "Sell with Us", to: "/shop-create" };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!dropDown) return undefined;

    const updateMegaMenuTop = () => {
      const headerEl = document.querySelector(".home-header");
      if (!headerEl) return;
      const { bottom } = headerEl.getBoundingClientRect();
      document.documentElement.style.setProperty(
        "--home-mega-menu-top",
        `${bottom + 8}px`
      );
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") setDropDown(false);
    };

    updateMegaMenuTop();
    window.addEventListener("resize", updateMegaMenuTop);
    window.addEventListener("scroll", updateMegaMenuTop, { passive: true });
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("resize", updateMegaMenuTop);
      window.removeEventListener("scroll", updateMegaMenuTop);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [dropDown]);

  useHeaderDropdown(openNotifications, () => setOpenNotifications(false), notificationsRef);
  useHeaderDropdown(openWishlist, () => setOpenWishlist(false), wishlistRef);
  useHeaderDropdown(openCart, () => setOpenCart(false), cartRef);

  return (
    <>
      <SkipToContent />
      <header
        className={`home-header sticky top-0 z-50 home-glass shadow-sm${
          isScrolled ? " home-header--scrolled" : ""
        }`}
      >
        <div className="home-header__utility hidden lg:block">
          <Container className="home-header__utility-inner">
            <p className="home-header__utility-tagline">Yebone — Everything in one place</p>
            <div className="home-header__utility-actions">
              <CountrySwitcher />

              <span className="home-header__utility-divider" aria-hidden="true" />

              <LanguageSwitcher />

              {!isAuthenticated && (
                <>
                  <span className="home-header__utility-divider" aria-hidden="true" />
                  <Link
                    to="/login"
                    className="text-sm font-medium text-yebone-primary hover:underline px-1"
                  >
                    Login
                  </Link>
                  <Link
                    to="/sign-up"
                    className="text-sm font-semibold px-4 py-1.5 rounded-full bg-yebone-primary text-white hover:bg-yebone-primary-dark transition"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </Container>
        </div>

        <Container className="home-header__main">
          <div className="home-header__main-row">
            <div className="home-header__brand shrink-0">
              <YeboneLogo size="md" className="home-header__logo" />
              <span className="home-header__logo-tagline hidden sm:block">
                Everything in one place
              </span>
            </div>

            <div
              className={`home-header__categories-wrap hidden lg:block shrink-0${
                dropDown ? " is-open" : ""
              }`}
            >
              <button
                type="button"
                onClick={() => setDropDown(!dropDown)}
                className={`home-header__categories-btn flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--home-border)] bg-[var(--home-surface-muted)] hover:bg-[var(--home-surface-muted)] font-medium text-sm text-[var(--home-text)] transition${
                  dropDown ? " is-active" : ""
                }`}
                aria-expanded={dropDown}
                aria-haspopup="menu"
              >
                <BiMenuAltLeft size={22} />
                Categories
              </button>
              {dropDown && (
                <>
                  <button
                    type="button"
                    className="yebone-nav-mega-backdrop"
                    onClick={() => setDropDown(false)}
                    aria-label="Close categories menu"
                  />
                  <DropDown categoriesData={marketplaceNavCategories} setDropDown={setDropDown} />
                </>
              )}
            </div>

            <div className="relative lg:hidden shrink-0 home-header__categories-mobile">
              <button
                type="button"
                onClick={() => setMobileCategoriesOpen(true)}
                className="home-header__icon-btn"
                aria-label="Browse categories"
                aria-expanded={mobileCategoriesOpen}
              >
                <BiMenuAltLeft size={22} />
              </button>
            </div>

            <form
              onSubmit={handleSearchSubmit}
              className="home-header__search-form flex-1 relative max-w-3xl min-w-0"
            >
              <div className="home-header__search-shell flex items-center rounded-2xl border border-[var(--home-border)] bg-[var(--home-surface)] focus-within:border-yebone-primary focus-within:ring-4 focus-within:ring-yebone-primary/10 transition shadow-sm">
                <AiOutlineSearch
                  size={22}
                  className="home-header__search-icon ml-4 text-yebone-primary shrink-0"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search products, brands, categories..."
                  className="home-header__search-input flex-1 h-12 px-3 bg-transparent outline-none text-sm text-[var(--home-text)] placeholder:text-[var(--home-text-muted)]"
                />
                <Link
                  to="/#ai-experience"
                  className="home-header__search-ai hidden md:flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yebone-primary to-yebone-primary-dark text-white text-xs font-semibold hover:opacity-90 transition shrink-0"
                >
                  <HiOutlineSparkles size={16} />
                  <span>AI Search</span>
                </Link>
                <button
                  type="submit"
                  className="home-header__search-submit h-10 mr-1.5 px-5 rounded-xl bg-yebone-primary text-white text-sm font-semibold hover:bg-yebone-primary-dark transition"
                >
                  Search
                </button>
              </div>

              {searchData?.length > 0 && (
                <div
                  className="home-search-suggest"
                  role="listbox"
                  aria-label="Search suggestions"
                >
                  <div className="home-search-suggest__scroll">
                    {searchData.slice(0, 8).map((item) => {
                      const meta =
                        item.shop?.name ||
                        item.category ||
                        (item.type === "flashsale"
                          ? "Flash Sale"
                          : item.type === "bid"
                          ? "Auction"
                          : null);

                      return (
                        <Link
                          key={`${item.type || "product"}-${item._id}`}
                          to={`/product/${item._id}`}
                          onClick={() => setSearchData(null)}
                          className="home-search-suggest__row"
                          role="option"
                        >
                          <span className="home-search-suggest__thumb">
                            <img
                              src={item.images?.[0]?.url}
                              alt=""
                              loading="lazy"
                              decoding="async"
                            />
                          </span>
                          <span className="home-search-suggest__body">
                            <span className="home-search-suggest__title">{item.name}</span>
                            {meta && (
                              <span className="home-search-suggest__meta">{meta}</span>
                            )}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </form>

            <div className="home-header__actions shrink-0">
              <Link
                to={sellerAction.to}
                className="home-header__seller-link hidden lg:inline-flex"
              >
                {sellerAction.label}
              </Link>

              <div className="relative" ref={wishlistRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenCart(false);
                    setOpenNotifications(false);
                    setOpenWishlist(!openWishlist);
                  }}
                  className="home-header__icon-btn"
                  aria-expanded={openWishlist}
                  aria-haspopup="true"
                  aria-label="Wishlist"
                >
                  <AiOutlineHeart size={22} />
                  {wishlist?.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yebone-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </button>
                {openWishlist && (
                  <WishlistPanel onClose={() => setOpenWishlist(false)} />
                )}
              </div>

              <div className="relative hidden lg:block" ref={notificationsRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenWishlist(false);
                    setOpenCart(false);
                    setOpenNotifications(!openNotifications);
                  }}
                  className="home-header__icon-btn home-header__notifications"
                  aria-expanded={openNotifications}
                  aria-haspopup="true"
                  aria-label="Notifications"
                >
                  <IoNotificationsOutline size={22} />
                  {NOTIFICATION_UNREAD_MOCK > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yebone-primary text-white text-[10px] font-bold flex items-center justify-center">
                      {NOTIFICATION_UNREAD_MOCK}
                    </span>
                  )}
                </button>
                {openNotifications && (
                  <NotificationsPanel
                    onClose={() => setOpenNotifications(false)}
                    isAuthenticated={isAuthenticated}
                  />
                )}
              </div>

              <div className="relative" ref={cartRef}>
                <button
                  type="button"
                  onClick={() => {
                    setOpenWishlist(false);
                    setOpenNotifications(false);
                    setOpenCart(!openCart);
                  }}
                  className="home-header__icon-btn"
                  aria-expanded={openCart}
                  aria-haspopup="true"
                  aria-label="Cart"
                >
                  <AiOutlineShoppingCart size={22} />
                  {cart?.length > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yebone-gold text-yebone-dark-text text-[10px] font-bold flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </button>
                {openCart && <CartPanel onClose={() => setOpenCart(false)} />}
              </div>

              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="home-header__profile-mobile lg:hidden p-0.5 rounded-full border-2 border-yebone-primary/25 hover:border-yebone-primary transition"
                aria-label={isAuthenticated ? "Go to profile" : "Sign in"}
              >
                {isAuthenticated && user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt=""
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--home-surface-muted)] flex items-center justify-center">
                    <CgProfile size={20} className="text-yebone-primary" />
                  </div>
                )}
              </Link>

              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="home-header__profile-desktop hidden lg:flex p-0.5 rounded-full border-2 border-yebone-primary/25 hover:border-yebone-primary transition"
                aria-label={isAuthenticated ? "Open account menu" : "Sign in"}
              >
                {isAuthenticated && user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[var(--home-surface-muted)] flex items-center justify-center">
                    <CgProfile size={22} className="text-yebone-primary" />
                  </div>
                )}
              </Link>
            </div>
          </div>
        </Container>

        <div className="home-header__nav-strip hidden lg:block">
          <Container className="home-header__nav-inner">
            <Navbar />
          </Container>
        </div>


        <MobileCategoriesPanel
          open={mobileCategoriesOpen}
          onClose={() => setMobileCategoriesOpen(false)}
          categoriesData={marketplaceNavCategories}
        />
      </header>
    </>
  );
};

export default HomeHeader;
