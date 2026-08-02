import React from "react";
import useInboxRealtimeSync from "../../hooks/useInboxRealtimeSync";

/** Mounts global inbox socket listeners (badges + toasts off-page). */
const InboxRealtimeBridge = () => {
  useInboxRealtimeSync();
  return null;
};

export default InboxRealtimeBridge;
