import React from "react";
import { HiOutlineBell } from "react-icons/hi";
import DashboardEmptyState from "./DashboardEmptyState";
import { Badge } from "../ui";

const PLACEHOLDER_NOTIFICATIONS = [];

const DashboardNotifications = () => {
  const notifications = PLACEHOLDER_NOTIFICATIONS;

  if (!notifications.length) {
    return (
      <DashboardEmptyState
        icon={HiOutlineBell}
        title="No notifications yet"
        message="Order updates, promotions, and account alerts will appear here."
        actionLabel="Browse marketplace"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((n) => (
        <div
          key={n.id}
          className="dashboard-order-row yebone-surface flex items-start gap-3 !grid-cols-1"
        >
          {!n.read && <Badge variant="gold">New</Badge>}
          <div>
            <p className="font-medium text-sm dark:text-white">{n.title}</p>
            <p className="text-xs text-gray-500 mt-1">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DashboardNotifications;
