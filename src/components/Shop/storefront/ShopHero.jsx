import React from "react";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import { SHOP_STATUS_LABELS, formatJoinedDate } from "../../../utils/shopStorefrontUtils";

const PLACEHOLDER_COVER =
  "linear-gradient(135deg, #29625d 0%, #1a3d39 50%, #0f2825 100%)";

const ShopHero = ({
  shop,
  stats,
  followState,
  isOwner,
  onFollow,
  onFavorite,
  onChat,
  onShare,
  accent,
}) => {
  if (!shop) return null;

  const status = SHOP_STATUS_LABELS[shop.businessStatus] || SHOP_STATUS_LABELS.open;
  const accentColor = accent || shop.themeAccent || "#29625d";

  const handleShare = () => {
    if (onShare) onShare();
    else if (navigator.share) {
      navigator.share({ title: shop.name, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  return (
    <section
      className="shop-hero dark:bg-gray-900"
      style={{ "--shop-accent": accentColor }}
      aria-label={`${shop.name} storefront`}
    >
      <div className="shop-hero__cover">
        {shop.cover?.url ? (
          <>
            <img src={shop.cover.url} alt="" loading="eager" fetchPriority="high" />
            <div className="shop-hero__cover-overlay" aria-hidden="true" />
          </>
        ) : (
          <div className="w-full h-full" style={{ background: PLACEHOLDER_COVER }} aria-hidden="true" />
        )}
      </div>

      <div className="shop-hero__body">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <img
            src={shop.avatar?.url || "https://via.placeholder.com/120"}
            alt={`${shop.name} logo`}
            className="shop-hero__avatar"
            width={104}
            height={104}
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {shop.name}
              </h1>
              {shop.isVerified && (
                <MdVerified className="text-yebone-gold shrink-0" size={22} title="Verified seller" />
              )}
              <span className={`shop-hero__status shop-hero__status--${status.tone}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current" aria-hidden="true" />
                {status.label}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
              {stats?.averageRating > 0 && (
                <span>⭐ {stats.averageRating.toFixed(1)} ({stats.totalReviews} reviews)</span>
              )}
              <span>👥 {shop.followerCount ?? 0} followers</span>
              <span>❤️ {shop.favoriteCount ?? 0} favorites</span>
              <span>📦 {stats?.productCount ?? 0} products</span>
              {stats?.totalSold > 0 && <span>🛒 {stats.totalSold} sold</span>}
              <span>🗓 Joined {formatJoinedDate(shop.createdAt)}</span>
              {shop.address && <span>📍 {shop.address}</span>}
            </div>

            {(shop.bio || shop.description) && (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 line-clamp-3 max-w-2xl">
                {shop.bio || shop.description}
              </p>
            )}
          </div>
        </div>

        <div className="shop-hero__actions">
          {!isOwner && (
            <>
              <button
                type="button"
                className="shop-hero__btn shop-hero__btn--primary"
                onClick={onFollow}
                aria-pressed={followState?.following}
              >
                {followState?.following ? "Following" : "Follow Shop"}
              </button>
              <button
                type="button"
                className="shop-hero__btn shop-hero__btn--secondary"
                onClick={onFavorite}
                aria-pressed={followState?.favorited}
              >
                {followState?.favorited ? "Favorited" : "Favorite Shop"}
              </button>
              <button type="button" className="shop-hero__btn shop-hero__btn--secondary" onClick={onChat}>
                Chat
              </button>
              {shop.phoneNumber && (
                <a
                  href={`tel:${shop.phoneNumber}`}
                  className="shop-hero__btn shop-hero__btn--secondary"
                >
                  Call
                </a>
              )}
              <button type="button" className="shop-hero__btn shop-hero__btn--secondary" onClick={handleShare}>
                Share
              </button>
            </>
          )}
          {isOwner && (
            <>
              <Link to="/settings" className="shop-hero__btn shop-hero__btn--primary">
                Edit Storefront
              </Link>
              <Link to="/dashboard" className="shop-hero__btn shop-hero__btn--secondary">
                Seller Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ShopHero;
