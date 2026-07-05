import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineFilter,
} from "react-icons/ai";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import logo from "../../Assests/Logo/logo.png";
import logomobile from "../../Assests/Logo/logomobile.png";
import { BsFillMegaphoneFill } from "react-icons/bs";
import { FaPhoneAlt } from "react-icons/fa";
import LanguageSwitcher from "../LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { IoIosArrowForward } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const { allFlashSales } = useSelector((state) => state.flashSales);
  const { activeBids } = useSelector((state) => state.bids);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    if (term === "") {
      setSearchData(null);
      return;
    }
  
    const filteredProducts = allProducts.filter((product) => {
      const productName = product.name?.toLowerCase() || ""; // Default to empty string if undefined
      const shopName = product.shop?.name?.toLowerCase() || ""; // Default to empty string if undefined
      const productCategory = product.category?.toLowerCase() || ""; // Default to empty string if undefined
      return (
        productName.includes(term) ||
        shopName.includes(term) ||
        productCategory.includes(term)
      );
    }).map(item => ({ ...item, type: 'product' }));
  
    const filteredFlashSales = allFlashSales?.filter((item) => {
      const flashSaleName = item.name?.toLowerCase() || ""; // Default to empty string if undefined
      const flashShopName = item.shop?.name?.toLowerCase() || ""; // Default to empty string if undefined
      const flashCategory = item.category?.toLowerCase() || ""; // Default to empty string if undefined
      return (
        flashSaleName.includes(term) ||
        flashShopName.includes(term) ||
        flashCategory.includes(term)
      );
    }).map(item => ({ ...item, type: 'flashsale' })) || [];
  
    const filteredBids = activeBids?.filter((item) => {
      const bidName = item.name?.toLowerCase() || ""; // Default to empty string if undefined
      const bidShopName = item.shop?.name?.toLowerCase() || ""; // Default to empty string if undefined
      const bidCategory = item.category?.toLowerCase() || ""; // Default to empty string if undefined
      return (
        bidName.includes(term) ||
        bidShopName.includes(term) ||
        bidCategory.includes(term)
      );
    }).map(item => ({ ...item, type: 'bid' })) || [];
  
    setSearchData([...filteredProducts, ...filteredFlashSales, ...filteredBids]);
  };
  
  const navigate = useNavigate();
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
    setSearchData(null);
  };

  const toggleFilterOptions = () => {
    setShowFilterOptions(!showFilterOptions);
  };

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
    toggleFilterOptions(); // Close filter options after selection
    // Optionally, you can trigger a new search or update the displayed products based on the selected filter
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  const handleMouseLeave = () => {
    setDropDown(false); // Hide dropdown when mouse leaves the dropdown area
  };

  return (
    <div className="bg-white dark:bg-[#1f1f1f] shadow-b-lg shadow-black text-black dark:text-white">
      {/* Top Bar */}
      <div className="p-1 text-sm text-center hidden md:block dark:bg-black">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="text-gray-500 dark:text-gray-200">
              <FaPhoneAlt />
            </span>
            <Link
              to="/sell"
              className="text-gray-500 dark:text-gray-200 hover:underline"
            >
              {t("common.helpSupport")}
            </Link>
            <span className="text-[#29625d]">
              <BsFillMegaphoneFill />
            </span>
            <Link
              to="/shop-login"
              className="text-[#29625d] hover:underline font-bold"
            >
              {t("common.sellWithUs")}
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-[#29625d] hover:underline mr-4 font-bold"
                >
                  {t("common.login")}
                </Link>
                <Link
                  to="/sign-up"
                  className="text-[#29625d] hover:underline font-bold"
                >
                 {t("common.signup")}
                </Link>
              </>
            ) : (
              <Link
                to="/profile"
                className="text-[#29625d] hover:underline font-bold"
              >
                {t("common.profile")}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div
        className={`${styles.section} "bg-white dark:bg-[#1f1f1f] text-black dark:text-white}`}
      >
        <div className="hidden 400px:h-[20px] 800px:my-[30px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>
          <div className="w-[50%] relative bg-white dark:bg-[#1f1f1f] text-black dark:text-white">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-2 border-[#29625d] border-[2px] rounded-md bg-white dark:bg-[#1f1f1f] text-black dark:text-white"
              />
              <AiOutlineSearch
                size={30}
                className="absolute text-[#29625d] right-2 top-1.5 cursor-pointer"
                onClick={handleSearchSubmit}
              />
            </form>
          </div>

          <div className="ml-2 mt-1">
            <a
              className="text-black dark:text-gray-200 font-[600] hover:bg-[#29625d] hover:text-white p-2 rounded-md"
              href="/shop-login"
              target="_blank"
            >
              Earn With Us
            </a>
          </div>
        </div>
      </div>
      <div
        className={`${
          active === true ? "shadow-lg fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex shadow-lg items-center justify-between w-full bg-white dark:bg-[#05040e] text-gray-600 dark:text-gray-200 h-[70px]`}
      >
        {/* Boxed Layout Container */}
        <div className="w-[95%] mx-auto flex items-center justify-between">
          {/* Left Section: Menu and Navbar */}
          <div
            className={`${styles.section} relative ${styles.noramlFlex} justify-start`} // Adjusted justify-start for the left-aligned items
          >
            <div onClick={() => setDropDown(!dropDown)}>
              <div
                className="relative h-[60px] mt-[10px] w-[220px] hidden 1000px:block"
                onMouseLeave={handleMouseLeave}
              >
                <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
                <button
                  className={`h-[100%] w-full flex justify-between items-center pb-2 pl-10 bg-white dark:bg-[#05040e] dark:text-gray-200 font-sans text-md select-none`}
                >
                  Shop by category
                </button>
                {dropDown ? (
                  <DropDown
                    categoriesData={categoriesData}
                    setDropDown={setDropDown}
                  />
                ) : null}
              </div>
            </div>

            <div className="flex items-start z-10 mx-auto">
              <Navbar active={activeHeading} />
            </div>
          </div>

          {/* Right Section: Icons for Cart, Wishlist, and User Avatar */}
          <div className="flex ml-auto">
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishlist(true)}
              >
                <AiOutlineHeart size={30} color="dark:gray-200 black" />
                <span className="absolute right-0 top-0 rounded-full bg-[#29625d] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart size={30} color="dark:white black" />
                <span className="absolute right-0 top-0 rounded-full bg-[#29625d] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
            {openWishlist ? (
              <Wishlist setOpenWishlist={setOpenWishlist} />
            ) : null}
          </div>
        </div>
      </div>

         {/* Mobile */}
         <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } w-full h-[60px] bg-white dark:bg-[#05040e] z-50 top-0 left-0 shadow-b-xl shadow-[#000000] 800px:hidden`}
      >
        <div className="w-100 flex items-center justify-between">
          <div className="">
            <Link to="/">
              <img
                src={logomobile}
                alt="logo"
                className="w-[40px] h-[40px] ml-[20px] mt-1"
              />
            </Link>
          </div>
          <div className="ml-[20px] mt-1 w-[80%]">
            <div className="mt-1 w-full relative">
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  placeholder="Search Product..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="h-[40px] w-full px-2 border-[#29625d] border-[1px] rounded-md dark:bg-[#1f1f1f]"
                />
                <AiOutlineSearch
                  size={20}
                  className="absolute right-12 top-2.5 cursor-pointer text-[#29625d]"
                  onClick={handleSearchSubmit}
                />

                <AiOutlineFilter
                  size={20}
                  className="absolute right-2 top-2.5 cursor-pointer text-[#29625d]"
                  onClick={toggleFilterOptions} // Toggle filter options
                />
                {searchData && searchData.length > 0 ? (
                  <div className="absolute min-h-[30vh] w-full bg-slate-50 dark:bg-gray-800 text-black dark:text-white shadow-sm-2 z-[9] p-3 pt-4">
                    {searchData.map((i, index) => (
                      <Link to={`/product/${i._id}`} key={i._id}>
                        <div className="w-full flex items-start-py-3 mt-2 mb-3">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                        <hr />
                      </Link>
                    ))}
                  </div>
                ) : null}
                {showFilterOptions && (
                  <div className="absolute right-0 top-[100%] w-full bg-white shadow-lg rounded-md p-2 z-10">
                    <div className="flex flex-col">
                      <div className="mb-2">
                        <h4 className="font-semibold">Price Range</h4>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("min_price_1000")}
                        >
                          Min RWF 1,000
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("min_price_10000")}
                        >
                          Min RWF 10,000
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("min_price_100000")}
                        >
                          Min RWF 100,000
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("min_price_1000000")}
                        >
                          Min RWF 1,000,000
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("min_price_10000000")}
                        >
                          Min RWF 10,000,000
                        </button>
                      </div>
                      <div className="mb-2">
                        <h4 className="font-semibold">Product Type</h4>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("wholesale")}
                        >
                          Wholesale
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("single")}
                        >
                          Single Product
                        </button>
                      </div>
                      <div className="mb-2">
                        <h4 className="font-semibold">Condition</h4>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("new")}
                        >
                          New
                        </button>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("used")}
                        >
                          Used
                        </button>
                      </div>
                      <div className="mb-2">
                        <h4 className="font-semibold">Discount</h4>
                        <button
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-black"
                          onClick={() => applyFilter("discount")}
                        >
                          Add Discount
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div>
            <div
              className="relative mr-[20px] ml-5 cursor-pointer mt-1"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-[#fed592] w-4 h-4 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {openCart ? <Cart setOpenCart={setOpenCart} /> : null}
          {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
        </div>
      </div>
    </div>
  );
};

export default Header;
