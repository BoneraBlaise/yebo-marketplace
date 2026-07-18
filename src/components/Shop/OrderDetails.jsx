import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { BsFillBagFill } from "react-icons/bs";
import { toast } from "react-toastify";
import { getAllOrdersOfShop, updateOrderStatus, acceptOrderRefund } from "../../redux/actions/order";
import { Container, Button } from "../ui";
import { typography } from "../../design-system/typography";
import DashboardOrderTimeline from "../Dashboard/DashboardOrderTimeline";
import OrderItemsList, { OrderStatusBadge } from "../Orders/OrderItemsList";
import { OrderLoadingState, OrderErrorState } from "../Orders/OrderStateViews";
import {
  getFulfillmentOptions,
  getRefundOptions,
} from "../Orders/orderStatus";

const OrderDetails = () => {
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  const data = orders?.find((item) => item._id === id);

  useEffect(() => {
    if (data?.status) {
      setStatus(data.status);
    }
  }, [data?.status]);

  const orderUpdateHandler = async () => {
    setSubmitting(true);
    try {
      await dispatch(updateOrderStatus(id, status));
      toast.success("Order updated!");
      navigate("/dashboard-orders");
    } catch (err) {
      toast.error(err?.message || "Failed to update order");
    } finally {
      setSubmitting(false);
    }
  };

  const refundOrderUpdateHandler = async () => {
    setSubmitting(true);
    try {
      await dispatch(acceptOrderRefund(id, status));
      toast.success("Order updated!");
    } catch (err) {
      toast.error(err?.message || "Failed to update refund");
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading && !data) {
    return <OrderLoadingState label="Loading order details..." />;
  }

  if (error && !data) {
    return (
      <OrderErrorState
        message={error}
        onRetry={() => seller?._id && dispatch(getAllOrdersOfShop(seller._id))}
      />
    );
  }

  if (!data) {
    return (
      <Container className="py-8">
        <OrderErrorState message="Order not found." />
      </Container>
    );
  }

  const isRefundFlow =
    data.status === "Processing refund" || data.status === "Refund Success";
  const statusOptions = isRefundFlow
    ? getRefundOptions(data.status)
    : getFulfillmentOptions(data.status);

  return (
    <Container className="py-6 lg:py-8">
      <div className="yebone-fade-up space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <BsFillBagFill size={28} className="text-yebone-primary" />
            <div>
              <h1 className={`${typography.heading} text-xl sm:text-2xl dark:text-white`}>
                Order details
              </h1>
              <p className="text-sm text-gray-500">#{data._id?.slice(0, 8)}</p>
            </div>
          </div>
          <Link to="/dashboard-orders">
            <Button variant="outline" className="w-full sm:w-auto yebone-btn-lift">
              Back to orders
            </Button>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <OrderStatusBadge status={data.status} />
          <span className="text-sm text-gray-500">Placed {data.createdAt?.slice(0, 10)}</span>
        </div>

        <div className="dashboard-section yebone-surface">
          <h2 className="font-semibold mb-4 dark:text-white">Delivery progress</h2>
          <DashboardOrderTimeline status={data.status} />
        </div>

        <div className="dashboard-section yebone-surface">
          <h2 className="font-semibold mb-4 dark:text-white">Products</h2>
          <OrderItemsList items={data.cart} />
          <p className="text-right font-bold text-yebone-primary mt-4">
            Total: RWF {data.totalPrice}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="dashboard-section yebone-surface">
            <h3 className="font-semibold mb-3 dark:text-white">Shipping address</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              {data.shippingAddress?.address1} {data.shippingAddress?.address2}
              <br />
              {data.shippingAddress?.city} {data.shippingAddress?.country}
              <br />
              {data.user?.phoneNumber}
            </p>
          </div>
          <div className="dashboard-section yebone-surface">
            <h3 className="font-semibold mb-3 dark:text-white">Payment info</h3>
            <p className="text-sm dark:text-gray-300">
              Status: {data.paymentInfo?.status || "Not Paid"}
            </p>
          </div>
        </div>

        <div className="dashboard-section yebone-surface space-y-4">
          <h3 className="font-semibold dark:text-white">Update order status</h3>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full sm:w-72 border rounded-lg h-11 px-3 dark:bg-[#1f1f1f] dark:text-white dark:border-gray-700"
          >
            {statusOptions.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
          <Button
            className="w-full sm:w-auto yebone-btn-lift"
            disabled={submitting || !status}
            onClick={isRefundFlow ? refundOrderUpdateHandler : orderUpdateHandler}
          >
            {submitting ? "Updating..." : "Update status"}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default OrderDetails;
