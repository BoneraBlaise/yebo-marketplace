import React from "react";
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Button, Badge } from "../ui";
import { getOrderStatusVariant } from "./orderStatus";

const getOrderType = (order) => {
  if (order.cart?.some((item) => item.isFlashSale)) return "Flash Sale";
  if (order.cart?.some((item) => item.isWonBid)) return "Auction Bid";
  return "Regular Order";
};

const getItemsQty = (order) =>
  (order.cart || []).reduce((total, item) => total + (item.qty || 1), 0);

const getOrderTotal = (order) => Number(order.totalPrice || 0);

const OrderSellerCardList = ({ orders = [] }) => (
  <div className="grid gap-4 lg:hidden">
    {orders.map((order) => (
      <div key={order._id} className="dashboard-section yebone-surface p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-gray-500">Order</p>
            <p className="font-semibold dark:text-white">#{order._id?.slice(0, 8)}</p>
          </div>
          <Badge variant={getOrderStatusVariant(order.status)}>{order.status}</Badge>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-gray-500 text-xs">Type</p>
            <p className="dark:text-white">{getOrderType(order)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Items</p>
            <p className="dark:text-white">{getItemsQty(order)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Total</p>
            <p className="font-bold text-yebone-primary">
              RWF {getOrderTotal(order).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs">Commission</p>
            <p className="dark:text-white">
              {order.referralCode ? "Applied" : "N/A"}
            </p>
          </div>
        </div>
        <Link to={`/order/${order._id}`} className="block">
          <Button size="sm" className="w-full yebone-btn-lift">
            View details
            <AiOutlineArrowRight size={14} className="ml-1" />
          </Button>
        </Link>
      </div>
    ))}
  </div>
);

export default OrderSellerCardList;
