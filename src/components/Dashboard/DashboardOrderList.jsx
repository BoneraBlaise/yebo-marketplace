import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { MdTrackChanges } from "react-icons/md";
import { Badge, Button } from "../ui";
import DashboardEmptyState from "./DashboardEmptyState";

const statusVariant = (status) => {
  const s = (status || "").toLowerCase();
  if (s.includes("deliver")) return "primary";
  if (s.includes("refund")) return "gold";
  if (s.includes("process") || s.includes("ship")) return "outline";
  return "muted";
};

const DashboardOrderList = ({
  orders = [],
  emptyTitle = "No orders yet",
  emptyMessage = "When you place orders, they'll appear here.",
  showTrack = false,
}) => {
  if (!orders.length) {
    return (
      <DashboardEmptyState
        title={emptyTitle}
        message={emptyMessage}
        actionLabel="Browse products"
        actionTo="/products"
      />
    );
  }

  return (
    <div className="space-y-3">
      <div className="hidden md:grid grid-cols-[72px_1.2fr_1fr_0.8fr_0.8fr_0.7fr_auto] gap-4 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
        <span>Product</span>
        <span>Order</span>
        <span>Seller</span>
        <span>Status</span>
        <span>Date</span>
        <span>Total</span>
        <span>Actions</span>
      </div>

      {orders.map((order) => {
        const firstItem = order.cart?.[0];
        const imageUrl = firstItem?.images?.[0]?.url;
        const sellerName = firstItem?.shop?.name || order?.user?.name || "Yebone Seller";

        return (
          <div key={order._id} className="dashboard-order-row yebone-card-lift">
            <div className="flex items-center gap-3 md:block">
              <div className="w-14 h-14 md:w-[72px] md:h-[72px] rounded-xl overflow-hidden bg-yebone-light-gray shrink-0">
                {imageUrl ? (
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full yebone-skeleton" />
                )}
              </div>
              <div className="md:hidden flex-1 min-w-0">
                <p className="font-medium text-sm truncate dark:text-white">
                  #{order._id?.slice(0, 8)}
                </p>
                <Badge variant={statusVariant(order.status)} className="mt-1">
                  {order.status}
                </Badge>
              </div>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Order ID</p>
              <p className="font-medium text-sm dark:text-white">#{order._id?.slice(0, 10)}</p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.cart?.length || 0} item{(order.cart?.length || 0) === 1 ? "" : "s"}
              </p>
            </div>

            <div className="hidden md:block">
              <p className="text-xs text-gray-500 dark:text-gray-400">Seller</p>
              <p className="text-sm dark:text-gray-200 truncate">{sellerName}</p>
            </div>

            <div className="hidden md:block">
              <Badge variant={statusVariant(order.status)}>{order.status}</Badge>
              <p className="text-[11px] text-gray-500 mt-1">
                {order.paymentInfo?.status || "Payment pending"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Date</p>
              <p className="text-sm dark:text-gray-200">
                {order.createdAt?.slice(0, 10) || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400 hidden md:block">Total</p>
              <p className="font-bold text-yebone-primary">RWF {order.totalPrice}</p>
            </div>

            <div className="flex flex-wrap gap-2 md:justify-end">
              {showTrack && (
                <Link to={`/user/track/order/${order._id}`}>
                  <Button variant="outline" size="sm" className="yebone-btn-lift">
                    <MdTrackChanges size={16} className="mr-1" />
                    Track
                  </Button>
                </Link>
              )}
              <Link to={`/user/order/${order._id}`}>
                <Button size="sm" className="yebone-btn-lift">
                  Details
                  <AiOutlineArrowRight size={14} className="ml-1" />
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardOrderList;
