import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { addTocart } from "../../redux/actions/cart";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const formatTimeLeft = (endTime) => {
  const diff = new Date(endTime) - new Date();
  if (Number.isNaN(diff) || diff <= 0) return "Ended";
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  if (hours > 24) return `${Math.floor(hours / 24)}d left`;
  return `${hours}h ${minutes}m`;
};

const HomeFlashSaleCard = ({ data }) => {
  const [timeLeft, setTimeLeft] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const update = () => setTimeLeft(formatTimeLeft(data.endTime));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [data.endTime]);

  const addToCartHandler = (e) => {
    e.preventDefault();
    if (data.stockAvailable < 1) {
      toast.error("Product stock limited!");
      return;
    }
    dispatch(addTocart({ ...data, qty: 1 }));
    toast.success("Item added to cart successfully!");
  };

  const hasDiscount =
    data.originalPrice > 0 && data.flashSalePrice < data.originalPrice;

  return (
    <article className="home-card-lift group w-[260px] sm:w-[280px] flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100/90 dark:border-gray-800 overflow-hidden shadow-sm">
      <div className="relative aspect-[4/5] overflow-hidden bg-yebone-light-gray">
        <Link to={`/product/${data._id}`}>
          <img
            src={data.images?.[0]?.url}
            alt={data.name || "Yebone flash sale"}
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out home-img-fade"
            loading="lazy"
          />
        </Link>
        <span className="absolute top-3 left-3 px-2 py-0.5 rounded-lg bg-red-500 text-white text-[10px] font-bold uppercase">
          Flash Sale
        </span>
        <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-black/70 text-white text-[10px] font-semibold">
          {timeLeft}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link to={`/product/${data._id}`}>
          <h3 className="font-Poppins font-medium text-sm line-clamp-2 dark:text-white group-hover:text-yebone-primary transition">
            {data.name}
          </h3>
        </Link>
        <div className="flex items-baseline gap-2">
          <p className="font-bold text-yebone-primary">
            RWF {formatPrice(data.flashSalePrice)}
          </p>
          {hasDiscount && (
            <p className="text-xs text-gray-400 line-through">
              RWF {formatPrice(data.originalPrice)}
            </p>
          )}
        </div>
        <p className="text-[11px] text-gray-500">
          {data.stockAvailable} available
        </p>
        <button
          type="button"
          onClick={addToCartHandler}
          className="mt-auto w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-yebone-primary text-white text-sm font-semibold hover:bg-yebone-primary-dark transition"
        >
          <AiOutlineShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </article>
  );
};

export default HomeFlashSaleCard;
