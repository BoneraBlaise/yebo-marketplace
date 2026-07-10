import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import Cookies from "js-cookie";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import ProductCardReviews from "./ProductCardReviews";
import "./productCard.css";

const MobileProductCard = ({ data, isEvent }) => {
  const { t } = useTranslation();
  const { wishlist } = useSelector((state) => state.wishlist);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data._id]);

  const saveToRecentlyViewed = (product) => {
    const productDetails = {
      _id: product._id,
      name: product.name,
      image: product.images[0]?.url,
      price: product.discountPrice,
      category: product.category,
    };

    const recentlyViewed = Cookies.get("recentlyViewed")
      ? JSON.parse(Cookies.get("recentlyViewed"))
      : [];

    const updatedViewed = [
      productDetails,
      ...recentlyViewed.filter((item) => item._id !== product._id),
    ];
    const limitedViewed = updatedViewed.slice(0, 12);
    Cookies.set("recentlyViewed", JSON.stringify(limitedViewed), { expires: 7 });
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await axios.put(
        `${server}/product/like-product`,
        { productId: data._id },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (click) {
          dispatch(removeFromWishlist(data));
          setClick(false);
          toast.info("Removed from wishlist!");
        } else {
          dispatch(addToWishlist(data));
          setClick(true);
          toast.success("Added to wishlist!");
        }
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Cannot watch this product at the moment!");
      console.error("Error during request:", error);
    }
  };

  const formatPrice = (price) =>
    (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleProductClick = () => {
    saveToRecentlyViewed(data);
  };

  const productUrl =
    isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`;
  const price = data.discountPrice || data.originalPrice;
  const hasDiscount =
    data.originalPrice > 0 &&
    data.discountPrice > 0 &&
    data.originalPrice > data.discountPrice;
  const soldCount = data.sold_out ?? 0;
  const isVerified = data.shop?.isVerified;
  const rating = data.ratings || 0;
  const reviewCount = data.reviews?.length || 0;

  return (
    <article className="ypc ypc--fluid" onClick={handleProductClick}>
      <div className="ypc__media">
        <Link
          to={productUrl}
          className="ypc__media-link"
          onClick={handleProductClick}
        >
          <img
            src={data.images && data.images[0]?.url}
            alt={data.name || "Yebone product"}
            className={`ypc__img${data.stock === 0 ? " ypc__img--dimmed" : ""}`}
            loading="lazy"
          />
        </Link>

        {data.stock === 0 && (
          <span className="ypc__sold-out">{t("product.soldOut")}</span>
        )}

        {data.stock > 0 && (
          <button
            type="button"
            className={`ypc__wishlist${click ? " ypc__wishlist--active" : ""}`}
            onClick={handleWishlistToggle}
            aria-label={click ? t("product.removeFromWishlist") : t("product.addToWishlist")}
          >
            {click ? <AiFillHeart size={17} /> : <AiOutlineHeart size={17} />}
          </button>
        )}
      </div>

      <div className="ypc__body">
        {isVerified && (
          <p className="ypc__verified">
            <MdVerified className="ypc__verified-icon" size={13} aria-hidden="true" />
            Verified Seller
          </p>
        )}

        <Link to={productUrl} className="ypc__title-link" onClick={handleProductClick}>
          <h3 className="ypc__title">{data.name}</h3>
        </Link>

        <ProductCardReviews rating={rating} reviewCount={reviewCount} />

        <div className="ypc__pricing">
          <p className="ypc__price">RWF {formatPrice(price)}</p>
          {hasDiscount && (
            <p className="ypc__price-old">RWF {formatPrice(data.originalPrice)}</p>
          )}
        </div>

        <p className="ypc__sold">{soldCount} sold</p>
      </div>
    </article>
  );
};

export default MobileProductCard;
