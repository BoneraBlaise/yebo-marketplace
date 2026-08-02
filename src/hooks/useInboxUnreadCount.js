import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { COMMUNICATION_IDENTITY } from "../config/communicationIdentity";
import { resolveInboxIdentity } from "../config/inboxIdentity";
import {
  fetchConversationUnreadCount,
  runWithCommunicationIdentity,
} from "../services/communicationService";

/** Unread conversation count for header / sidebar inbox badges — socket-driven, no polling. */
const useInboxUnreadCount = (enabled = true, identityOverride) => {
  const { pathname } = useLocation();
  const { isSeller } = useSelector((state) => state.seller);
  const identity =
    identityOverride || resolveInboxIdentity(pathname, isSeller);
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setCount(0);
      return;
    }
    try {
      const next = await runWithCommunicationIdentity(identity, fetchConversationUnreadCount);
      setCount(typeof next === "number" ? next : 0);
    } catch {
      setCount(0);
    }
  }, [enabled, identity]);

  useEffect(() => {
    refresh();
    const onRefresh = () => refresh();
    const onIdentityRefresh = (event) => {
      if (event?.detail?.identity === identity) refresh();
    };
    window.addEventListener("inbox:refresh", onRefresh);
    window.addEventListener("inbox:refresh:identity", onIdentityRefresh);
    return () => {
      window.removeEventListener("inbox:refresh", onRefresh);
      window.removeEventListener("inbox:refresh:identity", onIdentityRefresh);
    };
  }, [refresh, identity]);

  return { count, refresh, identity };
};

export { COMMUNICATION_IDENTITY };
export default useInboxUnreadCount;
