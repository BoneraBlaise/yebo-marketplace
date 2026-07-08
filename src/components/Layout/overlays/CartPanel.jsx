import React, { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiOutlineTrash, HiPlus } from "react-icons/hi";
import { toast } from "react-toastify";
import { addTocart, removeFromCart } from "../../../redux/actions/cart";
import { useReferral } from "../../../context/ReferralContext";
import HeaderDropdownPanel from "./HeaderDropdownPanel";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CartPopoverItem = memo(({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
  hasReferral = false,
}) => {
  const [value, setValue] = useState(data.qty || 1);
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
    <article
      role="listitem"
      className={`yebone-header-notifications__item yebone-header-notifications__item--product${
        updating ? " is-updating" : ""
      }`}
    >
      <span className="yebone-header-notifications__icon yebone-header-notifications__icon--thumb" aria-hidden="true">
        {imageUrl ? (
          <img src={imageUrl} alt="" loading="lazy" />
        ) : (
          <IoBagHandleOutline size={18} />
        )}
      </span>
      <span className="yebone-header-notifications__content">
        <p className="yebone-header-notifications__item-title">
          <Link to={`/product/${data._id}`}>{data.name}</Link>
        </p>
        <p className="yebone-header-notifications__item-body">
          {vendor}
          {hasReferral ? " · Referred" : ""}
        </p>
        <span className="yebone-header-notifications__item-time">
          RWF {formatPrice(data.discountPrice)} each · Subtotal RWF {formatPrice(lineTotal)}
        </span>
        <span className="yebone-header-notifications__item-actions">
          <span className="yebone-header-notifications__qty" aria-label="Quantity">
            <button
              type="button"
              onClick={decrement}
              disabled={value <= 1}
              aria-label="Decrease quantity"
            >
              <HiOutlineMinus size={13} />
            </button>
            <span aria-live="polite">{value}</span>
            <button
              type="button"
              onClick={increment}
              disabled={!inStock || data.stock <= value}
              aria-label="Increase quantity"
            >
              <HiPlus size={13} />
            </button>
          </span>
          <button
            type="button"
            className="yebone-header-notifications__action-btn"
            onClick={() => removeFromCartHandler(data)}
            aria-label={`Remove ${data.name}`}
          >
            <HiOutlineTrash size={13} aria-hidden="true" />
            Remove
          </button>
        </span>
        {!inStock && (
          <span className="yebone-header-notifications__item-time yebone-header-notifications__item-time--warn">
            Out of stock
          </span>
        )}
      </span>
    </article>
  );
});

CartPopoverItem.displayName = "CartPopoverItem";

const CartPanel = memo(({ onClose, anchor = "top" }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const { referralProducts } = useReferral();
  const count = cart?.length ?? 0;

  const subtotal = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const removeHandler = (data) => dispatch(removeFromCart(data));
  const quantityChangeHandler = (data) => dispatch(addTocart(data));

  return (
    <HeaderDropdownPanel
      className={`yebone-header-dropdown--wide yebone-header-notifications${
        anchor === "bottom" ? " yebone-header-dropdown--bottom" : ""
      }`}
      ariaLabel="Shopping cart"
      role="region"
    >
      <div className="yebone-header-notifications__header">
        <h3 className="yebone-header-notifications__title">Cart</h3>
        {count > 0 && (
          <span className="yebone-header-notifications__unread">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>

      {count === 0 ? (
        <div className="yebone-header-notifications__empty">
          <IoBagHandleOutline
            size={28}
            className="mx-auto mb-3 text-yebone-primary dark:text-yebone-accent"
            aria-hidden="true"
          />
          <p className="yebone-header-notifications__empty-title">Your cart is empty</p>
          <p className="yebone-header-notifications__empty-text">
            Add items from Yebone to checkout.
          </p>
        </div>
      ) : (
        <div className="yebone-header-notifications__list" role="list">
          {cart.map((item, index) => (
            <CartPopoverItem
              key={item._id || index}
              data={item}
              quantityChangeHandler={quantityChangeHandler}
              removeFromCartHandler={removeHandler}
              hasReferral={referralProducts.has(item._id) || item.referralCode}
            />
          ))}
        </div>
      )}

      <div className="yebone-header-notifications__footer yebone-header-notifications__footer--stacked">
        {count > 0 && (
          <>
            <div className="yebone-header-popover-summary">
              <div className="yebone-header-popover-summary__row">
                <span>Subtotal</span>
                <span>RWF {formatPrice(subtotal)}</span>
              </div>
              <div className="yebone-header-popover-summary__row">
                <span>Shipping</span>
                <span className="yebone-header-popover-summary__hint">Calculated at checkout</span>
              </div>
              <div className="yebone-header-popover-summary__row yebone-header-popover-summary__row--total">
                <span>Estimated total</span>
                <span>RWF {formatPrice(subtotal)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              onClick={onClose}
              className="yebone-header-notifications__checkout-btn"
            >
              Checkout · RWF {formatPrice(subtotal)}
            </Link>
          </>
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

CartPanel.displayName = "CartPanel";

export default CartPanel;
