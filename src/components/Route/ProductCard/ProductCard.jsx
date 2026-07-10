import React, { useState, useEffect } from "react";
import { useMediaQuery } from "react-responsive";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart, AiOutlineShoppingCart, AiOutlineEye } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import MobileProductCard from "./MobileProductCard";
import axios from "axios";
import { server } from "../../../server";
import ProductCardShell from "../../ui/ProductCardShell";
import ProductCardReviews from "./ProductCardReviews";
import "./productCard.css";

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
  const isVerified = data.shop?.isVerified;
  const rating = data.ratings || 0;
  const reviewCount = data.reviews?.length || 0;

  if (isMobile) {
    return <MobileProductCard data={data} isEvent={isEvent} />;
  }

  return (
    <ProductCardShell
      className="ypc--fixed w-full max-w-[280px]"
      onClick={handleProductClick}
    >
      <div className="ypc__media">
        <Link to={productUrl} className="ypc__media-link" onClick={handleProductClick}>
          <img
            src={data.images && data.images[0]?.url}
            alt={data.name || "Product"}
            className={`ypc__img${data.stock === 0 ? " ypc__img--dimmed" : ""}`}
            loading="lazy"
          />
        </Link>

        {data.stock === 0 && (
          <span className="ypc__sold-out">Sold out</span>
        )}

        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
          className={`ypc__wishlist${click ? " ypc__wishlist--active" : ""}`}
        >
          {click ? <AiFillHeart size={17} /> : <AiOutlineHeart size={17} />}
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
            onClick={handleProductClick}
            className="ypc__action-btn ypc__action-btn--secondary"
          >
            <AiOutlineEye size={15} />
            View
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
    </ProductCardShell>
  );
};

export default ProductCard;
