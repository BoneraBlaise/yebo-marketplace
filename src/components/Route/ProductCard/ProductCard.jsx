import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { Link } from "react-router-dom";
import Cookies from "js-cookie"; // Import js-cookie
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import MobileProductCard from "./MobileProductCard";
import axios from "axios"; // Import axios
import { server } from "../../../server"; // Server URL

const ProductCard = ({ data, isEvent }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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
    };

    const recentlyViewed = Cookies.get("recentlyViewed") ? JSON.parse(Cookies.get("recentlyViewed")) : [];
    // Ensure we don't add duplicate entries for the same product
    const updatedViewed = [productDetails, ...recentlyViewed.filter(item => item._id !== product._id)];
    // Limit to 12 products in the recently viewed list
    const limitedViewed = updatedViewed.slice(0, 12);

    // Save the updated list to cookies, with a 7-day expiration
    Cookies.set("recentlyViewed", JSON.stringify(limitedViewed), { expires: 7 });
  };

  // Handle adding/removing product from wishlist and liking/unliking
  const handleWishlistToggle = async () => {
    try {
      const actionType = click ? "remove" : "add";
      const response = await axios.put(
        `${server}/product/like-product`,
        { productId: data._id, action: actionType }, // Sending the action type (add/remove)
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
        setClick(!click); // Toggle the state
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Can not watch this product at the moment!");
      console.error("Error during request:", error); // Log error for debugging
    }
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
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

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Handle product click (e.g., when user views product details)
  const handleProductClick = () => {
    saveToRecentlyViewed(data); // Save product to cookies
  };

  if (isMobile) {
    return <MobileProductCard data={data} isEvent={isEvent} />;
  }

  return (
    <div
      className="bg-white dark:bg-[#2b2b2b] w-[260px] h-[410px] rounded-lg shadow-lg p-3 relative cursor-pointer hover:shadow-gray-300 dark:hover:shadow-black overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleProductClick}
    >
      {data.stock === 0 && (
        <div className="absolute top-[30px] right-[-45px] transform rotate-45 bg-red-500 text-white py-1 px-12 text-sm font-bold z-50 shadow-md">
          Sold Out
        </div>
      )}

      <Link
        to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
      >
        <img
          src={`${data.images && data.images[0]?.url}`}
          alt="Product"
          className={`w-full h-[310px] object-cover transition-transform duration-300 ease-in-out hover:scale-105 ${
            data.stock === 0 ? 'opacity-50' : ''
          }`}
          style={{ backgroundColor: '#f1f1f1' }}
          onClick={handleProductClick}
        />
      </Link>

      <div className="mt-3">
        <Link
          to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
        >
          <h4 className="font-[500] text-[14px] dark:text-gray-200" onClick={handleProductClick}>
            {data.name.length > 40 ? data.name.slice(0, 40) + "..." : data.name}
          </h4>
          <div className="py-1 flex items-center justify-between">
            <div className="flex">
              <h6 className="text-[16px] font-[600] dark:text-[#29625d] dark:font-bold">
                RWF {formatPrice(data.originalPrice === 0 ? data.originalPrice : data.discountPrice)}
              </h6>
            </div>
            {data?.sold_out < 1 ? (
              <span className="font-[400] text-[13px] text-[#c04802]">
                {data?.sold_out} sold
              </span>
            ) : (
              <span className="font-[400] text-[13px] text-[#68d284]">
                {data?.sold_out} sold
              </span>
            )}
          </div>
        </Link>
      </div>

      {isHovered && (
        <div className="bg-[#29625d] shadow-md absolute bottom-[80px] left-0 w-full p-2 flex justify-around items-center opacity-80">
          {click ? (
            <AiFillHeart
              size={30}
              className="cursor-pointer text-xl bg-white p-1 rounded-full"
              onClick={handleWishlistToggle} // Toggle wishlist and like/unlike
              color="red"
              title="Remove from wishlist"
            />
          ) : (
            <AiOutlineHeart
              size={30}
              className="cursor-pointer text-xl bg-white p-1 rounded-full"
              onClick={handleWishlistToggle} // Toggle wishlist and like/unlike
              color="black"
              title="Add to wishlist"
            />
          )}

          <AiOutlineShoppingCart
            size={30}
            className="cursor-pointer text-xl bg-white p-1 rounded-full"
            onClick={() => addToCartHandler(data._id)}
            color="black"
            title="Add to cart"
          />
        </div>
      )}
    </div>
  );
};

export default ProductCard;
