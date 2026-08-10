import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMinus, HiPlus, HiOutlineTrash } from "react-icons/hi";
import { toast } from "react-toastify";
import verified from "../verify/verified.png";
import CartVariantSummary from "../cart/CartVariantSummary";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CheckoutCartItem = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  compact = false,
  showMoveToWishlist = false,
  hasReferral = false,
}) => {
  const [value, setValue] = useState(data.qty || 1);
  const lineTotal = data.discountPrice * value;
  const inStock = data.stock > 0;
  const isVerified = Boolean(data.shop?.isVerified);
  const legacyVariantText = [data.color, data.size].filter(Boolean).join(" · ");

  useEffect(() => {
    setValue(data.qty || 1);
  }, [data.qty]);

  const increment = () => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
    } else {
      const next = value + 1;
      setValue(next);
      quantityChangeHandler(data, next);
    }
  };

  const decrement = () => {
    const next = value === 1 ? 1 : value - 1;
    setValue(next);
    quantityChangeHandler(data, next);
  };

  return (
    <article className={`checkout-cart-item${compact ? " checkout-cart-item--compact" : ""}`}>
      <Link to={`/product/${data._id}`} className="checkout-cart-item__thumb">
        <img src={data?.images?.[0]?.url} alt={data.name} />
      </Link>

      <div className="checkout-cart-item__body">
        <div className="checkout-cart-item__top">
          <div className="checkout-cart-item__info">
            <Link to={`/product/${data._id}`} className="checkout-cart-item__name">
              {data.name}
            </Link>
            {data.shop?.name && (
              <p className="checkout-cart-item__seller">
                <span className="checkout-cart-item__seller-name">{data.shop.name}</span>
                {isVerified && (
                  <img src={verified} alt="Verified seller" className="checkout-cart-item__verified" />
                )}
              </p>
            )}
            {(legacyVariantText || hasReferral) && !data.variantId && (
              <p className="checkout-cart-item__variants">
                {[legacyVariantText, hasReferral ? "Referred" : null].filter(Boolean).join(" · ")}
              </p>
            )}
            {data.variantId ? <CartVariantSummary item={data} /> : null}
            {hasReferral && data.variantId ? (
              <p className="checkout-cart-item__variants">Referred</p>
            ) : null}
            {!inStock && <span className="checkout-cart-item__oos">Out of stock</span>}
          </div>
          {!compact && (
            <button
              type="button"
              onClick={() => removeFromCartHandler(data)}
              className="checkout-cart-item__remove"
              aria-label="Remove item"
            >
              <HiOutlineTrash size={16} />
            </button>
          )}
        </div>

        <div className="checkout-cart-item__footer">
          <div className="checkout-cart-item__qty">
            <button type="button" onClick={decrement} aria-label="Decrease quantity">
              <HiOutlineMinus size={12} />
            </button>
            <span>{value}</span>
            <button type="button" onClick={increment} aria-label="Increase quantity">
              <HiPlus size={12} />
            </button>
          </div>
          <p className="checkout-cart-item__price">RWF {formatPrice(lineTotal)}</p>
        </div>
      </div>
    </article>
  );
};

export default CheckoutCartItem;
