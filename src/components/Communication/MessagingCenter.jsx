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
import { IoArchiveOutline, IoChatbubblesOutline } from "react-icons/io5";
import { HiOutlineInbox, HiOutlinePhone, HiOutlineMenu } from "react-icons/hi";
import { socketUrl } from "../../config/serverConfig";
import { COMMUNICATION_IDENTITY, getTokenForIdentity } from "../../config/communicationIdentity";
import { inboxPathForIdentity } from "../../config/inboxIdentity";
import {
  archiveConversation,
  counterProductOffer,
  createProductOffer,
  fetchConversations,
  fetchMessages,
  fetchOfferHistory,
  respondToProductOffer,
  runWithCommunicationIdentity,
  sendConversationMessage,
  setActiveCommunicationIdentity,
  unarchiveConversation,
} from "../../services/communicationService";
import { notifyInboxRefresh, optimizeProductImage } from "../../utils/productImageUtils";
import {
  getCachedConversations,
  setCachedConversations,
  getCachedThread,
  setCachedThread,
  prefetchThread,
} from "../../utils/messagingCache";
import MessageToast from "./MessageToast";
import PresenceBadge from "./PresenceBadge";
import { ConversationRow, MessageRow } from "./MessagingParts";
import "./messaging-layout.css";
import "./messaging-center.css";
import "./messaging-mobile.css";

const modeToIdentity = (m) =>
  m === "seller" ? COMMUNICATION_IDENTITY.SELLER : COMMUNICATION_IDENTITY.BUYER;

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

const messageStatusLabel = (msg, isMine, otherId, onlineUsers) => {
  if (!isMine) return null;
  if (msg.pending) return "Sending…";
  if (msg.failed) return "Failed";
  if (isMessageRead(msg, otherId)) return "Seen";
  const otherOnline = (onlineUsers || []).some((u) => String(u.userId) === String(otherId));
  if (msg._id && !String(msg._id).startsWith("pending")) {
    return otherOnline ? "Delivered" : "Sent";
  }
  return null;
};

const previewSenderLabel = (chat, currentUserId, mode, seller, user) => {
  const senderId = chat?.lastMessageSenderId;
  if (!senderId) return null;
  if (String(senderId) === String(currentUserId)) return "You";
  if (mode === "seller") return "Customer";
  return seller?.name || "Seller";
};

const formatPreviewLine = (chat, currentUserId, mode, seller, user) => {
  const text = chat?.lastMessage || "No messages yet";
  const label = previewSenderLabel(chat, currentUserId, mode, seller, user);
  return label ? `${label}: ${text}` : text;
};

const MessagingCenter = ({ mode = "buyer", title = "Messages" }) => {
  const { user } = useSelector((state) => state.user);
  const { seller } = useSelector((state) => state.seller);
  const currentUserId = mode === "seller" ? seller?._id : user?._id;
  const communicationIdentity = modeToIdentity(mode);

  // Synchronous — must run before any REST call reads activeCommunicationIdentity.
  setActiveCommunicationIdentity(communicationIdentity);

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
  const lastSeenRef = useRef(new Map());
  const prevOnlineIdsRef = useRef(new Set());
  const [mobileShowThread, setMobileShowThread] = useState(false);
  const [offerModal, setOfferModal] = useState(null);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const socketRef = useRef(null);
  const currentChatRef = useRef(null);
  const communicationIdentityRef = useRef(communicationIdentity);
  const loadConversationsSeqRef = useRef(0);
  const loadThreadSeqRef = useRef(0);

  communicationIdentityRef.current = communicationIdentity;

  const withModeIdentity = useCallback(
    (fn) => runWithCommunicationIdentity(communicationIdentityRef.current, fn),
    []
  );

  const showIncomingToast = useCallback(
    (data) => {
      const convId = data?.conversationId;
      if (!convId) return;
      if (currentChatRef.current && String(convId) === String(currentChatRef.current._id)) {
        return;
      }

      const incoming = data.message || data;
      const senderId = String(incoming?.sender || data?.senderId || "");
      const isBuyerMode = mode === "buyer";
      let senderName = isBuyerMode ? seller?.name || "Seller" : "Customer";
      let avatarUrl = isBuyerMode ? seller?.avatar?.url : null;

      if (!isBuyerMode && senderId === String(user?._id)) {
        senderName = user?.name || "Customer";
        avatarUrl = user?.avatar?.url || null;
      }

      const snapshot = incoming?.productSnapshot || data?.productSnapshot;
      if (snapshot?.image) {
        avatarUrl = optimizeProductImage(snapshot.image, "thumb");
      }

      const preview = (incoming?.text || data?.text || "New message").slice(0, 80);
      const inboxPath = inboxPathForIdentity(communicationIdentity);

      toast(
        ({ closeToast }) => (
          <MessageToast
            senderName={senderName}
            preview={preview}
            avatarUrl={avatarUrl}
            closeToast={closeToast}
            onOpen={() => navigate(`${inboxPath}?conversation=${convId}`)}
          />
        ),
        {
          className: "mc-message-toast-container",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
        }
      );
    },
    [communicationIdentity, mode, navigate, seller, user]
  );

  useEffect(() => {
    currentChatRef.current = currentChat;
  }, [currentChat]);

  useEffect(() => {
    const currentIds = new Set(onlineUsers.map((u) => String(u.userId)));
    for (const id of prevOnlineIdsRef.current) {
      if (!currentIds.has(id)) {
        lastSeenRef.current.set(id, Date.now());
      }
    }
    prevOnlineIdsRef.current = currentIds;
  }, [onlineUsers]);

  const getPresence = useCallback(
    (userId) => {
      if (!userId) return { status: "offline", lastSeen: null };
      const id = String(userId);
      if (onlineUsers.some((u) => String(u.userId) === id)) {
        return { status: "online", lastSeen: null };
      }
      return { status: "offline", lastSeen: lastSeenRef.current.get(id) || null };
    },
    [onlineUsers]
  );

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
    const requestId = ++loadConversationsSeqRef.current;
    const identity = communicationIdentityRef.current;
    const cached = getCachedConversations(identity, debouncedSearch, showArchived);
    if (cached?.length) {
      setConversations(cached);
      setLoading(false);
    } else {
      setLoading(true);
    }
    try {
      const data = await withModeIdentity(() =>
        fetchConversations({ search: debouncedSearch, includeArchived: showArchived })
      );
      if (requestId !== loadConversationsSeqRef.current) return;
      setConversations(data);
      setCachedConversations(identity, debouncedSearch, showArchived, data);
    } catch (_error) {
      if (requestId !== loadConversationsSeqRef.current) return;
      if (!cached?.length) toast.error("Could not load conversations");
    } finally {
      if (requestId === loadConversationsSeqRef.current) {
        setLoading(false);
      }
    }
  }, [currentUserId, debouncedSearch, showArchived, withModeIdentity]);

  const loadThread = useCallback(async (conversation, { silent = false } = {}) => {
    if (!conversation?._id) return;
    const requestId = ++loadThreadSeqRef.current;
    const identity = communicationIdentityRef.current;
    const cached = getCachedThread(identity, conversation._id);
    if (cached?.messages) {
      setMessages(cached.messages);
      setOffers(cached.offers || []);
    }
    try {
      const [messageData, offerData] = await withModeIdentity(() =>
        Promise.all([
          fetchMessages(conversation._id),
          fetchOfferHistory(conversation._id),
        ])
      );
      if (requestId !== loadThreadSeqRef.current) return;
      const sorted = sortMessages(messageData);
      setMessages(sorted);
      setOffers(offerData);
      setCachedThread(identity, conversation._id, sorted, offerData);
      setConversations((prev) =>
        prev.map((c) => (String(c._id) === String(conversation._id) ? { ...c, unreadCount: 0 } : c))
      );
      notifyInboxRefresh(identity);
    } catch (_error) {
      if (requestId !== loadThreadSeqRef.current) return;
      if (!silent) toast.error("Could not load messages");
    }
  }, [withModeIdentity]);

  const prefetchConversationThread = useCallback(
    (conversation) => {
      if (!conversation?._id) return;
      const identity = communicationIdentityRef.current;
      prefetchThread(identity, conversation._id, () =>
        withModeIdentity(async () => {
          const [messageData, offerData] = await Promise.all([
            fetchMessages(conversation._id),
            fetchOfferHistory(conversation._id),
          ]);
          return { messages: sortMessages(messageData), offers: offerData };
        })
      );
    },
    [withModeIdentity]
  );

  useEffect(() => {
    if (!conversations.length) return;
    conversations.slice(0, 4).forEach((c) => prefetchConversationThread(c));
  }, [conversations, prefetchConversationThread]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    return () => setActiveCommunicationIdentity(COMMUNICATION_IDENTITY.BUYER);
  }, []);

  useEffect(() => {
    if (!currentUserId) return undefined;
    const token = getTokenForIdentity(modeToIdentity(mode));
    if (!token) return undefined;

    const socket = socketIO(socketUrl, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: { token },
    });
    socketRef.current = socket;

    const refreshAll = () => {
      loadConversations();
      notifyInboxRefresh(communicationIdentityRef.current);
      const active = currentChatRef.current;
      if (active?._id) loadThread(active);
    };

    const onUsers = (data) => setOnlineUsers(data || []);
    const onMessage = (data) => {
      const incoming = data.message || data;
      const incomingId = incoming?._id;
      const convId = data.conversationId;
      const isActive =
        currentChatRef.current && String(convId) === String(currentChatRef.current._id);

      setConversations((prev) =>
        prev.map((c) => {
          if (String(c._id) !== String(convId)) return c;
          return {
            ...c,
            lastMessage: incoming?.text || data.text || c.lastMessage,
            lastMessageSenderId: String(incoming?.sender || data.senderId || c.lastMessageSenderId || ""),
            updatedAt: incoming?.createdAt || data.createdAt || new Date().toISOString(),
            unreadCount: isActive ? 0 : Number(c.unreadCount || 0) + 1,
          };
        })
      );

      notifyInboxRefresh(communicationIdentityRef.current);

      if (isActive) {
        setMessages((prev) => {
          if (incomingId && prev.some((m) => m._id === incomingId)) return prev;
          return sortMessages([...prev, incoming]);
        });
        loadThread(currentChatRef.current);
      } else {
        showIncomingToast(data);
        loadConversations();
      }
    };
    const onNotification = () => {
      loadConversations();
      notifyInboxRefresh(communicationIdentityRef.current);
    };
    const onConversationRead = (data) => {
      if (!data?.conversationId || !data?.readBy) return;
      if (
        currentChatRef.current &&
        String(data.conversationId) === String(currentChatRef.current._id)
      ) {
        setMessages((prev) =>
          prev.map((m) => {
            if (String(m.sender) !== String(currentUserId)) return m;
            const readBy = [...(m.readBy || []).map(String)];
            if (!readBy.includes(String(data.readBy))) readBy.push(String(data.readBy));
            return { ...m, readBy };
          })
        );
      }
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
    socket.on("conversationRead", onConversationRead);
    socket.on("typing", onTyping);

    return () => {
      socket.off("connect", onConnect);
      socket.off("getUsers", onUsers);
      socket.off("getMessage", onMessage);
      socket.off("notification", onNotification);
      socket.off("conversationRead", onConversationRead);
      socket.off("typing", onTyping);
      socket.disconnect();
      socketRef.current = null;
    };
  }, [communicationIdentity, currentUserId, loadConversations, loadThread, showIncomingToast]);

  useEffect(() => {
    if (!conversationParam || !conversations.length) return;
    const match = conversations.find((c) => String(c._id) === String(conversationParam));
    if (match && String(currentChat?._id) !== String(match._id)) {
      const cached = getCachedThread(communicationIdentityRef.current, match._id);
      setCurrentChat(match);
      setMobileShowThread(true);
      if (cached?.messages) {
        setMessages(cached.messages);
        setOffers(cached.offers || []);
      }
      loadThread(match, { silent: Boolean(cached?.messages) });
    }
  }, [conversationParam, conversations, loadThread, currentChat?._id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 900px)");
    const syncFullscreen = () => {
      const active = mq.matches && mobileShowThread && Boolean(currentChat);
      document.body.classList.toggle("mc-mobile-thread-open", active);
    };
    syncFullscreen();
    mq.addEventListener("change", syncFullscreen);
    return () => {
      mq.removeEventListener("change", syncFullscreen);
      document.body.classList.remove("mc-mobile-thread-open");
    };
  }, [mobileShowThread, currentChat]);

  const closeMobileThread = () => {
    setMobileShowThread(false);
    setSearchParams({});
  };

  const onlineCheck = (chat) => getPresence(otherMemberId(chat, currentUserId)).status === "online";

  const openConversation = useCallback(
    async (chat) => {
      const identity = communicationIdentityRef.current;
      const cached = getCachedThread(identity, chat._id);
      const t0 = performance.now();

      setCurrentChat(chat);
      setMobileShowThread(true);
      setSearchParams({ conversation: chat._id });

      if (cached?.messages) {
        setMessages(cached.messages);
        setOffers(cached.offers || []);
        if (process.env.NODE_ENV === "development") {
          console.info(`[Messaging] thread cache hit ${Math.round(performance.now() - t0)}ms`);
        }
      }

      await loadThread(chat, { silent: Boolean(cached?.messages) });
    },
    [loadThread, setSearchParams]
  );

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
      const message = await withModeIdentity(() =>
        sendConversationMessage(currentChat._id, { text })
      );
      setMessages((prev) =>
        sortMessages(prev.map((m) => (m._id === tempId ? message : m)).filter((m, i, arr) => {
          if (!m._id) return true;
          return arr.findIndex((x) => x._id === m._id) === i;
        }))
      );
      loadConversations();
      notifyInboxRefresh(communicationIdentityRef.current);
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
      const updated = await withModeIdentity(() => respondToProductOffer(offerId, status));
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
        await withModeIdentity(() =>
          counterProductOffer(offerModal.parent.offerId, {
            amount: Number(offerAmount),
            message: offerMessage,
          })
        );
      } else {
        await withModeIdentity(() =>
          createProductOffer({
            productId: currentChat.productId,
            conversationId: currentChat._id,
            amount: Number(offerAmount),
            message: offerMessage,
            productSnapshot: currentChat.productSnapshot,
          })
        );
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
        await withModeIdentity(() => unarchiveConversation(currentChat._id));
      } else {
        await withModeIdentity(() => archiveConversation(currentChat._id));
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
    <div
      className={`mc-app mc-app--${mode}${mobileShowThread && currentChat ? " mc-app--thread-open" : ""}`}
    >
      <aside className={`mc-list-pane${mobileShowThread ? " mc-list-pane--hidden-mobile" : ""}`}>
        <header className="mc-list-head">
          <div className="mc-list-head__row">
            {mode === "seller" && (
              <button
                type="button"
                className="mc-list-head__menu lg:hidden"
                onClick={() => window.dispatchEvent(new CustomEvent("yebone:open-vendor-nav"))}
                aria-label="Open shop menu"
              >
                <HiOutlineMenu size={22} aria-hidden="true" />
              </button>
            )}
            <h1 className="mc-list-head__title">{title}</h1>
          </div>
          <div className="mc-list-head__tools">
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
        </header>

        <div className="mc-conversation-list" role="list">
          {loading && <p className="mc-muted">Loading...</p>}
          {!loading && conversations.length === 0 && (
            <div className="mc-empty-state mc-empty-state--compact">
              <div className="mc-empty-state__illustration" aria-hidden="true">
                <HiOutlineInbox size={28} />
              </div>
              <h3>No conversations yet</h3>
              <p>Start chatting with a seller from any product page.</p>
              <Link to="/products" className="mc-btn mc-btn--primary mc-empty-state__cta">
                Browse products
              </Link>
            </div>
          )}
          {conversations.map((chat) => {
            const thumb = chat.productSnapshot?.image
              ? optimizeProductImage(chat.productSnapshot.image, "thumb")
              : null;
            const otherId = otherMemberId(chat, currentUserId);
            const presence = getPresence(otherId);
            return (
              <ConversationRow
                key={chat._id}
                chat={chat}
                isActive={String(currentChat?._id) === String(chat._id)}
                thumb={thumb}
                preview={formatPreviewLine(chat, currentUserId, mode, seller, user)}
                presence={presence}
                unreadCount={chat.unreadCount || 0}
                onSelect={() => openConversation(chat)}
                onPrefetch={() => prefetchConversationThread(chat)}
              />
            );
          })}
        </div>
      </aside>

      <section className={`mc-chat-pane${mobileShowThread ? " mc-chat-pane--visible-mobile" : ""}`}>
        {!currentChat ? (
          <div className="mc-empty-state">
            <div className="mc-empty-state__illustration" aria-hidden="true">
              <IoChatbubblesOutline size={36} />
            </div>
            <h3>Select a conversation</h3>
            <p>Pick a thread from the list to view messages, offers, and product details.</p>
          </div>
        ) : (
          <>
            <header className="mc-mobile-chat-header">
              <button
                type="button"
                className="mc-mobile-chat-header__back"
                onClick={closeMobileThread}
                aria-label="Back to conversations"
              >
                <AiOutlineArrowLeft size={20} />
              </button>
              <div className="mc-mobile-chat-header__avatar">
                {productImage ? (
                  <img src={productImage} alt="" />
                ) : (
                  <span>{(currentChat.productSnapshot?.name || "P").charAt(0)}</span>
                )}
                <PresenceBadge
                  {...getPresence(otherId)}
                  dotOnly
                  animated
                  className="mc-mobile-chat-header__presence-dot"
                />
              </div>
              <div className="mc-mobile-chat-header__body">
                <h2 className="mc-mobile-chat-header__title">
                  {currentChat.productSnapshot?.name || "Conversation"}
                </h2>
                <div className="mc-mobile-chat-header__meta">
                  {currentChat.productSnapshot?.price != null && (
                    <p className="mc-mobile-chat-header__price">
                      {formatAmount(currentChat.productSnapshot.price)}
                    </p>
                  )}
                  <p className="mc-mobile-chat-header__seller">
                    {mode === "buyer" ? seller?.name || "Seller" : "Customer"}
                  </p>
                  <PresenceBadge
                    {...getPresence(otherId)}
                    compact
                    animated
                  />
                </div>
              </div>
            </header>

            <div className="mc-mobile-chat-toolbar">
              {currentChat.productId && (
                <Link to={`/product/${currentChat.productId}`} className="mc-btn mc-btn--ghost">
                  View product
                </Link>
              )}
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
              <button type="button" className="mc-btn mc-btn--ghost" onClick={toggleArchive}>
                Archive
              </button>
            </div>

            <header className="mc-product-header mc-product-header--desktop">
              <button
                type="button"
                className="mc-back-mobile"
                onClick={closeMobileThread}
                aria-label="Back to conversations"
              >
                <AiOutlineArrowLeft />
              </button>
              <div className="mc-product-header__media">
                {productImage ? (
                  <img src={productImage} alt="" />
                ) : (
                  <span>{(currentChat.productSnapshot?.name || "P").charAt(0)}</span>
                )}
                <span className={`mc-product-header__presence ${onlineCheck(currentChat) ? "is-online" : ""}`} />
              </div>
              <div className="mc-product-header__info">
                <div className="mc-product-header__title-row">
                  <h2>{currentChat.productSnapshot?.name || "Conversation"}</h2>
                  {currentChat.productSnapshot?.price != null && (
                    <p className="mc-product-header__price">
                      {formatAmount(currentChat.productSnapshot.price)}
                    </p>
                  )}
                </div>
                <p className="mc-product-header__seller">
                  <span className="mc-product-header__seller-name">
                    {mode === "buyer" ? seller?.name || "Seller" : "Customer"}
                  </span>
                  <PresenceBadge
                    status={getPresence(otherId).status}
                    lastSeen={getPresence(otherId).lastSeen}
                    compact
                  />
                </p>
              </div>
              <div className="mc-product-header__actions">
                {currentChat.productId && (
                  <Link to={`/product/${currentChat.productId}`} className="mc-btn mc-btn--ghost">
                    View product
                  </Link>
                )}
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
                <button
                  type="button"
                  className="mc-btn mc-btn--ghost mc-btn--disabled"
                  disabled
                  title="Coming soon"
                >
                  <HiOutlinePhone aria-hidden="true" />
                  Call
                </button>
                <button type="button" className="mc-btn mc-btn--ghost" onClick={toggleArchive}>
                  Archive
                </button>
              </div>
            </header>

            <div className="mc-messages" role="log" aria-live="polite">
              {messages.map((msg) => {
                const isMine = String(msg.sender) === String(currentUserId);
                const linkedOffer = msg.offerId ? offersById[msg.offerId] : null;
                const statusLabel = messageStatusLabel(msg, isMine, otherId, onlineUsers);
                return (
                  <MessageRow
                    key={msg._id || `${msg.createdAt}-${msg.text}`}
                    msg={msg}
                    isMine={isMine}
                    statusLabel={statusLabel}
                    linkedOffer={linkedOffer}
                    currentUserId={currentUserId}
                    onRespondOffer={handleRespondOffer}
                    onCounterOffer={handleCounterOffer}
                    onCheckout={handleCheckout}
                    formatTime={formatTime}
                  />
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

            <form className="mc-composer mc-composer--native" onSubmit={sendMessage}>
              <div className="mc-composer__bar">
                <button
                  type="button"
                  className="mc-composer__attach"
                  aria-label="Attach file"
                  title="Attach file"
                >
                  <AiOutlinePaperClip size={22} />
                </button>
                <div className="mc-composer__field">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message"
                    aria-label="Message"
                    disabled={sending}
                  />
                </div>
                <button
                  type="button"
                  className="mc-composer__emoji"
                  aria-label="Emoji"
                  title="Emoji"
                >
                  <AiOutlineSmile size={22} />
                </button>
                <button
                  type="submit"
                  className="mc-composer__send"
                  aria-label="Send"
                  disabled={sending || !newMessage.trim()}
                >
                  <AiOutlineSend size={18} />
                </button>
              </div>
            </form>

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
      </section>

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
