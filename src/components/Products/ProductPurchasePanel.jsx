import React from "react";
import ReactQuill from "react-quill";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Button, Badge } from "../ui";
import { typography } from "../../design-system/typography";
import Ratings from "./Ratings";
import ProductVariants from "./ProductVariants";

const ProductPurchasePanel = ({
  data,
  count,
  incrementCount,
  decrementCount,
  addToCartHandler,
  buyNowHandler,
  click,
  toggleWishlist,
  formatPrice,
  discountPct,
  moneySaved,
  reviewCount,
  showRating,
  shortDescription,
  isDescriptionLong,
  onShowMore,
}) => {
  const inStock = data.stock > 0;
  const stockLabel = data.stock === 0
    ? "Out of stock"
    : data.stock < 5
    ? `Only ${data.stock} left`
    : "In stock";

  return (
    <div className="pdp-sticky-panel pdp-purchase">
      <div className="pdp-purchase__inner">
        <h1 className={`pdp-purchase__title ${typography.heading}`}>{data.name}</h1>

        {showRating ? (
          <div className="pdp-purchase__rating">
            <Ratings rating={data.ratings} size={16} />
            <span>({reviewCount} reviews)</span>
          </div>
        ) : (
          <p className="pdp-purchase__rating pdp-purchase__rating--empty">No reviews yet</p>
        )}

        <div className="pdp-purchase__price-block">
          <div className="pdp-purchase__price-row">
            <span className="pdp-purchase__price">RWF {formatPrice(data.discountPrice)}</span>
            {data.originalPrice > data.discountPrice && (
              <>
                <span className="pdp-purchase__price-old">RWF {formatPrice(data.originalPrice)}</span>
                <Badge variant="muted">-{discountPct}%</Badge>
              </>
            )}
          </div>
          {moneySaved > 0 && (
            <p className="pdp-purchase__savings">Save RWF {formatPrice(moneySaved)}</p>
          )}
          <p className={`pdp-purchase__stock${!inStock ? " is-out" : ""}`}>{stockLabel}</p>
        </div>

        <div className="pdp-purchase__actions pdp-purchase__actions--desktop">
          <Button size="lg" className="pdp-purchase__cart" onClick={() => addToCartHandler(data._id)} disabled={!inStock}>
            <AiOutlineShoppingCart size={18} aria-hidden="true" />
            Add to Cart
          </Button>
          <Button variant="secondary" size="lg" className="pdp-purchase__buy" onClick={buyNowHandler} disabled={!inStock}>
            Buy Now
          </Button>
          <button
            type="button"
            className="pdp-purchase__wishlist"
            onClick={toggleWishlist}
            aria-label={click ? "Remove from wishlist" : "Add to wishlist"}
          >
            {click ? <AiFillHeart size={20} className="text-red-500" /> : <AiOutlineHeart size={20} />}
          </button>
        </div>

        <ProductVariants data={data} />

        <p className="pdp-purchase__delivery">
          Delivery typically 3–7 business days depending on location.
        </p>

        <div className="pdp-purchase__qty-row">
          <span className="pdp-purchase__qty-label">Quantity</span>
          <div className="pdp-purchase__qty">
            <button type="button" onClick={decrementCount} aria-label="Decrease quantity">−</button>
            <span>{count}</span>
            <button type="button" onClick={incrementCount} aria-label="Increase quantity">+</button>
          </div>
        </div>

        {shortDescription && (
          <div className="pdp-purchase__desc">
            <ReactQuill value={shortDescription} readOnly theme="bubble" />
            {isDescriptionLong && (
              <button type="button" className="pdp-purchase__read-more" onClick={onShowMore}>
                Read more
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPurchasePanel;
