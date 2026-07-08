import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { AiFillHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const WishlistDrawerItem = memo(({ data, onRemove, onAddToCart }) => {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [adding, setAdding] = useState(false);
  const imageUrl = data?.images?.[0]?.url;
  const vendor = data?.shop?.name || data?.shopName || "Marketplace vendor";
  const inStock = (data?.stock ?? 1) > 0;

  const handleAddToCart = () => {
    setAdding(true);
    onAddToCart(data);
  };

  return (
    <article className="yebone-header-product-card">
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
            <span
              className={`yebone-header-product-card__availability${
                inStock ? " is-in-stock" : " is-out-of-stock"
              }`}
            >
              {inStock ? "In stock" : "Out of stock"}
            </span>
          </div>
          <button
            type="button"
            className="yebone-header-product-card__favorite is-active"
            aria-label="Saved to wishlist"
            aria-pressed="true"
          >
            <AiFillHeart size={16} />
          </button>
        </div>

        <h3 className="yebone-header-product-card__title">
          <Link to={`/product/${data._id}`}>{data.name}</Link>
        </h3>

        <p className="yebone-header-product-card__price">
          RWF {formatPrice(data.discountPrice)}
        </p>

        <div className="yebone-header-product-card__actions">
          <button
            type="button"
            className="yebone-header-product-card__btn yebone-header-product-card__btn--primary"
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            aria-busy={adding}
          >
            <BsCartPlus size={14} aria-hidden="true" />
            {adding ? "Adding…" : "Move to cart"}
          </button>
          <button
            type="button"
            className="yebone-header-product-card__btn"
            onClick={() => onRemove(data)}
            aria-label={`Remove ${data.name}`}
          >
            <HiOutlineTrash size={14} aria-hidden="true" />
            Remove
          </button>
        </div>
      </div>
    </article>
  );
});

WishlistDrawerItem.displayName = "WishlistDrawerItem";

export default WishlistDrawerItem;
