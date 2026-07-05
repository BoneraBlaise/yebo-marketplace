import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";
import { useMediaQuery } from "react-responsive";
import MobileFlashSaleList from "./MobileFlashSaleList";
import { server } from "../../../server";
import axios from "axios";
import { Button } from "../../ui";

const FlashSaleList = ({ flashSales }) => {
  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const navigate = useNavigate();
  const isMobile = useMediaQuery({ query: "(max-width: 900px)" });

  const formatPrice = (price) =>
    price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  const handleWishlistToggle = async (flashSale) => {
    const isInWishlist = wishlist.some((item) => item._id === flashSale._id);

    try {
      const response = await axios.put(
        `${server}/flashsale/like-flashsale`,
        { flashSaleId: flashSale._id },
        { withCredentials: true }
      );

      if (response.data.success) {
        if (isInWishlist) {
          dispatch(removeFromWishlist(flashSale));
          toast.info("Removed from wishlist!");
        } else {
          dispatch(addToWishlist(flashSale));
          toast.success("Added to wishlist!");
        }
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Can not watch this product at the moment!");
      console.error("Error during request:", error);
    }
  };

  const handleMakeOffer = (flashSaleId) => {
    navigate(`/flashsale/${flashSaleId}`);
  };

  if (isMobile) {
    return <MobileFlashSaleList flashSales={flashSales} />;
  }

  return (
    <div className="marketplace-product-grid w-full">
      {flashSales.length === 0 ? (
        <div className="col-span-full text-center text-gray-500">No flash sales available!</div>
      ) : (
        flashSales.map((flashSale) => {
          const isInWishlist = wishlist.some((item) => item._id === flashSale._id);
          const isNew =
            new Date() - new Date(flashSale.createdAt) < 24 * 60 * 60 * 1000;
          const stockTotal = flashSale.stock || flashSale.quantity || 100;
          const stockLeft = flashSale.stockAvailable ?? flashSale.stock ?? 0;
          const progress = Math.min(
            100,
            Math.max(0, ((stockTotal - stockLeft) / stockTotal) * 100)
          );

          return (
            <article
              key={flashSale._id}
              className="yebone-card-lift group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-yebone-light-gray">
                {isNew && (
                  <span className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-lg bg-green-500 text-white text-[10px] font-bold uppercase">
                    New
                  </span>
                )}
                <span className="absolute top-3 right-3 z-10 px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase">
                  {flashSale.discountPercentage}% OFF
                </span>
                <Link to={`/flashsale/${flashSale._id}`}>
                  <img
                    src={flashSale.images[0]?.url}
                    alt={flashSale.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out yebone-img-fade"
                  />
                </Link>
              </div>

              <div className="p-4 flex flex-col flex-1 gap-2">
                <Link to={`/flashsale/${flashSale._id}`}>
                  <h2 className="font-Poppins font-medium text-sm line-clamp-2 dark:text-white group-hover:text-yebone-primary transition">
                    {flashSale.name}
                  </h2>
                </Link>

                <div className="flex items-baseline gap-2">
                  <p className="font-bold text-yebone-primary">
                    RWF{" "}
                    {formatPrice(
                      flashSale.flashSalePrice
                        ? flashSale.flashSalePrice
                        : flashSale.originalPrice
                    )}
                  </p>
                  {flashSale.originalPrice > flashSale.flashSalePrice && (
                    <p className="text-xs text-gray-400 line-through">
                      RWF {formatPrice(flashSale.originalPrice)}
                    </p>
                  )}
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                    <span>Limited stock</span>
                    <span className="text-red-500 font-semibold">{stockLeft} left</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-red-500 to-yebone-gold transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-auto pt-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm"
                    onClick={() => handleWishlistToggle(flashSale)}
                    aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    {isInWishlist ? (
                      <AiFillHeart color="#ffd496" size={18} />
                    ) : (
                      <AiOutlineHeart size={18} />
                    )}
                    <span className="text-green-700 dark:text-green-500 text-xs">
                      {flashSale.likes?.length || 0}
                    </span>
                  </button>
                  <Button
                    size="sm"
                    className="flex-1 yebone-btn-lift"
                    onClick={() => handleMakeOffer(flashSale._id)}
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </article>
          );
        })
      )}
    </div>
  );
};

export default FlashSaleList;
