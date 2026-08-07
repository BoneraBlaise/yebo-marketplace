import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import socketIO from "socket.io-client";
import { toast } from "react-toastify";
import { socketUrl } from "../config/serverConfig";
import { COMMUNICATION_IDENTITY, getTokenForIdentity } from "../config/communicationIdentity";
import { getAuthToken, getSellerToken } from "../config/authStorage";
import { inboxPathForIdentity } from "../config/inboxIdentity";
import { getUserAvatarUrl } from "../utils/userAvatar";
import MessageToast from "../components/Communication/MessageToast";

const isMessagingRoute = (pathname) =>
  pathname.startsWith("/inbox") || pathname.startsWith("/dashboard-messages");

/**
 * Global Socket.IO listener so header/sidebar badges update even off the inbox page.
 * No polling — socket events only.
 */
const useInboxRealtimeSync = () => {
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  const { isSeller, seller } = useSelector((state) => state.seller);
  const { user } = useSelector((state) => state.user);
  const activeConversationRef = useRef(null);
  const onMessagingPage = isMessagingRoute(pathname);

  useEffect(() => {
    const params = new URLSearchParams(search);
    activeConversationRef.current = params.get("conversation");
  }, [search]);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    const identities = [];
    if (getAuthToken()) identities.push(COMMUNICATION_IDENTITY.BUYER);
    if (isSeller && getSellerToken()) identities.push(COMMUNICATION_IDENTITY.SELLER);
    if (!identities.length) return undefined;

    const sockets = [];

    const showToast = (identity, data) => {
      if (onMessagingPage) return;
      const convId = data?.conversationId;
      if (!convId) return;
      if (isMessagingRoute(pathname) && activeConversationRef.current === String(convId)) {
        return;
      }

      const incoming = data?.message || data;
      const senderId = String(incoming?.sender || data?.senderId || "");
      const isBuyerIdentity = identity === COMMUNICATION_IDENTITY.BUYER;
      let senderName = "New message";
      let avatarUrl = null;

      if (isBuyerIdentity) {
        senderName = seller?.name || "Seller";
        avatarUrl = getUserAvatarUrl(seller);
        if (senderId && String(seller?._id) !== senderId) {
          senderName = "Seller";
        }
      } else {
        senderName = user?.name && senderId === String(user?._id) ? user.name : "Customer";
        avatarUrl =
          user?.avatar?.url && senderId === String(user?._id)
            ? getUserAvatarUrl(user)
            : null;
        if (senderId && String(user?._id) !== senderId) {
          senderName = "Customer";
        }
      }

      const snapshot = incoming?.productSnapshot || data?.productSnapshot;
      if (snapshot?.image) {
        avatarUrl = optimizeProductImage(snapshot.image, "thumb");
      }

      const preview = (incoming?.text || data?.text || "New message").slice(0, 80);
      const inboxPath = inboxPathForIdentity(identity);

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
    };

    for (const identity of identities) {
      const token = getTokenForIdentity(identity);
      if (!token) continue;

      const socket = socketIO(socketUrl, {
        transports: ["websocket", "polling"],
        autoConnect: true,
        auth: { token },
      });

      const onMessage = (data) => {
        notifyInboxRefresh(identity);
        showToast(identity, data);
      };

      const onNotification = () => notifyInboxRefresh(identity);

      socket.on("getMessage", onMessage);
      socket.on("notification", onNotification);
      sockets.push({ socket, onMessage, onNotification });
    }

    return () => {
      for (const { socket, onMessage, onNotification } of sockets) {
        socket.off("getMessage", onMessage);
        socket.off("notification", onNotification);
        socket.disconnect();
      }
    };
  }, [isAuthenticated, isSeller, navigate, onMessagingPage, seller, user]);
};

export default useInboxRealtimeSync;
