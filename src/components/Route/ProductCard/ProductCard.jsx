import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import MobileProductCard from "./MobileProductCard";
import axios from "axios";
import { server } from "../../../server";
import ProductCardShell from "../../ui/ProductCardShell";

const ProductCard = ({ data, isEvent }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
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
    };

    const recentlyViewed = Cookies.get("recentlyViewed") ? JSON.parse(Cookies.get("recentlyViewed")) : [];
    const updatedViewed = [productDetails, ...recentlyViewed.filter((item) => item._id !== product._id)];
    const limitedViewed = updatedViewed.slice(0, 12);

    Cookies.set("recentlyViewed", JSON.stringify(limitedViewed), { expires: 7 });
  };

  const handleWishlistToggle = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    try {
      const actionType = click ? "remove" : "add";
      const response = await axios.put(
        `${server}/product/like-product`,
        { productId: data._id, action: actionType },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (click) {
          dispatch(removeFromWishlist(data));
          toast.info("Removed from wishlist!");
        } else {
          dispatch(addToWishlist(data));
          toast.success("Added to wishlist!");
        }
        setClick(!click);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Can not watch this product at the moment!");
      console.error("Error during request:", error);
    }
  };

  const addToCartHandler = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Item already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("Product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  const formatPrice = (price) => price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleProductClick = () => {
    saveToRecentlyViewed(data);
  };

  const productUrl = isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`;
  const price = data.discountPrice || data.originalPrice;
  const hasDiscount =
    data.originalPrice > 0 &&
    data.discountPrice > 0 &&
    data.originalPrice > data.discountPrice;
  const soldCount = data?.sold_out ?? 0;

  if (isMobile) {
    return <MobileProductCard data={data} isEvent={isEvent} />;
  }

  return (
    <ProductCardShell
      className="w-full max-w-[280px]"
      onClick={handleProductClick}
    >
      <div className="yebone-product-card__media">
        <Link to={productUrl} className="block w-full h-full" onClick={handleProductClick}>
          <img
            src={data.images && data.images[0]?.url}
            alt={data.name || "Product"}
            className={data.stock === 0 ? "opacity-60" : ""}
            loading="lazy"
          />
        </Link>

        {data.stock === 0 && (
          <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-gray-900/80 text-white text-[10px] font-semibold">
            Sold out
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 dark:bg-gray-900/95 shadow-md flex items-center justify-center hover:scale-110 active:scale-95 transition-transform duration-200"
        >
          {click ? (
            <AiFillHeart className="text-red-500" size={18} />
          ) : (
            <AiOutlineHeart className="text-gray-700 dark:text-gray-200" size={18} />
          )}
        </button>

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
            onClick={handleProductClick}
            className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-white/95 text-yebone-dark-text text-xs font-semibold hover:bg-white active:scale-[0.98] transition-all duration-200"
          >
            <AiOutlineEye size={16} />
            View
          </Link>
        </div>
      </div>

      <div className="yebone-product-card__body">
        <Link to={productUrl} onClick={handleProductClick}>
          <h4 className="yebone-card-title text-yebone-dark-text dark:text-white line-clamp-2 leading-snug group-hover:text-yebone-primary transition-colors">
            {data.name.length > 48 ? `${data.name.slice(0, 48)}…` : data.name}
          </h4>
        </Link>

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
          <span
            className={`text-[11px] font-medium ${
              soldCount < 1 ? "text-orange-600" : "text-emerald-600 dark:text-emerald-400"
            }`}
          >
            {soldCount} sold
          </span>
        </div>
      </div>
    </ProductCardShell>
  );
};

export default ProductCard;
