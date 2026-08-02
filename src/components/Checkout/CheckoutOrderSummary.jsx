import React, { useState } from "react";
import { MdLock } from "react-icons/md";
import { Button } from "../ui";
import { typography } from "../../design-system/typography";

const formatPrice = (price) =>
  (price ?? 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const CheckoutOrderSummary = ({
  subTotalPrice,
  shipping,
  totalPrice,
  discountAmount,
  couponCode,
  setCouponCode,
  handleSubmit,
  handleCouponSubmit,
  isWonBid,
  wonBid,
  sticky = true,
  showCoupon = true,
  showCheckoutButton = true,
  checkoutLabel = "Pay now",
}) => {
  const [couponOpen, setCouponOpen] = useState(false);

  return (
    <div className={sticky ? "checkout-sticky-summary" : ""}>
      <div className="checkout-section checkout-summary">
        <h2 className={`checkout-section__title ${typography.subheading}`}>Order summary</h2>

        {isWonBid ? (
          <>
            <SummaryRow label="Won bid amount" value={wonBid?.discountPrice} />
            <SummaryRow label="Shipping" value={shipping} />
          </>
        ) : (
          <>
            <SummaryRow label="Subtotal" value={subTotalPrice} />
            <SummaryRow label="Shipping" value={shipping} />
            {discountAmount > 0 && (
              <SummaryRow label="Discount" value={discountAmount} isDiscount />
            )}
          </>
        )}

        <div className="checkout-summary__total">
          <span className="checkout-summary__total-label">Total</span>
          <span className="checkout-summary__total-value">
            RWF {formatPrice(Number(totalPrice))}
          </span>
        </div>

        {showCoupon && !isWonBid && (
          <div className="checkout-summary__coupon">
            {!couponOpen ? (
              <button
                type="button"
                className="checkout-summary__coupon-toggle"
                onClick={() => setCouponOpen(true)}
              >
                Have a coupon?
              </button>
            ) : (
              <form onSubmit={handleCouponSubmit || handleSubmit} className="checkout-summary__coupon-form">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="checkout-field"
                />
                <button type="submit" className="checkout-summary__coupon-apply">
                  Apply
                </button>
              </form>
            )}
          </div>
        )}

        {showCheckoutButton && (
          <Button size="lg" className="w-full checkout-summary__pay" onClick={handleSubmit}>
            <MdLock size={16} aria-hidden="true" />
            {checkoutLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

const SummaryRow = ({ label, value, isDiscount }) => (
  <div className="checkout-summary__row">
    <span>{label}</span>
    <span className={isDiscount ? "is-discount" : ""}>
      {isDiscount ? "− " : ""}RWF {formatPrice(Number(value || 0))}
    </span>
  </div>
);

export default CheckoutOrderSummary;
