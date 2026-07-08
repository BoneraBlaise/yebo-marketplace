import React, { memo, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  IoBagOutline,
  IoNotificationsOutline,
  IoPricetagOutline,
  IoSparklesOutline,
} from "react-icons/io5";
import HeaderDropdownPanel from "./HeaderDropdownPanel";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    title: "Order shipped",
    body: "Your order #4821 is on the way to Kigali.",
    time: "2 hours ago",
    unread: true,
    icon: IoBagOutline,
  },
  {
    id: "2",
    title: "Price drop alert",
    body: "An item in your wishlist is now 15% off.",
    time: "Yesterday",
    unread: true,
    icon: IoPricetagOutline,
  },
  {
    id: "3",
    title: "YEBO picked for you",
    body: "New AI recommendations based on your recent browsing.",
    time: "3 days ago",
    unread: false,
    icon: IoSparklesOutline,
  },
];

const NotificationsPanel = memo(({ onClose, isAuthenticated }) => {
  const [items, setItems] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => items.filter((item) => item.unread).length,
    [items]
  );

  const markRead = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unread: false } : item))
    );
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

      {items.length === 0 ? (
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
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                role="listitem"
                className={`yebone-header-notifications__item${
                  item.unread ? " is-unread" : " is-read"
                }`}
                onClick={() => markRead(item.id)}
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
        <Link
          to={isAuthenticated ? "/profile" : "/login"}
          className="yebone-header-notifications__view-all"
          onClick={onClose}
        >
          View all notifications
        </Link>
      </div>
    </HeaderDropdownPanel>
  );
});

NotificationsPanel.displayName = "NotificationsPanel";

export default NotificationsPanel;
