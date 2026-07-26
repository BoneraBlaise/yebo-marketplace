import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { toast } from "react-toastify";
import {
  AiOutlineSend,
  AiOutlineSearch,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { IoArchiveOutline, IoPricetagOutline } from "react-icons/io5";
import { socketUrl } from "../../config/serverConfig";
import {
  archiveConversation,
  counterProductOffer,
  createProductOffer,
  fetchConversations,
  fetchMessages,
  fetchOfferHistory,
  respondToProductOffer,
  sendConversationMessage,
  unarchiveConversation,
} from "../../services/communicationService";
import "./messaging-center.css";

const socket = socketIO(socketUrl, { transports: ["websocket", "polling"], autoConnect: true });

const formatAmount = (amount, currency = "RWF") =>
  `${Number(amount || 0).toLocaleString()} ${currency}`;

const OfferCard = ({ offer, currentUserId, onRespond, onCounter, onCheckout }) => {
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
};

const MessagingCenter = ({ mode = "buyer", title = "Messages" }) => {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const currentUserId = mode === "seller" ? seller?._id : user?._id;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const conversationParam = searchParams.get("conversation") || searchParams.get("") || null;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [offerModal, setOfferModal] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const scrollRef = useRef(null);

  const offersById = useMemo(() => {
    const map = {};
    for (const offer of offers) map[offer.offerId] = offer;
    return map;
  }, [offers]);

  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const data = await fetchConversations({ search, includeArchived: showArchived });
      setConversations(data);
    } catch (_error) {
      toast.error("Could not load conversations");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, search, showArchived]);

  const loadThread = useCallback(async (conversation) => {
    if (!conversation?._id) return;
    try {
      const [messageData, offerData] = await Promise.all([
        fetchMessages(conversation._id),
        fetchOfferHistory(conversation._id),
      ]);
      setMessages(messageData);
      setOffers(offerData);
    } catch (_error) {
      toast.error("Could not load messages");
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!currentUserId) return;
    socket.emit("addUser", currentUserId);
    socket.on("getUsers", setOnlineUsers);
    socket.on("getMessage", (data) => {
      if (currentChat && String(data.conversationId) === String(currentChat._id)) {
        setMessages((prev) => [...prev, data.message || data]);
        loadConversations();
      }
    });
    socket.on("notification", () => loadConversations());
    return () => {
      socket.off("getUsers");
      socket.off("getMessage");
      socket.off("notification");
    };
  }, [currentUserId, currentChat, loadConversations]);

  useEffect(() => {
    if (!conversationParam || !conversations.length) return;
    const match = conversations.find((c) => String(c._id) === String(conversationParam));
    if (match) {
      setCurrentChat(match);
      setMobileShowThread(true);
      loadThread(match);
    }
  }, [conversationParam, conversations, loadThread]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const onlineCheck = (chat) => {
    const otherId = (chat.members || []).find((m) => String(m) !== String(currentUserId));
    return onlineUsers.some((u) => String(u.userId) === String(otherId));
  };

  const openConversation = async (chat) => {
    setCurrentChat(chat);
    setMobileShowThread(true);
    setSearchParams({ conversation: chat._id });
    await loadThread(chat);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentChat) return;
    const otherId = (currentChat.members || []).find((m) => String(m) !== String(currentUserId));
    try {
      const message = await sendConversationMessage(currentChat._id, { text: newMessage.trim() });
      setMessages((prev) => [...prev, message]);
      socket.emit("sendMessage", {
        senderId: currentUserId,
        receiverId: otherId,
        text: newMessage.trim(),
        conversationId: currentChat._id,
      });
      setNewMessage("");
      loadConversations();
    } catch (_error) {
      toast.error("Failed to send message");
    }
  };

  const handleRespondOffer = async (offerId, status) => {
    try {
      const updated = await respondToProductOffer(offerId, status);
      setOffers((prev) => prev.map((o) => (o.offerId === offerId ? updated : o)));
      if (currentChat) await loadThread(currentChat);
      toast.success(status === "accepted" ? "Offer accepted" : "Offer updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Offer action failed");
    }
  };

  const handleCounterOffer = (offer) => {
    setOfferModal({ type: "counter", parent: offer });
    setOfferAmount(String(offer.amount || ""));
    setOfferMessage("");
  };

  const submitOffer = async (e) => {
    e.preventDefault();
    if (!currentChat || !offerAmount) return;
    try {
      if (offerModal?.type === "counter") {
        await counterProductOffer(offerModal.parent.offerId, {
          amount: Number(offerAmount),
          message: offerMessage,
        });
      } else {
        await createProductOffer({
          productId: currentChat.productId,
          conversationId: currentChat._id,
          amount: Number(offerAmount),
          message: offerMessage,
          productSnapshot: currentChat.productSnapshot,
        });
      }
      setOfferModal(null);
      setOfferAmount("");
      setOfferMessage("");
      if (currentChat) await loadThread(currentChat);
      toast.success("Offer sent");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not send offer");
    }
  };

  const handleCheckout = (offer) => {
    navigate(`/checkout?offerId=${offer.offerId}&token=${offer.priceLockToken}`);
  };

  const toggleArchive = async () => {
    if (!currentChat) return;
    try {
      if (showArchived) {
        await unarchiveConversation(currentChat._id);
      } else {
        await archiveConversation(currentChat._id);
      }
      setCurrentChat(null);
      setMobileShowThread(false);
      loadConversations();
    } catch (_error) {
      toast.error("Could not update archive");
    }
  };

  if (!currentUserId) {
    return (
      <div className="mc-empty">
        <p>Please sign in to view messages.</p>
      </div>
    );
  }

  return (
    <div className="mc-root">
      <div className={`mc-sidebar ${mobileShowThread ? "mc-sidebar--hidden-mobile" : ""}`}>
        <div className="mc-sidebar__header">
          <h1 className="mc-title">{title}</h1>
          <div className="mc-search">
            <AiOutlineSearch aria-hidden="true" />
            <input
              type="search"
              placeholder="Search conversations"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search conversations"
            />
          </div>
          <button
            type="button"
            className="mc-archive-toggle"
            onClick={() => setShowArchived((v) => !v)}
          >
            <IoArchiveOutline aria-hidden="true" />
            {showArchived ? "Active" : "Archived"}
          </button>
        </div>

        <div className="mc-conversation-list" role="list">
          {loading && <p className="mc-muted">Loading...</p>}
          {!loading && conversations.length === 0 && (
            <div className="mc-empty">
              <p>No conversations yet.</p>
              <p className="mc-muted">Contact a seller from any product page.</p>
            </div>
          )}
          {conversations.map((chat) => (
            <button
              key={chat._id}
              type="button"
              role="listitem"
              className={`mc-conversation-item ${currentChat?._id === chat._id ? "is-active" : ""}`}
              onClick={() => openConversation(chat)}
            >
              <div className="mc-conversation-item__top">
                <span className="mc-conversation-item__name">
                  {chat.productSnapshot?.name || "Product conversation"}
                </span>
                {chat.unreadCount > 0 && (
                  <span className="mc-badge">{chat.unreadCount}</span>
                )}
              </div>
              <p className="mc-conversation-item__preview">{chat.lastMessage || "No messages yet"}</p>
              <div className="mc-conversation-item__meta">
                <span className={onlineCheck(chat) ? "mc-online" : "mc-offline"}>
                  {onlineCheck(chat) ? "Online" : "Offline"}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={`mc-thread ${mobileShowThread ? "mc-thread--visible-mobile" : ""}`}>
        {!currentChat ? (
          <div className="mc-thread-empty">
            <p>Select a conversation to start messaging</p>
          </div>
        ) : (
          <>
            <header className="mc-thread__header">
              <button
                type="button"
                className="mc-back-mobile"
                onClick={() => setMobileShowThread(false)}
                aria-label="Back to conversations"
              >
                <AiOutlineArrowLeft />
              </button>
              <div>
                <h2>{currentChat.productSnapshot?.name || "Conversation"}</h2>
                <span className={onlineCheck(currentChat) ? "mc-online" : "mc-offline"}>
                  {onlineCheck(currentChat) ? "Online" : "Offline"}
                </span>
              </div>
              <div className="mc-thread__actions">
                <button type="button" className="mc-btn mc-btn--ghost" onClick={toggleArchive}>
                  Archive
                </button>
                {currentChat.productId && (
                  <button
                    type="button"
                    className="mc-btn mc-btn--ghost"
                    onClick={() => {
                      setOfferModal({ type: "create" });
                      setOfferAmount("");
                      setOfferMessage("");
                    }}
                  >
                    Make offer
                  </button>
                )}
              </div>
            </header>

            {currentChat.productSnapshot && (
              <Link to={`/product/${currentChat.productId}`} className="mc-product-preview">
                {currentChat.productSnapshot.image && (
                  <img src={currentChat.productSnapshot.image} alt="" />
                )}
                <div>
                  <strong>{currentChat.productSnapshot.name}</strong>
                  <span>{formatAmount(currentChat.productSnapshot.price)}</span>
                </div>
              </Link>
            )}

            <div className="mc-messages" role="log" aria-live="polite">
              {messages.map((msg) => {
                const isMine = String(msg.sender) === String(currentUserId);
                const linkedOffer = msg.offerId ? offersById[msg.offerId] : null;
                return (
                  <div
                    key={msg._id || `${msg.createdAt}-${msg.text}`}
                    className={`mc-message ${isMine ? "mc-message--mine" : "mc-message--theirs"}`}
                  >
                    {msg.messageType === "offer" && linkedOffer ? (
                      <OfferCard
                        offer={linkedOffer}
                        currentUserId={currentUserId}
                        onRespond={handleRespondOffer}
                        onCounter={handleCounterOffer}
                        onCheckout={handleCheckout}
                      />
                    ) : (
                      <div className="mc-message__bubble">
                        <p>{msg.text}</p>
                        {msg.images?.url && (
                          <img src={msg.images.url} alt="Attachment" className="mc-message__image" />
                        )}
                      </div>
                    )}
                    <time className="mc-message__time">
                      {msg.createdAt ? format(msg.createdAt) : "Just now"}
                    </time>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <form className="mc-composer" onSubmit={sendMessage}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                aria-label="Message"
              />
              <button type="submit" className="mc-btn mc-btn--primary" aria-label="Send">
                <AiOutlineSend />
              </button>
            </form>
          </>
        )}
      </div>

      {offerModal && (
        <div className="mc-modal-backdrop" role="dialog" aria-modal="true">
          <form className="mc-modal" onSubmit={submitOffer}>
            <h3>{offerModal.type === "counter" ? "Counter offer" : "Make an offer"}</h3>
            <label>
              Amount (RWF)
              <input
                type="number"
                min="1"
                required
                value={offerAmount}
                onChange={(e) => setOfferAmount(e.target.value)}
              />
            </label>
            <label>
              Message (optional)
              <textarea
                rows={3}
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
              />
            </label>
            <div className="mc-modal__actions">
              <button type="button" className="mc-btn mc-btn--ghost" onClick={() => setOfferModal(null)}>
                Cancel
              </button>
              <button type="submit" className="mc-btn mc-btn--primary">
                Send offer
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MessagingCenter;
