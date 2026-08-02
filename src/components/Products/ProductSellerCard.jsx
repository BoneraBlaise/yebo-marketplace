import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineMessage } from "react-icons/ai";
import { MdVerified } from "react-icons/md";
import Ratings from "./Ratings";
import verified from "../verify/verified.png";

const ProductSellerCard = ({
  shop,
  shopVerify,
  shopRating,
  reviewCount,
  onMessage,
}) => {
  if (!shop?._id) return null;

  return (
    <section className="pdp-seller-card" aria-label="Seller">
      <div className="pdp-seller-card__inner">
        <Link to={`/shop/preview/${shop._id}`} className="pdp-seller-card__logo-link">
          <img
            src={shop.avatar?.url}
            alt=""
            className="pdp-seller-card__logo"
          />
        </Link>
        <div className="pdp-seller-card__body">
          <div className="pdp-seller-card__name-row">
            <Link to={`/shop/preview/${shop._id}`} className="pdp-seller-card__name">
              {shop.name}
            </Link>
            {shopVerify && (
              <img src={verified} alt="Verified seller" className="pdp-seller-card__verified" />
            )}
            {shopVerify && (
              <span className="pdp-seller-card__badge">
                <MdVerified size={12} aria-hidden="true" />
                Verified
              </span>
            )}
          </div>
          <div className="pdp-seller-card__meta">
            {shopRating > 0 && (
              <span className="pdp-seller-card__rating">
                <Ratings rating={shopRating} size={14} />
                {reviewCount > 0 && (
                  <span className="pdp-seller-card__rating-count">({reviewCount})</span>
                )}
              </span>
            )}
            <span className="pdp-seller-card__response">Responds within 24h</span>
          </div>
        </div>
        <div className="pdp-seller-card__actions">
          <Link to={`/shop/preview/${shop._id}`} className="pdp-seller-card__btn pdp-seller-card__btn--ghost">
            Visit Store
          </Link>
          <button type="button" className="pdp-seller-card__btn pdp-seller-card__btn--primary" onClick={onMessage}>
            <AiOutlineMessage size={16} aria-hidden="true" />
            Message Seller
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSellerCard;
