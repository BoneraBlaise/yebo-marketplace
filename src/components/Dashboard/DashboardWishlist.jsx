import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { HiOutlineHeart } from "react-icons/hi";
import { addTocart } from "../../redux/actions/cart";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import HomeProductCard from "../Home/HomeProductCard";
import DashboardEmptyState from "./DashboardEmptyState";

const DashboardWishlist = () => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  if (!wishlist?.length) {
    return (
      <DashboardEmptyState
        icon={HiOutlineHeart}
        title="Your wishlist is empty"
        message="Save products you love and come back to them anytime."
        actionLabel="Discover products"
        actionTo="/products"
      />
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        {wishlist.length} saved item{wishlist.length === 1 ? "" : "s"}
      </p>
      <div className="marketplace-product-grid">
        {wishlist.map((item) => (
          <div key={item._id} className="relative flex justify-center">
            <HomeProductCard data={item} compact />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 w-[calc(100%-2rem)] max-w-[200px]">
              <button
                type="button"
                className="flex-1 text-xs py-1.5 rounded-lg bg-yebone-primary text-white font-semibold yebone-btn-lift"
                onClick={() => {
                  dispatch(addTocart({ ...item, qty: 1 }));
                  toast.success("Added to cart!");
                }}
              >
                Add to cart
              </button>
              <button
                type="button"
                className="px-2 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs"
                onClick={() => {
                  dispatch(removeFromWishlist(item));
                  toast.info("Removed from wishlist");
                }}
                aria-label="Remove"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardWishlist;
