import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineHeart } from "react-icons/ai";
import { HiOutlineMinus, HiPlus, HiOutlineTrash } from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { addToWishlist } from "../../redux/actions/wishlist";
import { Badge } from "../ui";
import { typography } from "../../design-system/typography";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CheckoutCartItem = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  compact = false,
  showMoveToWishlist = true,
  hasReferral = false,
}) => {
  const [value, setValue] = useState(data.qty || 1);
  const dispatch = useDispatch();
  const lineTotal = data.discountPrice * value;
  const hasDiscount =
    data.originalPrice > 0 &&
    data.discountPrice > 0 &&
    data.originalPrice > data.discountPrice;
  const inStock = data.stock > 0;

  const increment = () => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      const next = value + 1;
      setValue(next);
      quantityChangeHandler({ ...data, qty: next });
    }
  };

  const decrement = () => {
    const next = value === 1 ? 1 : value - 1;
    setValue(next);
    quantityChangeHandler({ ...data, qty: next });
  };

  const moveToWishlist = () => {
    dispatch(addToWishlist(data));
    removeFromCartHandler(data);
    toast.success("Moved to wishlist");
  };

  return (
    <article
      className={`yebone-card-lift yebone-surface rounded-2xl p-4 ${
        compact ? "border-b border-gray-100 dark:border-gray-800 rounded-none yebone-surface" : ""
      }`}
    >
      <div className="flex gap-4">
        <Link
          to={`/product/${data._id}`}
          className={`shrink-0 rounded-xl overflow-hidden bg-white dark:bg-gray-900 shadow-md ${
            compact ? "w-20 h-20" : "w-28 h-28 lg:w-32 lg:h-32"
          }`}
        >
          <img
            src={data?.images?.[0]?.url}
            alt={data.name}
            className="w-full h-full object-cover yebone-img-fade"
          />
        </Link>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              {data.brand && (
                <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-0.5">
                  {data.brand}
                </p>
              )}
              <Link to={`/product/${data._id}`}>
                <h3 className={`${typography.subheading} text-sm line-clamp-2 hover:text-yebone-primary transition`}>
                  {data.name}
                </h3>
              </Link>
              {data.shop?.name && (
                <p className="text-xs text-gray-500 mt-1 truncate">
                  Sold by {data.shop.name}
                  {data.shop?.isVerified && (
                    <MdVerified className="inline ml-1 text-yebone-primary" size={12} />
                  )}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {data.color && <Badge variant="muted">{data.color}</Badge>}
                {data.size && <Badge variant="muted">{data.size}</Badge>}
                {!inStock && <Badge variant="outline">Out of stock</Badge>}
                {hasReferral && (
                  <Badge variant="gold">Referred</Badge>
                )}
              </div>
            </div>
            {!compact && (
              <button
                type="button"
                onClick={() => removeFromCartHandler(data)}
                className="shrink-0 p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition yebone-btn-lift"
                aria-label="Remove item"
              >
                <HiOutlineTrash size={18} />
              </button>
            )}
          </div>

          <div className="flex items-end justify-between mt-auto pt-3 gap-3">
            <div className="flex items-center rounded-xl border-2 border-gray-200/80 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900">
              <button
                type="button"
                onClick={decrement}
                className="w-9 h-9 flex items-center justify-center hover:bg-yebone-light-gray dark:hover:bg-gray-800 transition yebone-btn-lift"
                aria-label="Decrease quantity"
              >
                <HiOutlineMinus size={14} />
              </button>
              <span className="w-10 text-center text-sm font-semibold tabular-nums">{value}</span>
              <button
                type="button"
                onClick={increment}
                className="w-9 h-9 flex items-center justify-center hover:bg-yebone-light-gray dark:hover:bg-gray-800 transition yebone-btn-lift"
                aria-label="Increase quantity"
              >
                <HiPlus size={14} />
              </button>
            </div>

            <div className="text-right">
              <p className="font-Poppins font-bold text-yebone-primary tabular-nums">
                RWF {formatPrice(lineTotal)}
              </p>
              {hasDiscount && (
                <p className="text-xs text-gray-400 line-through tabular-nums">
                  RWF {formatPrice(data.originalPrice * value)}
                </p>
              )}
            </div>
          </div>

          {!compact && (
            <div className="flex flex-wrap gap-3 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
              {showMoveToWishlist && (
                <button
                  type="button"
                  onClick={moveToWishlist}
                  className="text-xs font-semibold text-yebone-primary hover:underline flex items-center gap-1 yebone-btn-lift"
                >
                  <AiOutlineHeart size={14} />
                  Move to wishlist
                </button>
              )}
              <span className="text-xs text-gray-400">Est. delivery 3–7 days</span>
            </div>
          )}
        </div>

        {compact && (
          <button
            type="button"
            onClick={() => removeFromCartHandler(data)}
            className="shrink-0 self-start p-1 text-gray-400 hover:text-red-500 transition"
            aria-label="Remove"
          >
            <RxCross1 size={18} />
          </button>
        )}
      </div>
    </article>
  );
};

export default CheckoutCartItem;
