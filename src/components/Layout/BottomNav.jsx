import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineSearch, AiOutlineHeart, AiOutlineUser } from "react-icons/ai";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";
import { categoriesData } from "../../static/data";
import { IoGridOutline } from "react-icons/io5";
import { GrHomeRounded } from "react-icons/gr";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BottomNav = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { allProducts } = useSelector((state) => state.products);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCategories, setOpenCategories] = useState(false);
  const navigate = useNavigate();
  const handleSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filteredProducts = allProducts.filter(
      (product) =>
        product.name.toLowerCase().includes(term) ||
        (product.shop && product.shop.name.toLowerCase().includes(term)) ||
        product.category.toLowerCase().includes(term)
    );

    setSearchData(filteredProducts);
  };

  const handleCategoryClick = (category) => {
    setOpenCategories(false);
    navigate(`/products?category=${category.title}`);
  };

  const handleCategoryToggle = () => {
    setOpenCategories(!openCategories);
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
            }}
            onClick={handleCategoryToggle}
          >
            <IoGridOutline className="text-[24px] hover:text-[#29625d] dark:text-gray-200" />
            <span className="tab block text-xs hover:text-[#29625d] dark:text-gray-200">
              {t("categories.all")}
            </span>
          </div>
          <div
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
            onClick={() => setOpenWishlist(true)}
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
          </div>
          <div
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
            onClick={() =>
              (document.getElementById("searchModal").style.display = "block")
            }
          >
            <AiOutlineSearch
              size={25}
              className="hover:text-[#29625d] dark:text-gray-200"
            />
            <span className="tab block text-xs hover:text-[#29625d] dark:text-gray-200">
              {t("common.search")}
            </span>
          </div>
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
              <img
                src={user?.avatar?.url}
                className="w-[25px] h-[25px] rounded-full"
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

      {/* Search Modal */}
      <div
        id="searchModal"
        style={{
          display: "none",
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 2000,
        }}
        onClick={() =>
          (document.getElementById("searchModal").style.display = "none")
        }
      >
        <div
          style={{
            position: "relative",
            top: "20%",
            width: "90%",
            margin: "0 auto",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "10px",
            maxHeight: "60%",
            overflowY: "auto",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <RxCross1
            size={25}
            className="absolute right-4 top-4 cursor-pointer"
            onClick={() =>
              (document.getElementById("searchModal").style.display = "none")
            }
          />
          <h3 className="text-[18px] font-semibold mb-3">{t("common.search")}</h3>
          <input
            type="text"
            placeholder={t("common.search") + "..."}
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full border p-2 rounded-lg"
          />
          {searchData && searchData.length > 0 ? (
            <div className="mt-4">
              {searchData.map((i, index) => (
                <Link
                  to={`/product/${i._id}`}
                  key={index}
                  onClick={() =>
                    (document.getElementById("searchModal").style.display =
                      "none")
                  }
                >
                  <div className="flex items-center py-3 border-b">
                    <img
                      src={`${i.images[0]?.url}`}
                      alt={i.name}
                      className="w-[40px] h-[40px] mr-[10px]"
                    />
                    <div>
                      <h5 className="text-[16px]">{i.name}</h5>
                      <p className="text-[14px] text-gray-500">{i.category}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            searchTerm && (
              <div className="mt-4 text-center py-3">
                <p>{t("common.noResults")}</p>
              </div>
            )
          )}
        </div>
      </div>

      {/* Categories Modal */}
      {openCategories && (
        <div
          style={{
            position: "fixed",
            bottom: "60px",
            left: 0,
            width: "100%",
            backgroundColor: "white",
            zIndex: 1000,
            maxHeight: "70vh",
            overflowY: "auto",
            boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
            borderTopLeftRadius: "15px",
            borderTopRightRadius: "15px",
          }}
        >
          <div className="flex justify-between items-center px-4 py-3 border-b">
            <h3 className="text-lg font-semibold">{t("categories.all")}</h3>
            <RxCross1
              size={18}
              className="cursor-pointer"
              onClick={() => setOpenCategories(false)}
            />
          </div>
          <div className="grid grid-cols-3 gap-4 p-4">
            {categoriesData.map((category) => (
              <div
                key={category.id}
                className="flex flex-col items-center p-2 rounded-lg shadow-sm border cursor-pointer hover:bg-gray-50"
                onClick={() => handleCategoryClick(category)}
              >
                <img
                  src={category.image_Url}
                  alt={category.title}
                  className="w-[60px] h-[60px] object-contain"
                />
                <p className="text-xs mt-2 text-center">{t(`categories.${category.title.toLowerCase().replace('&', '').trim()}`)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {openWishlist ? <Wishlist setOpenWishlist={setOpenWishlist} /> : null}
    </div>
  );
};

export default BottomNav;
