import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import DashboardOrderTimeline from "../Dashboard/DashboardOrderTimeline";
import { Badge } from "../ui";
import { typography } from "../../design-system/typography";

const TrackOrder = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const statusMessage = (() => {
    if (!data) return "Loading order status...";
    if (data.status === "Processing") return "Your order is processing in shop.";
    if (data.status === "Transferred to delivery partner")
      return "Your order is on the way to our delivery partner.";
    if (data.status === "Shipping") return "Your order is with our delivery partner.";
    if (data.status === "Received") return "Your order is in your city.";
    if (data.status === "On the way") return "Our delivery partner is on the way.";
    if (data.status === "Delivered") return "Your order has been delivered!";
    if (data.status === "Processing refund") return "Your refund is processing.";
    if (data.status === "Refund Success") return "Your refund was successful.";
    return data.status;
  })();

  return (
    <div className="dashboard-page min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg dashboard-section yebone-surface yebone-fade-up p-6 lg:p-8">
        <Badge variant="primary" className="mb-4">
          Order tracking
        </Badge>
        <h1 className={`${typography.heading} text-xl mb-2`}>
          {data ? `Order #${data._id?.slice(0, 8)}` : "Track order"}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{statusMessage}</p>

        {data && (
          <>
            <DashboardOrderTimeline status={data.status} className="mb-6" />
            <div className="flex flex-wrap gap-2 text-sm text-gray-500">
              <span>{data.cart?.length || 0} items</span>
              <span>·</span>
              <span>RWF {data.totalPrice}</span>
              <span>·</span>
              <span>{data.createdAt?.slice(0, 10)}</span>
            </div>
          </>
        )}

        {!data && orders?.length === 0 && (
          <p className="text-sm text-gray-500">Order not found or still loading.</p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
