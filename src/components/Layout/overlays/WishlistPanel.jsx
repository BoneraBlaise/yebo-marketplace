import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { BsCartPlus } from "react-icons/bs";
import { HiOutlineTrash } from "react-icons/hi";
import { removeFromWishlist } from "../../../redux/actions/wishlist";
import { addTocart } from "../../../redux/actions/cart";
import HeaderDropdownPanel from "./HeaderDropdownPanel";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const WishlistPopoverItem = memo(({ data, onRemove, onAddToCart }) => {
  const [adding, setAdding] = useState(false);
  const imageUrl = data?.images?.[0]?.url;
  const vendor = data?.shop?.name || data?.shopName || "Marketplace vendor";
  const inStock = (data?.stock ?? 1) > 0;

  const handleAddToCart = () => {
    setAdding(true);
    onAddToCart(data);
  };

  return (
    <article
      role="listitem"
      className="yebone-header-notifications__item yebone-header-notifications__item--product"
    >
      <span className="yebone-header-notifications__icon yebone-header-notifications__icon--thumb" aria-hidden="true">
        {imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" />
        ) : (
          <AiOutlineHeart size={18} />
        )}
      </span>
      <span className="yebone-header-notifications__content">
        <p className="yebone-header-notifications__item-title">
          <Link to={`/product/${data._id}`}>{data.name}</Link>
        </p>
        <p className="yebone-header-notifications__item-body">
          {vendor} · RWF {formatPrice(data.discountPrice)}
        </p>
        <span
          className={`yebone-header-notifications__item-time${
            inStock ? "" : " yebone-header-notifications__item-time--warn"
          }`}
        >
          {inStock ? "In stock" : "Out of stock"}
        </span>
        <span className="yebone-header-notifications__item-actions">
          <button
            type="button"
            className="yebone-header-notifications__action-btn yebone-header-notifications__action-btn--primary"
            onClick={handleAddToCart}
            disabled={!inStock || adding}
            aria-busy={adding}
          >
            <BsCartPlus size={13} aria-hidden="true" />
            {adding ? "Adding…" : "Move to cart"}
          </button>
          <button
            type="button"
            className="yebone-header-notifications__action-btn"
            onClick={() => onRemove(data)}
            aria-label={`Remove ${data.name}`}
          >
            <HiOutlineTrash size={13} aria-hidden="true" />
            Remove
          </button>
          <span className="yebone-header-notifications__favorite" aria-label="Saved to wishlist">
            <AiFillHeart size={14} />
          </span>
        </span>
      </span>
    </article>
  );
});

WishlistPopoverItem.displayName = "WishlistPopoverItem";

const WishlistPanel = memo(({ onClose, anchor = "top" }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const count = wishlist?.length ?? 0;

  const removeHandler = (data) => dispatch(removeFromWishlist(data));
  const addToCartHandler = (data) => {
    dispatch(addTocart({ ...data, qty: 1 }));
    onClose();
  };

  return (
    <HeaderDropdownPanel
      className={`yebone-header-dropdown--wide yebone-header-notifications${
        anchor === "bottom" ? " yebone-header-dropdown--bottom" : ""
      }`}
      ariaLabel="Wishlist"
      role="region"
    >
      <div className="yebone-header-notifications__header">
        <h3 className="yebone-header-notifications__title">Wishlist</h3>
        {count > 0 && (
          <span className="yebone-header-notifications__unread">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="yebone-header-notifications__empty">
          <AiOutlineHeart
            size={28}
            className="mx-auto mb-3 text-yebone-primary dark:text-yebone-accent"
            aria-hidden="true"
          />
          <p className="yebone-header-notifications__empty-title">Your wishlist is empty</p>
          <p className="yebone-header-notifications__empty-text">
            Save items you love and come back to them anytime.
          </p>
        </div>
      ) : (
        <div className="yebone-header-notifications__list" role="list">
          {wishlist.map((item, index) => (
            <WishlistPopoverItem
              key={item._id || index}
              data={item}
              onRemove={removeHandler}
              onAddToCart={addToCartHandler}
            />
          ))}
        </div>
      )}

      <div className="yebone-header-notifications__footer yebone-header-notifications__footer--stacked">
        {count > 0 && (
          <Link to="/profile" className="yebone-header-notifications__view-all" onClick={onClose}>
            View full wishlist
          </Link>
        )}
        <Link
          to="/products"
          className={`yebone-header-notifications__view-all${
            count > 0 ? " yebone-header-notifications__view-all--secondary" : ""
          }`}
          onClick={onClose}
        >
          Continue shopping
        </Link>
      </div>
    </HeaderDropdownPanel>
  );
});

WishlistPanel.displayName = "WishlistPanel";

export default WishlistPanel;
