import { useCallback, useEffect, useState } from "react";
import { fetchConversationUnreadCount } from "../services/communicationService";

/** Unread conversation count for header inbox badge */
const useInboxUnreadCount = (enabled = true) => {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setCount(0);
      return;
    }
    try {
      const next = await fetchConversationUnreadCount();
      setCount(typeof next === "number" ? next : 0);
    } catch {
      setCount(0);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 60_000);
    const onRefresh = () => refresh();
    window.addEventListener("inbox:refresh", onRefresh);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("inbox:refresh", onRefresh);
    };
  }, [refresh]);

  return { count, refresh };
};

export default useInboxUnreadCount;
