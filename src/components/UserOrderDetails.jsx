import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { getAllOrdersOfUser, requestOrderRefund, cancelOrder } from "../redux/actions/order";
import { RxCross1 } from "react-icons/rx";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import axios from "axios";
import { toast } from "react-toastify";
import { server } from "../server";
import { Container, Badge, Button } from "./ui";
import DashboardOrderTimeline from "./Dashboard/DashboardOrderTimeline";
import { typography } from "../design-system/typography";
import OrderItemsList, { OrderStatusBadge } from "./Orders/OrderItemsList";
import { OrderLoadingState, OrderErrorState } from "./Orders/OrderStateViews";
import { canCancelOrder, canRequestRefund } from "./Orders/orderStatus";

const UserOrderDetails = () => {
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = orders?.find((item) => item._id === id);

  const reviewHandler = async () => {
    try {
      const res = await axios.put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(1);
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const refundHandler = async () => {
    setActionLoading(true);
    try {
      await dispatch(requestOrderRefund(id));
      toast.success("Refund request submitted");
      dispatch(getAllOrdersOfUser(user._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to request refund");
    } finally {
      setActionLoading(false);
    }
  };

  const cancelHandler = async () => {
    setActionLoading(true);
    try {
      await dispatch(cancelOrder(id));
      toast.success("Order cancellation requested");
      dispatch(getAllOrdersOfUser(user._id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  if (isLoading && !data) {
    return <OrderLoadingState label="Loading order details..." />;
  }

  if (error && !data) {
    return (
      <OrderErrorState
        message={error}
        onRetry={() => user?._id && dispatch(getAllOrdersOfUser(user._id))}
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

  return (
    <div className="dashboard-page min-h-screen dark:text-gray-200 py-6 sm:py-8">
      <Helmet>
        <title>Order Details | Yebone</title>
      </Helmet>
      <Container>
        <div className="yebone-fade-up space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <Badge variant="primary" className="mb-3">
                Order details
              </Badge>
              <h1 className={`${typography.heading} text-xl sm:text-2xl`}>
                Order #{data._id?.slice(0, 8)}
              </h1>
              <p className="text-sm text-gray-500 mt-1">Placed on {data.createdAt?.slice(0, 10)}</p>
            </div>
            <OrderStatusBadge status={data.status} />
          </div>

          <div className="dashboard-section yebone-surface">
            <h2 className="font-semibold mb-4 dark:text-white">Delivery progress</h2>
            <DashboardOrderTimeline status={data.status} />
          </div>

          <div className="dashboard-section yebone-surface space-y-4">
            <h2 className="font-semibold dark:text-white">Products</h2>
            <OrderItemsList items={data.cart} />
            {data.cart?.map((item, index) =>
              !item.isReviewed && data.status === "Delivered" ? (
                <Button
                  key={`review-${index}`}
                  size="sm"
                  onClick={() => {
                    setOpen(true);
                    setSelectedItem(item);
                  }}
                  className="yebone-btn-lift"
                >
                  Rate {item.name}
                </Button>
              ) : null
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="dashboard-section yebone-surface">
              <h4 className="font-semibold mb-3 dark:text-white">Shipping address</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {data.shippingAddress?.address1} {data.shippingAddress?.address2}
                <br />
                {data.shippingAddress?.city} {data.shippingAddress?.country}
                <br />
                {data.user?.phoneNumber}
              </p>
            </div>
            <div className="dashboard-section yebone-surface">
              <h4 className="font-semibold mb-3 dark:text-white">Payment summary</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Status: {data.paymentInfo?.status || "Not Paid"}
              </p>
              <p className="text-xl font-bold text-yebone-primary mt-3">
                Total: RWF {data.totalPrice}
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                {canCancelOrder(data.status) && (
                  <Button
                    onClick={cancelHandler}
                    variant="outline"
                    disabled={actionLoading}
                    className="yebone-btn-lift"
                  >
                    Cancel order
                  </Button>
                )}
                {canRequestRefund(data.status) && (
                  <Button
                    onClick={refundHandler}
                    variant="outline"
                    disabled={actionLoading}
                    className="yebone-btn-lift"
                  >
                    Request refund
                  </Button>
                )}
              </div>
            </div>
          </div>

          <Link to="/profile">
            <Button variant="ghost">Back to account</Button>
          </Link>
        </div>
      </Container>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 yebone-fade-up max-h-[90vh] overflow-y-auto">
            <div className="flex justify-end">
              <RxCross1 size={24} onClick={() => setOpen(false)} className="cursor-pointer" />
            </div>
            <h2 className="text-2xl font-semibold text-center mb-4">Give a review</h2>
            {selectedItem && (
              <div className="flex gap-3 mb-4">
                <img
                  src={selectedItem.images?.[0]?.url}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold">{selectedItem.name}</p>
                  <p className="text-sm text-gray-500">
                    RWF {selectedItem.discountPrice} x {selectedItem.qty}
                  </p>
                </div>
              </div>
            )}
            <div className="flex mb-4">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={25}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience"
              className="w-full border rounded-lg p-3 dark:bg-gray-800 dark:border-gray-700"
              rows={4}
            />
            <Button
              type="button"
              className="w-full yebone-btn-lift mt-4"
              disabled={rating < 1}
              onClick={reviewHandler}
            >
              Submit review
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
