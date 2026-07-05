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

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const HomeProductCard = ({ data, isEvent, compact = false }) => {
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
  const discountPct = hasDiscount
    ? Math.round(
        ((data.originalPrice - data.discountPrice) / data.originalPrice) * 100
      )
    : 0;
  const soldCount = data.sold_out ?? 0;
  const isVerified = data.shop?.isVerified;
  const rating = data.ratings || 0;
  const reviewCount = data.reviews?.length || 0;
  const showRating = reviewCount > 0 && rating > 0;

  return (
    <article
      className={`home-card-lift group relative flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/90 dark:border-gray-800 overflow-hidden shadow-sm ${
        compact ? "w-[160px] sm:w-[200px]" : "w-[260px] sm:w-[280px]"
      }`}
      onClick={saveToRecentlyViewed}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-yebone-light-gray dark:bg-gray-800">
        <Link to={productUrl} className="block w-full h-full">
          <img
            src={data.images?.[0]?.url}
            alt={data.name || "Yebone product"}
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] home-img-fade ${
              data.stock === 0 ? "opacity-60" : ""
            }`}
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase tracking-wide">
              -{discountPct}%
            </span>
          )}
          {data.featured && (
            <span className="px-2 py-0.5 rounded-lg bg-yebone-gold text-yebone-dark-text text-[10px] font-bold">
              Featured
            </span>
          )}
        </div>

        {data.stock === 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-gray-900/80 text-white text-[10px] font-semibold">
            Sold out
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 dark:bg-gray-900/95 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          {inWishlist ? (
            <AiFillHeart className="text-red-500" size={18} />
          ) : (
            <AiOutlineHeart className="text-gray-700 dark:text-gray-200" size={18} />
          )}
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-0 bottom-0 p-3 flex gap-2 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out bg-gradient-to-t from-black/75 to-transparent pt-12">
          <button
            type="button"
            onClick={addToCartHandler}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-yebone-primary text-white text-xs font-semibold hover:bg-yebone-primary-dark active:scale-[0.98] transition-all duration-200"
          >
            <AiOutlineShoppingCart size={16} />
            Add to Cart
          </button>
          <Link
            to={productUrl}
            onClick={saveToRecentlyViewed}
            className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-white/95 text-yebone-dark-text text-xs font-semibold hover:bg-white active:scale-[0.98] transition-all duration-200"
          >
            <AiOutlineEye size={16} />
            Quick View
          </Link>
        </div>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 gap-2.5">
        {isVerified && (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-yebone-primary uppercase tracking-wide">
            <MdVerified size={14} />
            Verified seller
          </span>
        )}

        <Link to={productUrl}>
          <h3 className="font-Poppins font-medium text-sm text-yebone-dark-text dark:text-white line-clamp-2 leading-snug group-hover:text-yebone-primary transition">
            {data.name}
          </h3>
        </Link>

        {showRating ? (
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className={`text-xs leading-none ${
                    i <= Math.round(rating)
                      ? "text-yebone-gold"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-[10px] text-gray-400">({reviewCount})</span>
          </div>
        ) : (
          <p className="text-[11px] text-gray-400 italic">No reviews yet</p>
        )}

        <div className="flex items-end justify-between mt-auto pt-1">
          <div>
            <p className="font-Poppins font-bold text-yebone-primary text-base">
              RWF {formatPrice(price)}
            </p>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">
                RWF {formatPrice(data.originalPrice)}
              </p>
            )}
          </div>
          <span className="text-[11px] text-gray-500 dark:text-gray-400">
            {soldCount} sold
          </span>
        </div>
      </div>
    </article>
  );
};

export default HomeProductCard;
