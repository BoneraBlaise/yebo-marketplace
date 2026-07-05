import React from "react";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineMessage,
} from "react-icons/ai";
import {
  FaFacebook,
  FaInstagram,
  FaPinterest,
  FaDiscord,
  FaReddit,
  FaShare,
} from "react-icons/fa";
import { MdVerified, MdLocalShipping, MdLock, MdReplay } from "react-icons/md";
import { HiOutlineSparkles } from "react-icons/hi";
import { Button, Badge } from "../ui";
import { typography } from "../../design-system/typography";
import Ratings from "./Ratings";
import verified from "../verify/verified.png";

const ShareIcons = () => {
  const productUrl = window.location.href;
  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${productUrl}`,
    pinterest: `https://pinterest.com/pin/create/button/?url=${productUrl}`,
    instagram: `https://www.instagram.com/sharing/?url=${productUrl}`,
    discord: `https://discord.com/share?url=${productUrl}`,
    reddit: `https://www.reddit.com/submit?url=${productUrl}`,
  };
  const icons = { facebook: FaFacebook, pinterest: FaPinterest, instagram: FaInstagram, discord: FaDiscord, reddit: FaReddit };

  return (
    <div className="flex items-center gap-2 pt-2">
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Share</span>
      {Object.entries(links).map(([key, url]) => {
        const Icon = icons[key];
        return (
          <button
            key={key}
            type="button"
            onClick={() => window.open(url, "_blank")}
            className="w-8 h-8 rounded-full bg-yebone-primary/10 text-yebone-primary flex items-center justify-center hover:bg-yebone-primary hover:text-white transition-all duration-200 yebone-btn-lift"
            aria-label={`Share on ${key}`}
          >
            <Icon size={14} />
          </button>
        );
      })}
    </div>
  );
};

const ProductPurchasePanel = ({
  data,
  count,
  incrementCount,
  decrementCount,
  addToCartHandler,
  buyNowHandler,
  click,
  toggleWishlist,
  shopVerify,
  handleMessageSubmit,
  handleGenerateShareLink,
  formatPrice,
  discountPct,
  moneySaved,
  reviewCount,
  showRating,
  shortDescription,
  isDescriptionLong,
  onShowMore,
  CommissionShare,
}) => {
  const inStock = data.stock > 0;
  const stockLabel = data.stock === 0
    ? "Out of stock"
    : data.stock < 5
    ? `Only ${data.stock} left`
    : "In stock";

  return (
    <div className="pdp-sticky-panel yebone-fade-up">
      <div className="yebone-surface rounded-[1.75rem] p-6 lg:p-8 space-y-6">
        {/* Title & meta */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.brand && (
              <Badge variant="muted">{data.brand}</Badge>
            )}
            {data.category && (
              <Link to={`/products?category=${encodeURIComponent(data.category)}`}>
                <Badge variant="outline">{data.category}</Badge>
              </Link>
            )}
            <Badge variant={inStock ? "gold" : "muted"}>{stockLabel}</Badge>
          </div>

          <h1 className={`${typography.heading} text-xl lg:text-2xl leading-tight mb-3`}>
            {data.name}
          </h1>

          {showRating ? (
            <div className="flex items-center gap-2">
              <Ratings rating={data.ratings} size={16} />
              <span className="text-sm text-gray-500">({reviewCount} reviews)</span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No reviews yet</p>
          )}
        </div>

        {/* Price */}
        <div className="py-5 px-4 -mx-1 rounded-2xl bg-gradient-to-br from-yebone-primary/[0.06] to-yebone-gold/[0.08] border border-yebone-primary/10">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Price</p>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="font-Poppins text-3xl lg:text-4xl font-bold text-yebone-primary tracking-tight">
              RWF {formatPrice(data.discountPrice)}
            </span>
            {data.originalPrice > data.discountPrice && (
              <>
                <span className="text-base text-gray-400 line-through">
                  RWF {formatPrice(data.originalPrice)}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-red-500 text-white text-xs font-bold shadow-sm">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>
          {moneySaved > 0 && (
            <p className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
              You save RWF {formatPrice(moneySaved)}
            </p>
          )}
        </div>

        {/* Short description */}
        {shortDescription && (
          <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            <ReactQuill value={shortDescription} readOnly theme="bubble" />
            {isDescriptionLong && (
              <button
                type="button"
                onClick={onShowMore}
                className="text-yebone-primary font-semibold mt-1 hover:underline"
              >
                Read full description
              </button>
            )}
          </div>
        )}

        {/* Trust mini badges */}
        <div className="grid grid-cols-2 gap-2">
          {[
            { icon: MdVerified, label: "Authentic product" },
            { icon: MdLocalShipping, label: "3–7 day delivery" },
            { icon: MdLock, label: "Secure checkout" },
            { icon: MdReplay, label: "Easy returns" },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-yebone-light-gray/80 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400"
            >
              <Icon className="text-yebone-primary shrink-0" size={16} />
              {label}
            </div>
          ))}
        </div>

        {/* Quantity + actions */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Qty</span>
            <div className="flex items-center rounded-2xl border-2 border-gray-200/80 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-900 shadow-sm">
              <button
                type="button"
                onClick={decrementCount}
                className="w-11 h-11 flex items-center justify-center text-lg font-medium hover:bg-yebone-light-gray dark:hover:bg-gray-800 transition yebone-btn-lift"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-14 text-center font-Poppins font-semibold text-lg">{count}</span>
              <button
                type="button"
                onClick={incrementCount}
                className="w-11 h-11 flex items-center justify-center text-lg font-medium hover:bg-yebone-light-gray dark:hover:bg-gray-800 transition yebone-btn-lift"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 yebone-btn-lift gap-2"
              onClick={() => addToCartHandler(data._id)}
              disabled={!inStock}
            >
              <AiOutlineShoppingCart size={20} />
              Add to Cart
            </Button>
            <button
              type="button"
              onClick={toggleWishlist}
              className="w-12 h-12 rounded-2xl border-2 border-gray-200/80 dark:border-gray-700 flex items-center justify-center hover:border-yebone-primary hover:shadow-md transition yebone-btn-lift"
              aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
            >
              {click ? (
                <AiFillHeart size={22} className="text-red-500" />
              ) : (
                <AiOutlineHeart size={22} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>

          <Button
            variant="secondary"
            size="lg"
            className="w-full yebone-btn-lift shadow-lg shadow-yebone-gold/20"
            onClick={buyNowHandler}
            disabled={!inStock}
          >
            Buy Now
          </Button>
        </div>

        {/* Seller */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
            Sold by
          </p>
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-yebone-light-gray/60 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
            <Link to={`/shop/preview/${data.shop._id}`} className="shrink-0">
              <img
                src={data.shop.avatar?.url}
                alt={`${data.shop.name} store`}
                className="w-14 h-14 rounded-2xl border-2 border-white dark:border-gray-700 shadow-lg object-cover yebone-card-lift"
              />
            </Link>
            <div className="flex-1 min-w-0">
              <Link
                to={`/shop/preview/${data.shop._id}`}
                className="flex items-center gap-1.5 group"
              >
                <span className="font-Poppins font-semibold text-sm group-hover:text-yebone-primary transition truncate">
                  {data.shop.name}
                </span>
                {shopVerify && (
                  <img src={verified} alt="Verified" className="w-4 h-4 shrink-0" />
                )}
              </Link>
              <Link
                to={`/shop/preview/${data.shop._id}`}
                className="text-xs text-yebone-primary hover:underline"
              >
                Visit store →
              </Link>
            </div>
            <button
              type="button"
              onClick={handleMessageSubmit}
              className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-yebone-primary/10 text-yebone-primary text-xs font-semibold hover:bg-yebone-primary hover:text-white transition pdp-btn-lift"
            >
              <AiOutlineMessage size={16} />
              Contact
            </button>
          </div>
        </div>

        {/* Share & commission */}
        <ShareIcons />
        <button
          type="button"
          onClick={handleGenerateShareLink}
          className="flex items-center gap-2 text-sm font-semibold text-yebone-primary hover:underline"
        >
          <FaShare size={14} />
          Share &amp; Earn
        </button>
        <CommissionShare />

        {/* Payment hint */}
        <div className="flex items-center gap-2 pt-2 text-xs text-gray-400">
          <HiOutlineSparkles className="text-yebone-gold" />
          Encrypted checkout · Buyer protection on Yebone
        </div>
      </div>
    </div>
  );
};

export default ProductPurchasePanel;
