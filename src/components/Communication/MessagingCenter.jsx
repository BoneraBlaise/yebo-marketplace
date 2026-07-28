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
  AiOutlinePaperClip,
  AiOutlineSmile,
} from "react-icons/ai";
import { IoArchiveOutline, IoPricetagOutline, IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineInbox } from "react-icons/hi";
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
import { notifyInboxRefresh, optimizeProductImage } from "../../utils/productImageUtils";
import "./messaging-center.css";

const readAuthCookie = () => {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|; )(?:token|seller_token)=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
};

const sortMessages = (items) =>
  [...items].sort(
    (a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
  );

const formatAmount = (amount, currency = "RWF") =>
  `${Number(amount || 0).toLocaleString()} ${currency}`;

const formatTime = (date) => {
  if (!date) return "";
  try {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

const otherMemberId = (chat, currentUserId) =>
  (chat?.members || []).find((m) => String(m) !== String(currentUserId));

const isMessageRead = (msg, otherId) => {
  if (!otherId || !msg?.readBy) return false;
  return msg.readBy.map(String).includes(String(otherId));
};

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
  const conversationParam = searchParams.get("conversation") || null;

  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [offers, setOffers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [offerModal, setOfferModal] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const currentChatRef = useRef(null);

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const offersById = useMemo(() => {
    const map = {};
    for (const offer of offers) map[offer.offerId] = offer;
    return map;
  }, [offers]);

  const loadConversations = useCallback(async () => {
    if (!currentUserId) return;
    setLoading(true);
    try {
      const data = await fetchConversations({ search: debouncedSearch, includeArchived: showArchived });
      setConversations(data);
    } catch (_error) {
      toast.error("Could not load conversations");
    } finally {
      setLoading(false);
    }
  }, [currentUserId, debouncedSearch, showArchived]);

  const loadThread = useCallback(async (conversation) => {
    if (!conversation?._id) return;
    try {
      const [messageData, offerData] = await Promise.all([
        fetchMessages(conversation._id),
        fetchOfferHistory(conversation._id),
      ]);
      setMessages(sortMessages(messageData));
      setOffers(offerData);
      setConversations((prev) =>
        prev.map((c) => (String(c._id) === String(conversation._id) ? { ...c, unreadCount: 0 } : c))
      );
      notifyInboxRefresh();
    } catch (_error) {
      toast.error("Could not load messages");
    }
  }, []);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!currentUserId) return undefined;
    const token = readAuthCookie();
    if (!token) return undefined;

    const socket = socketIO(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: { token },
    });
    socketRef.current = socket;

    const refreshAll = () => {
      loadConversations();
      notifyInboxRefresh();
      const active = currentChatRef.current;
      if (active?._id) loadThread(active);
    };

    const onUsers = (data) => setOnlineUsers(data || []);
    const onMessage = (data) => {
      const incoming = data.message || data;
      const incomingId = incoming?._id;
      const convId = data.conversationId;

      loadConversations();
      notifyInboxRefresh();

      if (currentChatRef.current && String(convId) === String(currentChatRef.current._id)) {
        setMessages((prev) => {
          if (incomingId && prev.some((m) => m._id === incomingId)) return prev;
          return sortMessages([...prev, incoming]);
        });
      }
    };
    const onNotification = () => {
      loadConversations();
      notifyInboxRefresh();
    };
    const onTyping = (data) => {
      if (
        currentChatRef.current &&
        String(data?.conversationId) === String(currentChatRef.current._id) &&
        String(data?.userId) !== String(currentUserId)
      ) {
        setIsTyping(Boolean(data?.typing));
        window.setTimeout(() => setIsTyping(false), 3000);
      }
    };
    const onConnect = () => refreshAll();

    socket.on("connect", onConnect);
    socket.on("getUsers", onUsers);
    socket.on("getMessage", onMessage);
    socket.on("notification", onNotification);
    socket.on("typing", onTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("getUsers", onUsers);
      socket.off("getMessage", onMessage);
      socket.off("notification", onNotification);
      socket.off("typing", onTyping);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, loadConversations, loadThread]);

  useEffect(() => {
    if (!conversationParam || !conversations.length) return;
    const match = conversations.find((c) => String(c._id) === String(conversationParam));
    if (match && String(currentChat?._id) !== String(match._id)) {
      setCurrentChat(match);
      setMobileShowThread(true);
      loadThread(match);
    }
  }, [conversationParam, conversations, loadThread, currentChat?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const onlineCheck = (chat) => {
    const otherId = otherMemberId(chat, currentUserId);
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
    const text = newMessage.trim();
    if (!text || !currentChat || sending) return;

    const tempId = `pending-${Date.now()}`;
    const optimistic = {
      _id: tempId,
      text,
      sender: currentUserId,
      createdAt: new Date().toISOString(),
      pending: true,
      readBy: [String(currentUserId)],
    };

    setMessages((prev) => sortMessages([...prev, optimistic]));
    setNewMessage("");
    setSending(true);

    try {
      const message = await sendConversationMessage(currentChat._id, { text });
      setMessages((prev) =>
        sortMessages(prev.map((m) => (m._id === tempId ? message : m)).filter((m, i, arr) => {
          if (!m._id) return true;
          return arr.findIndex((x) => x._id === m._id) === i;
        }))
      );
      loadConversations();
      notifyInboxRefresh();
    } catch (_error) {
      setMessages((prev) => prev.filter((m) => m._id !== tempId));
      setNewMessage(text);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
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

  const otherId = currentChat ? otherMemberId(currentChat, currentUserId) : null;
  const productImage = currentChat?.productSnapshot?.image
    ? optimizeProductImage(currentChat.productSnapshot.image, "thumb")
    : null;

  if (!currentUserId) {
    return (
      <div className="mc-empty-state">
        <div className="mc-empty-state__icon">
          <IoChatbubblesOutline size={32} />
        </div>
        <h3>Sign in to message</h3>
        <p>Connect with sellers about products, offers, and orders.</p>
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
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
            <div className="mc-empty-state mc-empty-state--compact">
              <div className="mc-empty-state__icon">
                <HiOutlineInbox size={28} />
              </div>
              <h3>No conversations yet</h3>
              <p>Contact a seller from any product page to start chatting.</p>
              <Link to="/products" className="mc-btn mc-btn--primary mc-empty-state__cta">
                Browse products
              </Link>
            </div>
          )}
          {conversations.map((chat) => {
            const thumb = chat.productSnapshot?.image
              ? optimizeProductImage(chat.productSnapshot.image, "thumb")
              : null;
            return (
              <button
                key={chat._id}
                type="button"
                role="listitem"
                className={`mc-conversation-item ${currentChat?._id === chat._id ? "is-active" : ""} ${chat.unreadCount > 0 ? "has-unread" : ""}`}
                onClick={() => openConversation(chat)}
              >
                <div className="mc-conversation-item__thumb">
                  {thumb ? (
                    <img src={thumb} alt="" />
                  ) : (
                    <span className="mc-conversation-item__thumb-fallback">
                      <IoChatbubblesOutline />
                    </span>
                  )}
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
                  <p className="mc-conversation-item__preview">{chat.lastMessage || "No messages yet"}</p>
                  <div className="mc-conversation-item__meta">
                    <span className={onlineCheck(chat) ? "mc-online" : "mc-offline"}>
                      {onlineCheck(chat) ? "Online" : "Offline"}
                    </span>
                    {chat.unreadCount > 0 && (
                      <span className="mc-badge">{chat.unreadCount}</span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className={`mc-thread ${mobileShowThread ? "mc-thread--visible-mobile" : ""}`}>
        {!currentChat ? (
          <div className="mc-empty-state">
            <div className="mc-empty-state__icon">
              <IoChatbubblesOutline size={36} />
            </div>
            <h3>Select a conversation</h3>
            <p>Pick a thread from the left to view messages, offers, and product details.</p>
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
              <div className="mc-thread__avatar">
                {productImage ? (
                  <img src={productImage} alt="" />
                ) : (
                  <span>{(currentChat.productSnapshot?.name || "P").charAt(0)}</span>
                )}
                <span className={`mc-thread__presence ${onlineCheck(currentChat) ? "is-online" : ""}`} />
              </div>
              <div className="mc-thread__identity">
                <h2>{currentChat.productSnapshot?.name || "Conversation"}</h2>
                <span className={onlineCheck(currentChat) ? "mc-online" : "mc-offline"}>
                  {onlineCheck(currentChat) ? "Online now" : "Offline"}
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
                {productImage && <img src={productImage} alt="" />}
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
                const read = isMine && isMessageRead(msg, otherId);
                return (
                  <div
                    key={msg._id || `${msg.createdAt}-${msg.text}`}
                    className={`mc-message ${isMine ? "mc-message--mine" : "mc-message--theirs"} ${msg.pending ? "mc-message--pending" : ""} ${msg.failed ? "mc-message--failed" : ""}`}
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
                    <div className="mc-message__meta">
                      <time>{msg.createdAt ? formatTime(msg.createdAt) : "Now"}</time>
                      {isMine && (
                        <span className="mc-message__status">
                          {msg.pending ? "Sending…" : read ? "Read" : "Delivered"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="mc-typing" aria-live="polite">
                  <span /><span /><span />
                  Typing…
                </div>
              )}
              <div ref={scrollRef} />
            </div>

            <form className="mc-composer" onSubmit={sendMessage}>
              <button type="button" className="mc-composer__icon" aria-label="Attach file" title="Attach file">
                <AiOutlinePaperClip size={20} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message…"
                aria-label="Message"
                disabled={sending}
              />
              <button type="button" className="mc-composer__icon" aria-label="Emoji" title="Emoji">
                <AiOutlineSmile size={20} />
              </button>
              <button
                type="submit"
                className="mc-btn mc-btn--primary mc-composer__send"
                aria-label="Send"
                disabled={sending || !newMessage.trim()}
              >
                <AiOutlineSend size={18} />
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
