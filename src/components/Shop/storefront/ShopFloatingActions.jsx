import React from "react";
import { AiOutlineMessage, AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { HiOutlinePhone } from "react-icons/hi";

const ShopFloatingActions = ({ shop, followState, onChat, onFollow, onFavorite, onShare }) => {
  if (!shop) return null;

  return (
    <div className="shop-fab lg:hidden" aria-label="Quick shop actions">
      <button
        type="button"
        className="shop-fab__btn shop-fab__btn--secondary"
        onClick={onFavorite}
        aria-label={followState?.favorited ? "Remove favorite" : "Favorite shop"}
        aria-pressed={followState?.favorited}
      >
        <AiOutlineHeart size={20} />
      </button>
      {shop.phoneNumber && (
        <a
          href={`tel:${shop.phoneNumber}`}
          className="shop-fab__btn shop-fab__btn--secondary"
          aria-label="Call shop"
        >
          <HiOutlinePhone size={20} />
        </a>
      )}
      <button type="button" className="shop-fab__btn shop-fab__btn--secondary" onClick={onShare} aria-label="Share shop">
        <AiOutlineShareAlt size={20} />
      </button>
      <button type="button" className="shop-fab__btn" onClick={onChat} aria-label="Chat with shop">
        <AiOutlineMessage size={20} />
      </button>
    </div>
  );
};

export default ShopFloatingActions;
