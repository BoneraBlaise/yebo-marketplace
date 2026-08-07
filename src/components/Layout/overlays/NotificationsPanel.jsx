import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  IoBagOutline,
  IoChatbubbleOutline,
  IoNotificationsOutline,
  IoPricetagOutline,
} from "react-icons/io5";
import { format } from "timeago.js";
import HeaderDropdownPanel from "./HeaderDropdownPanel";
import {
  fetchNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../../services/communicationService";

const iconForType = (type) => {
  if (type?.includes("offer") || type?.includes("message")) return IoChatbubbleOutline;
  if (type?.includes("order") || type?.includes("delivery")) return IoBagOutline;
  return IoPricetagOutline;
};

const NotificationsPanel = memo(({ onClose, isAuthenticated }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await fetchNotifications({ limit: 20 });
      setItems(data.items || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (_error) {
      setItems([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const displayItems = useMemo(
    () =>
      items.map((item) => ({
        id: item._id,
        title: item.title,
        body: item.body,
        time: item.createdAt ? format(item.createdAt) : "",
        unread: !item.read,
        icon: iconForType(item.type),
        link: item.link,
      })),
    [items]
  );

  const handleOpen = async (item) => {
    if (item.unread) {
      try {
        await markNotificationRead(item.id);
        setItems((prev) =>
          prev.map((n) => (n._id === item.id ? { ...n, read: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (_error) {
        // non-blocking
      }
    }
    onClose?.();
    if (item.link) navigate(item.link);
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsRead();
      setItems((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (_error) {
      // non-blocking
    }
  };

  return (
    <HeaderDropdownPanel
      className="yebone-header-dropdown--wide yebone-header-notifications"
      ariaLabel="Notifications"
      role="region"
    >
      <div className="yebone-header-notifications__header">
        <h3 className="yebone-header-notifications__title">Notifications</h3>
        {unreadCount > 0 && (
          <span className="yebone-header-notifications__unread">
            {unreadCount} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="yebone-header-notifications__empty" aria-busy="true" aria-label="Loading notifications">
          <div className="yebone-header-notifications__skeleton">
            {[0, 1, 2].map((i) => (
              <div key={i} className="yebone-header-notifications__skeleton-row">
                <span className="yebone-header-notifications__skeleton-icon" />
                <span className="yebone-header-notifications__skeleton-lines">
                  <span className="yebone-header-notifications__skeleton-line yebone-header-notifications__skeleton-line--short" />
                  <span className="yebone-header-notifications__skeleton-line" />
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : displayItems.length === 0 ? (
        <div className="yebone-header-notifications__empty">
          <IoNotificationsOutline
            size={28}
            className="mx-auto mb-3 text-yebone-primary dark:text-yebone-accent"
            aria-hidden="true"
          />
          <p className="yebone-header-notifications__empty-title">All caught up</p>
          <p className="yebone-header-notifications__empty-text">
            New order updates and offers will appear here.
          </p>
        </div>
      ) : (
        <div className="yebone-header-notifications__list" role="list">
          {displayItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`yebone-header-notifications__item${
                  item.unread ? " is-unread" : " is-read"
                }`}
                onClick={() => handleOpen(item)}
              >
                <span className="yebone-header-notifications__icon" aria-hidden="true">
                  <Icon size={18} />
                </span>
                <span className="yebone-header-notifications__content">
                  <p className="yebone-header-notifications__item-title">{item.title}</p>
                  <p className="yebone-header-notifications__item-body">{item.body}</p>
                  <span className="yebone-header-notifications__item-time">{item.time}</span>
                </span>
                {item.unread && (
                  <span className="yebone-header-notifications__dot" aria-label="Unread" />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="yebone-header-notifications__footer">
        {unreadCount > 0 && (
          <button
            type="button"
            className="yebone-header-notifications__view-all mr-3"
            onClick={handleMarkAllRead}
          >
            Mark all read
          </button>
        )}
        <Link
          to={isAuthenticated ? "/inbox" : "/login"}
          className="yebone-header-notifications__view-all"
          onClick={onClose}
        >
          Open messages
        </Link>
      </div>
    </HeaderDropdownPanel>
  );
});

NotificationsPanel.displayName = "NotificationsPanel";

export default NotificationsPanel;
