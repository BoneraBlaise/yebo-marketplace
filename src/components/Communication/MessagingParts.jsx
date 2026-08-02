import React, { memo } from "react";
import { format } from "timeago.js";
import { IoChatbubblesOutline, IoPricetagOutline } from "react-icons/io5";
import PresenceBadge from "./PresenceBadge";

const formatAmount = (amount, currency = "RWF") =>
  `${Number(amount || 0).toLocaleString()} ${currency}`;

export const OfferCard = memo(function OfferCard({
  offer,
  currentUserId,
  onRespond,
  onCounter,
  onCheckout,
}) {
  const isSeller = String(offer.sellerId) === String(currentUserId);
  const isBuyer = String(offer.buyerId) === String(currentUserId);
  const pending = offer.status === "pending";

  return (
    <div className="mc-offer-card" role="article" aria-label="Offer">
      <div className="mc-offer-card__header">
        <IoPricetagOutline aria-hidden="true" />
        <span>{formatAmount(offer.amount, offer.currency)}</span>
        <span className={`mc-offer-card__status mc-offer-card__status--${offer.status}`}>
          {offer.status}
        </span>
      </div>
      {offer.message && <p className="mc-offer-card__message">{offer.message}</p>}
      {offer.productSnapshot?.name && (
        <p className="mc-offer-card__product">{offer.productSnapshot.name}</p>
      )}
      {pending && isSeller && (
        <div className="mc-offer-card__actions">
          <button type="button" className="mc-btn mc-btn--primary" onClick={() => onRespond(offer.offerId, "accepted")}>
            Accept
          </button>
          <button type="button" className="mc-btn mc-btn--ghost" onClick={() => onRespond(offer.offerId, "rejected")}>
            Reject
          </button>
          <button type="button" className="mc-btn mc-btn--ghost" onClick={() => onCounter(offer)}>
            Counter
          </button>
        </div>
      )}
      {pending && isBuyer && (
        <div className="mc-offer-card__actions">
          <button type="button" className="mc-btn mc-btn--ghost" onClick={() => onCounter(offer)}>
            Counter
          </button>
          <button type="button" className="mc-btn mc-btn--ghost" onClick={() => onRespond(offer.offerId, "rejected")}>
            Withdraw
          </button>
        </div>
      )}
      {offer.status === "accepted" && isBuyer && offer.priceLockToken && (
        <button type="button" className="mc-btn mc-btn--primary mc-offer-card__checkout" onClick={() => onCheckout(offer)}>
          Proceed to checkout
        </button>
      )}
    </div>
  );
});

export const ConversationRow = memo(function ConversationRow({
  chat,
  isActive,
  thumb,
  preview,
  presence,
  unreadCount,
  onSelect,
  onPrefetch,
}) {
  return (
    <button
      type="button"
      role="listitem"
      className={`mc-conversation-item${isActive ? " is-active" : ""}${unreadCount > 0 ? " has-unread" : ""}`}
      onClick={onSelect}
      onMouseEnter={onPrefetch}
      onFocus={onPrefetch}
    >
      <div className="mc-conversation-item__thumb">
        {thumb ? (
          <img src={thumb} alt="" loading="lazy" decoding="async" />
        ) : (
          <span className="mc-conversation-item__thumb-fallback">
            <IoChatbubblesOutline />
          </span>
        )}
        <span
          className={`mc-conversation-item__presence${presence.status === "online" ? " is-online mc-presence-pulse" : ""}`}
          aria-hidden="true"
        />
      </div>
      <div className="mc-conversation-item__content">
        <div className="mc-conversation-item__top">
          <span className="mc-conversation-item__name">
            {chat.productSnapshot?.name || "Product conversation"}
          </span>
          <span className="mc-conversation-item__time">
            {chat.updatedAt ? format(chat.updatedAt) : ""}
          </span>
        </div>
        <div className="mc-conversation-item__bottom">
          <p className="mc-conversation-item__preview">{preview}</p>
          {unreadCount > 0 && (
            <span className="mc-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </div>
      </div>
    </button>
  );
});

export const MessageRow = memo(function MessageRow({
  msg,
  isMine,
  statusLabel,
  linkedOffer,
  currentUserId,
  onRespondOffer,
  onCounterOffer,
  onCheckout,
  formatTime,
}) {
  return (
    <div
      className={`mc-message${isMine ? " mc-message--mine" : " mc-message--theirs"}${msg.pending ? " mc-message--pending" : ""}${msg.failed ? " mc-message--failed" : ""}`}
    >
      {msg.messageType === "offer" && linkedOffer ? (
        <OfferCard
          offer={linkedOffer}
          currentUserId={currentUserId}
          onRespond={onRespondOffer}
          onCounter={onCounterOffer}
          onCheckout={onCheckout}
        />
      ) : (
        <div className="mc-message__bubble">
          <p>{msg.text}</p>
          {msg.images?.url && (
            <img
              src={msg.images.url}
              alt="Attachment"
              className="mc-message__image"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
      )}
      <div className="mc-message__meta">
        <time>{msg.createdAt ? formatTime(msg.createdAt) : "Now"}</time>
        {statusLabel && <span className="mc-message__status">{statusLabel}</span>}
      </div>
    </div>
  );
});
