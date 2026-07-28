import React from "react";
import { Link } from "react-router-dom";
import { RxCross1 } from "react-icons/rx";
import { HiOutlineSparkles } from "react-icons/hi";
import { Button } from "../ui";

const ProductTryOnUnavailableModal = ({
  open,
  onClose,
  shopId,
  shopName,
  onNotifySeller,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="relative w-full max-w-md rounded-[1.75rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl p-6 sm:p-8 pdp-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tryon-unavailable-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-800 dark:hover:text-white transition"
          aria-label="Close"
        >
          <RxCross1 size={18} />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-yebone-primary to-yebone-primary-dark text-white">
            <HiOutlineSparkles size={20} />
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-yebone-primary">YEBO AI</span>
        </div>

        <h2 id="tryon-unavailable-title" className="font-Poppins text-xl font-semibold dark:text-white mb-2">
          AI Try-On unavailable
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
          {shopName
            ? `This seller hasn't enabled YEBO AI Try-On yet.`
            : `This seller hasn't enabled YEBO AI Try-On yet.`}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" size="lg" className="flex-1" onClick={onClose}>
            Continue Shopping
          </Button>
          {shopId && (
            <Link to={`/shop/preview/${shopId}`} className="flex-1" onClick={onClose}>
              <Button size="lg" className="w-full">
                Visit Store
              </Button>
            </Link>
          )}
        </div>

        {onNotifySeller && (
          <button
            type="button"
            onClick={onNotifySeller}
            className="mt-4 w-full text-sm font-semibold text-yebone-primary hover:underline"
          >
            Notify Seller
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductTryOnUnavailableModal;
