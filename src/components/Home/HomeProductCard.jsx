import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  AiFillHeart,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import Cookies from "js-cookie";
import axios from "axios";
import { server } from "../../server";
import { addToWishlist, removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import ProductCardReviews from "../Route/ProductCard/ProductCardReviews";
import "../Route/ProductCard/productCard.css";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const HomeProductCard = ({ data, isEvent, compact = false, fluid = false }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [inWishlist, setInWishlist] = useState(false);
  const dispatch = useDispatch();

  const productUrl = isEvent
    ? `/product/${data._id}?isEvent=true`
    : `/product/${data._id}`;

  useEffect(() => {
    setInWishlist(Boolean(wishlist?.find((i) => i._id === data._id)));
  }, [wishlist, data._id]);

  const saveToRecentlyViewed = () => {
    const productDetails = {
      _id: data._id,
      name: data.name,
      image: data.images?.[0]?.url,
      price: data.discountPrice,
    };
    const recentlyViewed = Cookies.get("recentlyViewed")
      ? JSON.parse(Cookies.get("recentlyViewed"))
      : [];
    const updated = [
      productDetails,
      ...recentlyViewed.filter((item) => item._id !== data._id),
    ].slice(0, 12);
    Cookies.set("recentlyViewed", JSON.stringify(updated), { expires: 7 });
  };

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const actionType = inWishlist ? "remove" : "add";
      const response = await axios.put(
        `${server}/product/like-product`,
        { productId: data._id, action: actionType },
        { withCredentials: true }
      );
      if (response.data.success) {
        if (inWishlist) {
          dispatch(removeFromWishlist(data));
          toast.info("Removed from wishlist!");
        } else {
          dispatch(addToWishlist(data));
          toast.success("Added to wishlist!");
        }
      }
    } catch {
      toast.error("Cannot update wishlist at the moment!");
    }
  };

  const addToCartHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.find((i) => i._id === data._id)) {
      toast.error("Item already in cart!");
      return;
    }
    if (data.stock < 1) {
      toast.error("Product stock limited!");
      return;
    }
    dispatch(addTocart({ ...data, qty: 1 }));
    toast.success("Item added to cart successfully!");
  };

  const price = data.discountPrice || data.originalPrice;
  const hasDiscount =
    data.originalPrice > 0 &&
    data.discountPrice > 0 &&
    data.originalPrice > data.discountPrice;
  const soldCount = data.sold_out ?? 0;
  const isVerified = data.shop?.isVerified;
  const rating = data.ratings || 0;
  const reviewCount = data.reviews?.length || 0;

  const sizeClass = fluid ? "ypc--fluid" : compact ? "ypc--compact" : "ypc--fixed";

  return (
    <article
      className={`ypc home-card-lift group ${sizeClass}`}
      onClick={saveToRecentlyViewed}
    >
      <div className="ypc__media">
        <Link to={productUrl} className="ypc__media-link" onClick={saveToRecentlyViewed}>
          <img
            src={data.images?.[0]?.url}
            alt={data.name || "Yebone product"}
            className={`ypc__img${data.stock === 0 ? " ypc__img--dimmed" : ""}`}
            loading="lazy"
          />
        </Link>

        {data.stock === 0 && (
          <span className="ypc__sold-out">Sold out</span>
        )}

        {(data.growthCommerce?.promotionBadges || []).slice(0, 1).map((badge) => (
          <span
            key={badge}
            className="absolute top-2 left-2 z-[2] px-2 py-1 rounded-md text-[10px] font-semibold bg-red-500 text-white"
          >
            {badge}
          </span>
        ))}

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className={`ypc__wishlist${inWishlist ? " ypc__wishlist--active" : ""}`}
        >
          {inWishlist ? <AiFillHeart size={17} /> : <AiOutlineHeart size={17} />}
        </button>

        <div className="ypc__actions">
          <button
            type="button"
            onClick={addToCartHandler}
            className="ypc__action-btn ypc__action-btn--primary"
          >
            <AiOutlineShoppingCart size={15} />
            Add to Cart
          </button>
          <Link
            to={productUrl}
            onClick={saveToRecentlyViewed}
            className="ypc__action-btn ypc__action-btn--secondary"
          >
            <AiOutlineEye size={15} />
            Quick View
          </Link>
        </div>
      </div>

      <div className="ypc__body">
        {isVerified && (
          <p className="ypc__verified">
            <MdVerified className="ypc__verified-icon" size={13} aria-hidden="true" />
            Verified Seller
          </p>
        )}

        <Link to={productUrl} className="ypc__title-link" onClick={saveToRecentlyViewed}>
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

export default HomeProductCard;
