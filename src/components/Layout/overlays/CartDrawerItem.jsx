import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineMinus, HiOutlineTrash, HiPlus } from "react-icons/hi";
import { toast } from "react-toastify";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CartDrawerItem = memo(({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  hasReferral = false,
}) => {
  const [value, setValue] = useState(data.qty || 1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const imageUrl = data?.images?.[0]?.url;
  const vendor = data?.shop?.name || data?.shopName || "Marketplace vendor";
  const inStock = (data?.stock ?? 0) > 0;
  const lineTotal = data.discountPrice * value;

  useEffect(() => {
    setValue(data.qty || 1);
  }, [data.qty]);

  const updateQty = (next) => {
    setUpdating(true);
    setValue(next);
    quantityChangeHandler({ ...data, qty: next });
    window.setTimeout(() => setUpdating(false), 180);
  };

  const increment = () => {
    if (data.stock < value) {
      toast.error("Product stock limited!");
      return;
    }
    updateQty(value + 1);
  };

  const decrement = () => {
    if (value <= 1) return;
    updateQty(value - 1);
  };

  return (
    <article className={`yebone-header-product-card${updating ? " is-updating" : ""}`}>
      <Link
        to={`/product/${data._id}`}
        className="yebone-header-product-card__thumb"
        aria-label={data.name}
      >
        {!imgLoaded && <span className="yebone-header-product-card__thumb-skeleton" aria-hidden="true" />}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            className={imgLoaded ? "is-loaded" : ""}
          />
        ) : null}
      </Link>

      <div className="yebone-header-product-card__content">
        <div className="yebone-header-product-card__top">
          <div className="yebone-header-product-card__meta">
            <span className="yebone-header-product-card__vendor">{vendor}</span>
            {hasReferral && (
              <span className="yebone-header-product-card__tag">Referred</span>
            )}
          </div>
          <button
            type="button"
            className="yebone-header-product-card__icon-btn"
            onClick={() => removeFromCartHandler(data)}
            aria-label={`Remove ${data.name}`}
          >
            <HiOutlineTrash size={16} />
          </button>
        </div>

        <h3 className="yebone-header-product-card__title">
          <Link to={`/product/${data._id}`}>{data.name}</Link>
        </h3>

        <div className="yebone-header-product-card__price-row">
          <span className="yebone-header-product-card__unit">
            RWF {formatPrice(data.discountPrice)} each
          </span>
          <span className="yebone-header-product-card__line-total">
            RWF {formatPrice(lineTotal)}
          </span>
        </div>

        <div className="yebone-header-product-card__cart-row">
          <div className="yebone-header-product-card__qty" aria-label="Quantity">
            <button
              type="button"
              onClick={decrement}
              disabled={value <= 1}
              aria-label="Decrease quantity"
            >
              <HiOutlineMinus size={14} />
            </button>
            <span aria-live="polite">{value}</span>
            <button
              type="button"
              onClick={increment}
              disabled={!inStock || data.stock <= value}
              aria-label="Increase quantity"
            >
              <HiPlus size={14} />
            </button>
          </div>
          {!inStock && (
            <span className="yebone-header-product-card__availability is-out-of-stock">
              Out of stock
            </span>
          )}
        </div>
      </div>
    </article>
  );
});

CartDrawerItem.displayName = "CartDrawerItem";

export default CartDrawerItem;
