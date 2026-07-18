import React from "react";
import Loader from "../Layout/Loader";
import DashboardEmptyState from "../Dashboard/DashboardEmptyState";
import { Button } from "../ui";

export const OrderLoadingState = ({ label = "Loading orders..." }) => (
  <div className="py-10">
    <Loader />
    <p className="text-center text-sm text-gray-500 mt-4">{label}</p>
  </div>
);

export const OrderErrorState = ({
  message = "Unable to load orders.",
  onRetry,
}) => (
  <div className="dashboard-section yebone-surface text-center py-10 px-4">
    <p className="text-red-600 dark:text-red-400 font-medium">{message}</p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline" className="mt-4 yebone-btn-lift">
        Try again
      </Button>
    )}
  </div>
);

export const OrderEmptyState = ({
  title = "No orders yet",
  message = "When you place orders, they'll appear here.",
  actionLabel = "Browse products",
  actionTo = "/products",
}) => (
  <DashboardEmptyState
    title={title}
    message={message}
    actionLabel={actionLabel}
    actionTo={actionTo}
  />
);

export default OrderLoadingState;
