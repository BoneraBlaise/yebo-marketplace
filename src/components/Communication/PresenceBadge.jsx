import React from "react";
import { format } from "timeago.js";

/**
 * Presentation-only presence indicator — uses socket-derived status client-side.
 * status: online | offline | away (away only when explicitly passed)
 */
const PresenceBadge = ({
  status = "offline",
  lastSeen = null,
  compact = false,
  dotOnly = false,
  animated = false,
  className = "",
}) => {
  const safeStatus = ["online", "offline", "away"].includes(status) ? status : "offline";

  let label = safeStatus === "online" ? "Online" : safeStatus === "away" ? "Away" : "Offline";
  if (safeStatus === "offline" && lastSeen) {
    try {
      label = `Last seen ${format(new Date(lastSeen))}`;
    } catch {
      label = "Offline";
    }
  }

  return (
    <span
      className={`mc-presence mc-presence--${safeStatus}${compact ? " mc-presence--compact" : ""}${dotOnly ? " mc-presence--dot-only" : ""}${animated ? " mc-presence--animated" : ""} ${className}`.trim()}
      role="status"
      aria-label={label}
    >
      <span className="mc-presence__dot" aria-hidden="true" />
      {!dotOnly && <span className="mc-presence__label">{label}</span>}
    </span>
  );
};

export default PresenceBadge;
