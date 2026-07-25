import React from "react";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import ShopBio from "./ShopBio";
import ShopStatusBadge from "./ShopStatusBadge";
import ShopStatusToggle from "./ShopStatusToggle";
import { formatJoinedDate } from "../../../utils/shopStorefrontUtils";

const PLACEHOLDER_COVER =
  "linear-gradient(135deg, #29625d 0%, #1a3d39 50%, #0f2825 100%)";

const ShopHero = ({
  shop,
  isOwner,
  followState,
  onFollow,
  onFavorite,
  onChat,
  onShare,
  onStatusChange,
  accent,
}) => {
  if (!shop) return null;

  const accentColor = accent || shop.themeAccent || "#29625d";
  const bioText = shop.bio || shop.description;
  const joined = formatJoinedDate(shop.createdAt);

  const handleShare = () => {
    if (onShare) onShare();
  };

  return (
    <header
      className="shop-profile"
      style={{ "--shop-accent": accentColor }}
      aria-label={`${shop.name} storefront`}
    >
      <div className="shop-profile__cover">
        {shop.cover?.url ? (
          <>
            <img src={shop.cover.url} alt="" loading="eager" fetchPriority="high" />
            <div className="shop-profile__cover-overlay" aria-hidden="true" />
          </>
        ) : (
          <div className="shop-profile__cover-fallback" style={{ background: PLACEHOLDER_COVER }} aria-hidden="true" />
        )}
      </div>

      <div className="shop-profile__content">
        <img
          src={shop.avatar?.url || "https://via.placeholder.com/96"}
          alt={`${shop.name} logo`}
          className="shop-profile__avatar"
          width={96}
          height={96}
        />

        <div className="shop-profile__identity">
          <div className="shop-profile__name-row">
            <h1 className="shop-profile__name">{shop.name}</h1>
            {shop.isVerified && (
              <MdVerified className="shop-profile__verified" size={22} title="Verified seller" />
            )}
          </div>

          <ShopBio text={bioText} />

          {shop.address && (
            <p className="shop-profile__meta">
              <span className="shop-profile__meta-label">Location</span>
              {shop.address}
            </p>
          )}

          {joined && (
            <p className="shop-profile__meta">
              <span className="shop-profile__meta-label">Member since</span>
              {joined}
            </p>
          )}

          <div className="shop-profile__status-row">
            {isOwner ? (
              <ShopStatusToggle
                shopId={shop._id}
                value={shop.businessStatus || "open"}
                onChange={onStatusChange}
              />
            ) : (
              <ShopStatusBadge status={shop.businessStatus || "open"} />
            )}
          </div>
        </div>

        <div className="shop-profile__actions" role="group" aria-label="Shop actions">
          {!isOwner && (
            <>
              <button
                type="button"
                className="shop-profile__btn shop-profile__btn--primary"
                onClick={onFollow}
                aria-pressed={followState?.following}
              >
                {followState?.following ? "Following" : "Follow"}
              </button>
              <button
                type="button"
                className="shop-profile__btn shop-profile__btn--ghost"
                onClick={onFavorite}
                aria-pressed={followState?.favorited}
              >
                {followState?.favorited ? "Favorited" : "Favorite"}
              </button>
              <button type="button" className="shop-profile__btn shop-profile__btn--ghost" onClick={onChat}>
                Chat
              </button>
              {shop.phoneNumber && (
                <a href={`tel:${shop.phoneNumber}`} className="shop-profile__btn shop-profile__btn--ghost">
                  Call
                </a>
              )}
              <button type="button" className="shop-profile__btn shop-profile__btn--ghost" onClick={handleShare}>
                Share
              </button>
            </>
          )}
          {isOwner && (
            <>
              <Link to="/settings" className="shop-profile__btn shop-profile__btn--primary">
                Edit Storefront
              </Link>
              <Link to="/dashboard" className="shop-profile__btn shop-profile__btn--ghost">
                Seller Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default ShopHero;
