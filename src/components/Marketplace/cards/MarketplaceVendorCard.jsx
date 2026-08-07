import React, { memo } from "react";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import classNames from "classnames";
import ShopStatusBadge from "../../Shop/storefront/ShopStatusBadge";
import {
  getVendorAvatarFallback,
  getVendorCoverFallback,
} from "../../../utils/catalogQuality";
import "../../Shop/storefront/shopStorefront.css";

const MarketplaceVendorCard = memo(({ shop, featured = false, responsiveRich = true, className = "" }) => {
  if (!shop?._id) return null;

  const hasRating = shop.ratings && Number(shop.ratings) > 0;
  const ratingLabel = hasRating ? `${Number(shop.ratings).toFixed(1)}★` : null;
  const previewImages = (shop.previewImages || []).slice(0, 3);
  const coverSrc = shop.cover?.url || shop.avatar?.url || getVendorCoverFallback();
  const logoSrc = shop.avatar?.url || getVendorAvatarFallback(shop);

  return (
    <Link
      to={`/shop/preview/${shop._id}`}
      className={classNames(
        "mpc-vendor-card home-card-lift",
        responsiveRich && "mpc-vendor-card--rich",
        featured && "mpc-vendor-card--featured",
        className
      )}
    >
      {responsiveRich && (
        <div className="mpc-vendor-card__cover relative" aria-hidden="true">
          <img src={coverSrc} alt="" loading="lazy" decoding="async" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-transparent" />
          <span className="home-chip home-chip--verified mpc-vendor-card__cover-badge">
            <MdVerified size={12} />
            Verified
          </span>
        </div>
      )}

      <div className="mpc-vendor-card__body">
        <div className="mpc-vendor-card__header">
          <img
            src={logoSrc}
            alt=""
            className="mpc-vendor-card__logo home-img-fade"
            loading="lazy"
            decoding="async"
          />
          <div className="mpc-vendor-card__info">
            <h3 className="mpc-vendor-card__name">{shop.name}</h3>
            <div className="mpc-vendor-card__badge-row">
              {shop.businessStatus && shop.businessStatus !== "open" ? (
                <ShopStatusBadge status={shop.businessStatus} className="!text-[10px] !py-0.5 !px-1.5" />
              ) : (
                <span className="home-chip home-chip--verified !text-[10px] !py-0.5 !px-1.5">
                  <MdVerified size={10} />
                  Verified seller
                </span>
              )}
            </div>
          </div>
        </div>

        <p className="mpc-vendor-card__meta">
          {[ratingLabel, `${shop.productCount || 0} products`].filter(Boolean).join(" · ")}
        </p>

        {previewImages.length > 0 ? (
          <div className="mpc-vendor-card__thumbs" aria-hidden="true">
            {previewImages.map((img, index) => (
              <div key={`${shop._id}-thumb-${index}`} className="mpc-vendor-card__thumb">
                <img src={img} alt="" loading="lazy" decoding="async" />
              </div>
            ))}
          </div>
        ) : null}

        <span className="mpc-vendor-card__cta">Visit store</span>
      </div>
    </Link>
  );
});

MarketplaceVendorCard.displayName = "MarketplaceVendorCard";

export default MarketplaceVendorCard;
