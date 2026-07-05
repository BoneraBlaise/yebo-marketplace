import React, { useState, useEffect } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import Cookies from "js-cookie"; // Import js-cookie
import axios from "axios"; // Import axios
import { server } from "../../../server"; // Server URL
import styles from "../../../styles/styles";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next"; // Import useTranslation hook

const MobileProductCard = ({ data, isEvent }) => {
  const { t } = useTranslation(); // Initialize translation hook
  const { wishlist } = useSelector((state) => state.wishlist);
  const [click, setClick] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  // Function to save product to cookies with only necessary information
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

    // Ensure we don't add duplicate entries for the same product
    const updatedViewed = [productDetails, ...recentlyViewed.filter(item => item._id !== product._id)];

    // Limit to 12 products in the recently viewed list
    const limitedViewed = updatedViewed.slice(0, 12);

    // Save the updated list to cookies, with a 7-day expiration
    Cookies.set("recentlyViewed", JSON.stringify(limitedViewed), { expires: 7 });
  };

  // Handle adding/removing product from wishlist and liking/unliking
  // Handle Wishlist toggle (Add to or remove from wishlist)
  const handleWishlistToggle = async (e) => {
    e.stopPropagation(); // Prevent triggering the card's onClick
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
          toast.info('Removed from wishlist!');
        } else {
          dispatch(addToWishlist(data));
          setClick(true);
          toast.success('Added to wishlist!');
        }
      } else {
        toast.error('Something went wrong!');
      }
    } catch (error) {
      toast.error('Cannot watch this product at the moment!');
      console.error('Error during request:', error);
    }
  };

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle product click (e.g., when user views product details)
  const handleProductClick = () => {
    saveToRecentlyViewed(data); // Save product to cookies
  };

  return (
    <div
      className="w-[150px] h-[210px] bg-white dark:bg-[#2b2b2b] dark:shadow-md dark:border-1 dark:border-[#363535] rounded-lg shadow-md p-2 relative cursor-pointer overflow-hidden"
      onClick={handleProductClick}
    >
      {/* Sold Out badge */}
      {data.stock === 0 && (
        <div className="absolute top-[20px] right-[-35px] transform rotate-45 bg-red-500 text-white py-1 px-10 text-xs font-bold z-[5] shadow-md pointer-events-none">
          {t("product.soldOut")}
        </div>
      )}

      {/* Wishlist button - Only show if product is in stock */}
      {data.stock > 0 && (
        <div className="absolute top-3 right-2 z-[6]">
          <div className="bg-[#646464] hover:bg-[#4a4a4a] rounded-full shadow-md p-2 flex items-center transition-colors duration-200">
            <div className="flex items-center gap-1">
              {click ? (
                <AiFillHeart
                  size={20}
                  className="cursor-pointer"
                  onClick={handleWishlistToggle}
                  color="#fdd69e"
                  title={t("product.removeFromWishlist")}
                />
              ) : (
                <AiOutlineHeart
                  size={20}
                  className="cursor-pointer"
                  onClick={handleWishlistToggle}
                  color="#ffffff"
                  title={t("product.addToWishlist")}
                />
              )}
              <span className="text-xs text-white min-w-[16px] text-center">
                {data.likes?.length || 0}
              </span>
            </div>
          </div>
        </div>
      )}

      <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
        <div className="relative">
          <img
            src={`${data.images && data.images[0]?.url}`}
            alt={data.name}
            className={`w-full h-[140px] object-cover bg-gray-100 dark:bg-[#2b2b2b] rounded-md ${
              data.stock === 0 ? 'opacity-50' : ''
            }`}
          />
        </div>
      </Link>

      <Link to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
        <div className="mt-2">
          <span className="block font-medium text-gray-500 dark:text-gray-200 text-sm line-clamp-1">
            {data.name.length > 10 ? data.name.slice(0, 10) + "..." : data.name}
          </span>

          <div className="mt-1 flex items-center justify-between">
            <span className={`text-xs text-red-300 dark:text-white dark:bg-[#29625d] dark:px-2 dark:py-1 dark:rounded-full dark:font-bold`}>
              RWF {data.originalPrice === 0 ? formatPrice(data.originalPrice) : formatPrice(data.discountPrice)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MobileProductCard;
