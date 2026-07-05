import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineSparkles } from "react-icons/hi";
import { MdLock } from "react-icons/md";
import { Button } from "../ui";
import { typography } from "../../design-system/typography";
import CheckoutTrustBadges from "./CheckoutTrustBadges";

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
  checkoutLabel = "Proceed to payment",
  continueShoppingHref = "/products",
}) => {
  const getShippingTierText = (price) => {
    if (price >= 500000) return "Premium shipping";
    if (price >= 100000) return "Express shipping";
    if (price >= 50000) return "Standard shipping";
    return "Basic shipping";
  };

  const tierPrice = isWonBid ? wonBid?.discountPrice || 0 : subTotalPrice;

  return (
    <div className={sticky ? "checkout-sticky-summary yebone-fade-up" : "yebone-fade-up"}>
      <div className="yebone-surface rounded-[1.75rem] p-6 lg:p-8 space-y-5">
        <div>
          <h2 className={`${typography.subheading} mb-1`}>Order summary</h2>
          <p className="text-xs text-gray-500">Review totals before checkout</p>
        </div>

        {isWonBid ? (
          <>
            <SummaryRow label="Won bid amount" value={wonBid?.discountPrice} />
            <SummaryRow
              label="Shipping"
              value={shipping}
              hint={getShippingTierText(wonBid?.discountPrice || 0)}
            />
          </>
        ) : (
          <>
            <SummaryRow label="Subtotal" value={subTotalPrice} />
            <SummaryRow
              label="Estimated shipping"
              value={shipping}
              hint={getShippingTierText(subTotalPrice)}
            />
            {discountAmount ? (
              <SummaryRow label="Discount" value={discountAmount} isDiscount />
            ) : (
              <div className="flex justify-between text-sm text-gray-400">
                <span>Discount</span>
                <span>—</span>
              </div>
            )}
          </>
        )}

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-baseline">
            <span className="font-Poppins font-semibold dark:text-white">Total</span>
            <span className="font-Poppins text-2xl font-bold text-yebone-primary tabular-nums">
              RWF {formatPrice(Number(totalPrice))}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Taxes included where applicable</p>
        </div>

        {showCoupon && !isWonBid && (
          <form
            onSubmit={handleCouponSubmit || handleSubmit}
            className="space-y-2 pt-2"
          >
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Coupon code
            </label>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="Enter code"
              className="w-full h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 focus:border-yebone-primary focus:ring-4 focus:ring-yebone-primary/10 outline-none transition text-sm"
            />
            <button
              type="submit"
              className="w-full h-10 rounded-xl border-2 border-yebone-primary text-yebone-primary text-sm font-semibold hover:bg-yebone-primary hover:text-white transition yebone-btn-lift"
            >
              Apply code
            </button>
          </form>
        )}

        {showCheckoutButton && (
          <Button size="lg" className="w-full yebone-btn-lift gap-2 shadow-lg shadow-yebone-primary/15" onClick={handleSubmit}>
            <MdLock size={18} />
            {checkoutLabel}
          </Button>
        )}

        <Link
          to={continueShoppingHref}
          className="block text-center text-sm font-semibold text-yebone-primary hover:underline"
        >
          Continue shopping
        </Link>

        <CheckoutTrustBadges compact />
      </div>

      <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 mt-4">
        <HiOutlineSparkles className="text-yebone-gold" size={12} />
        Encrypted checkout on Yebone
      </p>
    </div>
  );
};

const SummaryRow = ({ label, value, hint, isDiscount }) => (
  <div className="flex justify-between items-start text-sm">
    <div>
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      {hint && <p className="text-[10px] text-gray-400 mt-0.5">{hint}</p>}
    </div>
    <span className={`font-semibold tabular-nums ${isDiscount ? "text-emerald-600" : "dark:text-white"}`}>
      {isDiscount ? "− " : ""}RWF {formatPrice(Number(value || 0))}
    </span>
  </div>
);

export default CheckoutOrderSummary;
