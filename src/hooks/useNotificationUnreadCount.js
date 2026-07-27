import { useCallback, useEffect, useState } from "react";
import { fetchNotificationUnreadCount } from "../services/communicationService";

const useNotificationUnreadCount = (enabled = true) => {
  const [count, setCount] = useState(0);

  const refresh = useCallback(async () => {
    if (!enabled) {
      setCount(0);
      return;
    }
    try {
      const next = await fetchNotificationUnreadCount();
      setCount(typeof next === "number" ? next : 0);
    } catch {
      setCount(0);
    }
  }, [enabled]);

  useEffect(() => {
    refresh();
    const id = window.setInterval(refresh, 60_000);
    return () => window.clearInterval(id);
  }, [refresh]);

  return { count, refresh };
};

export default useNotificationUnreadCount;
