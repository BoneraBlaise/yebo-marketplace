import React, { useState } from "react";
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
import { MdKeyboardArrowDown } from "react-icons/md";
import DropDown from "../Layout/DropDown";
import Navbar from "../Layout/Navbar";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import LanguageSwitcher from "../LanguageSwitcher";
import { categoriesData } from "../../static/data";
import useSiteSearch from "../../hooks/useSiteSearch";
import { Container } from "../ui";
import YeboneLogo from "./YeboneLogo";
import SkipToContent from "../Layout/SkipToContent";

const COUNTRIES = [
  { code: "RW", label: "Rwanda", flag: "🇷🇼" },
  { code: "KE", label: "Kenya", flag: "🇰🇪" },
  { code: "UG", label: "Uganda", flag: "🇺🇬" },
  { code: "NG", label: "Nigeria", flag: "🇳🇬" },
];

const HomeHeader = ({ activeHeading = 1 }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const {
    searchTerm,
    searchData,
    handleSearchChange,
    handleSearchSubmit,
    setSearchData,
  } = useSiteSearch();

  const handleMouseLeave = () => setDropDown(false);

  return (
    <>
      <SkipToContent />
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-950/90 home-glass border-b border-gray-100 dark:border-gray-800 shadow-sm">
      {/* Top utility bar */}
      <div className="hidden lg:block border-b border-gray-100 dark:border-gray-800">
        <Container className="py-2 flex items-center justify-between text-sm">
          <p className="text-gray-500 dark:text-gray-400">
            Yebone — Everything in one place
          </p>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-yebone-primary transition"
              >
                <span>{country.flag}</span>
                <span>{country.label}</span>
                <MdKeyboardArrowDown />
              </button>
              {countryOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 py-1 z-50">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCountry(c);
                        setCountryOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-yebone-light-gray dark:hover:bg-gray-800 flex items-center gap-2"
                    >
                      <span>{c.flag}</span>
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <LanguageSwitcher />
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="font-medium text-yebone-primary hover:underline">
                  Login
                </Link>
                <Link
                  to="/sign-up"
                  className="font-medium px-4 py-1.5 rounded-full bg-yebone-primary text-white hover:bg-yebone-primary-dark transition"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <Link to="/profile" className="font-medium text-yebone-primary hover:underline">
                My Account
              </Link>
            )}
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <Container className="py-3 lg:py-4">
        <div className="flex items-center gap-3 lg:gap-6">
          <YeboneLogo size="md" className="shrink-0" />

          {/* Categories */}
          <div
            className="relative hidden lg:block"
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={() => setDropDown(!dropDown)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-yebone-light-gray dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition font-medium text-sm"
            >
              <BiMenuAltLeft size={22} />
              Categories
            </button>
            {dropDown && (
              <DropDown
                categoriesData={categoriesData}
                setDropDown={setDropDown}
              />
            )}
          </div>

          {/* Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 relative max-w-3xl"
          >
            <div className="flex items-center rounded-2xl border-2 border-yebone-primary/20 bg-white dark:bg-gray-900 focus-within:border-yebone-primary focus-within:ring-4 focus-within:ring-yebone-primary/10 transition shadow-sm">
              <AiOutlineSearch
                size={22}
                className="ml-4 text-yebone-primary shrink-0"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products, brands, categories..."
                className="flex-1 h-12 px-3 bg-transparent outline-none text-sm dark:text-white"
              />
              <Link
                to="/#ai-experience"
                className="hidden md:flex items-center gap-1.5 mr-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-yebone-primary to-yebone-primary-dark text-white text-xs font-semibold hover:opacity-90 transition shrink-0"
              >
                <HiOutlineSparkles size={16} />
                AI Search
              </Link>
              <button
                type="submit"
                className="h-10 mr-1.5 px-5 rounded-xl bg-yebone-primary text-white text-sm font-semibold hover:bg-yebone-primary-dark transition"
              >
                Search
              </button>
            </div>

            {searchData?.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 max-h-80 overflow-y-auto z-50">
                {searchData.slice(0, 8).map((item) => (
                  <Link
                    key={item._id}
                    to={`/product/${item._id}`}
                    onClick={() => setSearchData(null)}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-yebone-light-gray dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 last:border-0"
                  >
                    <img
                      src={item.images?.[0]?.url}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                    />
                    <span className="text-sm dark:text-white truncate">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setOpenWishlist(true)}
              className="relative p-2.5 rounded-xl hover:bg-yebone-light-gray dark:hover:bg-gray-900 transition"
              aria-label="Wishlist"
            >
              <AiOutlineHeart size={24} className="dark:text-white" />
              {wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yebone-primary text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="relative p-2.5 rounded-xl hover:bg-yebone-light-gray dark:hover:bg-gray-900 transition hidden sm:flex"
              aria-label="Notifications"
            >
              <IoNotificationsOutline size={24} className="dark:text-white" />
            </Link>

            <button
              type="button"
              onClick={() => setOpenCart(true)}
              className="relative p-2.5 rounded-xl hover:bg-yebone-light-gray dark:hover:bg-gray-900 transition"
              aria-label="Cart"
            >
              <AiOutlineShoppingCart size={24} className="dark:text-white" />
              {cart?.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-yebone-gold text-yebone-dark-text text-[10px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="p-1 rounded-full border-2 border-yebone-primary/30 hover:border-yebone-primary transition hidden md:block"
            >
              {isAuthenticated && user?.avatar?.url ? (
                <img
                  src={user.avatar.url}
                  alt=""
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-yebone-light-gray dark:bg-gray-800 flex items-center justify-center">
                  <CgProfile size={22} className="text-yebone-primary" />
                </div>
              )}
            </Link>
          </div>
        </div>
      </Container>

      {/* Nav strip */}
      <div className="hidden lg:block border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80">
        <Container className="py-1">
          <Navbar active={activeHeading} />
        </Container>
      </div>

      {openCart && <Cart setOpenCart={setOpenCart} />}
      {openWishlist && <Wishlist setOpenWishlist={setOpenWishlist} />}
    </header>
    </>
  );
};

export default HomeHeader;
