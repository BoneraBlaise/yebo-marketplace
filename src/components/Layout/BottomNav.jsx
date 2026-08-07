import React, { useState, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import WishlistPanel from "../Layout/overlays/WishlistPanel";
import MobileCategoriesPanel from "../Home/MobileCategoriesPanel";
import useHeaderDropdown from "../Layout/overlays/useHeaderDropdown";
import { buildMobileNavCategories } from "../Home/mainCategoryHierarchy";
import useSiteSearch from "../../hooks/useSiteSearch";
import SiteSearchDropdown from "../Search/SiteSearchDropdown";
import { RxCross1 } from "react-icons/rx";
import { IoGridOutline } from "react-icons/io5";
import { GrHomeRounded } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import UserAvatar from "../Auth/UserAvatar";

const BottomNav = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const wishlistRef = useRef(null);
  const categoriesRef = useRef(null);
  const navigate = useNavigate();
  const marketplaceNavCategories = useMemo(() => buildMobileNavCategories(), []);

  const {
    searchTerm,
    searchData,
    recentSearches,
    trendingSearches,
    showDiscovery,
    suggestionsLoading,
    activeIndex,
    handleSearchChange,
    handleSearchSubmit,
    handleSearchFocus,
    handleSearchKeyDown,
    handleQuerySelect,
    setSearchData,
    clearSearch,
  } = useSiteSearch();

  const closeSearchModal = () => {
    setSearchModalOpen(false);
    clearSearch();
  };

  const openSearchModal = () => {
    setSearchModalOpen(true);
  };

  const onSearchSubmit = (e) => {
    handleSearchSubmit(e);
    closeSearchModal();
  };

  useHeaderDropdown(openWishlist, () => setOpenWishlist(false), wishlistRef);
  useHeaderDropdown(openCategories, () => setOpenCategories(false), categoriesRef);

  const handleCategoryToggle = () => {
    setOpenCategories((prev) => !prev);
  };

  return (
    <div>
      <section
        className="bg-white dark:bg-[#05040e]"
        id="bottom-navigation"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          boxShadow: "0 -2px 4px rgba(104, 104, 104, 0.1)",
          zIndex: 1000,
        }}
      >
        <div
          id="tabs"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Link
            to="/"
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "5px",
              color: "#4B5563",
              textDecoration: "none",
            }}
          >
            <GrHomeRounded className="text-[24px] dark:text-gray-200" />
            <span className="tab block text-xs hover:text-[#29625d] dark:text-gray-200">
              {t("common.home")}
            </span>
          </Link>
          <div
            ref={categoriesRef}
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "5px",
              color: openCategories ? "#0f7c5b" : "#4B5563",
              textDecoration: "none",
              position: "relative",
            }}
            onClick={handleCategoryToggle}
            onKeyDown={(e) => e.key === "Enter" && handleCategoryToggle()}
            role="button"
            tabIndex={0}
            aria-expanded={openCategories}
            aria-haspopup="dialog"
            aria-label="Categories"
          >
            <IoGridOutline className="text-[24px] hover:text-[#29625d] dark:text-gray-200" />
            <span className="tab block text-xs hover:text-[#29625d] dark:text-gray-200">
              {t("categories.all")}
            </span>
          </div>
          <div
            ref={wishlistRef}
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "5px",
              color: "#4B5563",
              textDecoration: "none",
              position: "relative",
            }}
            onClick={() => setOpenWishlist(!openWishlist)}
            onKeyDown={(e) => e.key === "Enter" && setOpenWishlist(!openWishlist)}
            role="button"
            tabIndex={0}
            aria-expanded={openWishlist}
            aria-haspopup="true"
            aria-label="Wishlist"
          >
            <div className="relative flex flex-col items-center">
              <AiOutlineHeart
                size={25}
                className="hover:text-[#29625d] dark:text-gray-200"
              />
              <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fed592] w-4 h-4 text-white font-mono text-[12px] leading-tight text-center">
                {wishlist && wishlist.length}
              </span>
            </div>
            <span className="tab block text-xs hover:text-[#29625d] dark:text-gray-200">
              {t("common.wishlist")}
            </span>
            {openWishlist && (
              <WishlistPanel
                anchor="bottom"
                onClose={() => setOpenWishlist(false)}
              />
            )}
          </div>
          <button
            type="button"
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "5px",
              color: "#4B5563",
              textDecoration: "none",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={openSearchModal}
            aria-label={t("common.search")}
          >
            <AiOutlineSearch
              size={25}
              className="hover:text-[#29625d] dark:text-gray-200"
            />
            <span className="tab block text-xs hover:text-[#29625d] dark:text-gray-200">
              {t("common.search")}
            </span>
          </button>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            style={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              paddingTop: "10px",
              paddingBottom: "5px",
              color: "#4B5563",
              textDecoration: "none",
            }}
          >
            {isAuthenticated ? (
              <UserAvatar
                user={user}
                className="w-[25px] h-[25px] rounded-full object-cover"
                alt="User Avatar"
              />
            ) : (
              <AiOutlineUser
                size={25}
                className="hover:text-[#29625d] dark:text-gray-200"
              />
            )}
            <span className="tab block text-xs hover:text-[#29625d] dark:text-gray-200">
              {t("common.profile")}
            </span>
          </Link>
        </div>
      </section>

      {searchModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={t("common.search")}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 2000,
          }}
          onClick={closeSearchModal}
        >
          <div
            style={{
              position: "relative",
              top: "12%",
              width: "92%",
              margin: "0 auto",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "12px",
              maxHeight: "75%",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <RxCross1
              size={25}
              className="absolute right-4 top-4 cursor-pointer"
              onClick={closeSearchModal}
              aria-label="Close search"
            />
            <h3 className="text-[18px] font-semibold mb-3">{t("common.search")}</h3>
            <form onSubmit={onSearchSubmit}>
              <input
                type="search"
                placeholder="Search products, properties, vehicles, events..."
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onKeyDown={handleSearchKeyDown}
                className="w-full border p-2 rounded-lg"
                autoFocus
                enterKeyHint="search"
              />
            </form>
            <div style={{ position: "relative" }}>
              <SiteSearchDropdown
                searchTerm={searchTerm}
                searchData={searchData}
                recentSearches={recentSearches}
                trendingSearches={trendingSearches}
                showDiscovery={showDiscovery || !searchTerm.trim()}
                isLoading={suggestionsLoading}
                activeIndex={activeIndex}
                onQuerySelect={(query) => {
                  handleQuerySelect(query);
                  closeSearchModal();
                }}
                setSearchData={setSearchData}
                className="home-search-suggest"
              />
            </div>
          </div>
        </div>
      ) : null}


      <MobileCategoriesPanel
        open={openCategories}
        onClose={() => setOpenCategories(false)}
        categoriesData={marketplaceNavCategories}
      />
    </div>
  );
};

export default BottomNav;
