import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import DashboardOrderTimeline from "../Dashboard/DashboardOrderTimeline";
import { Badge, Button, Container } from "../ui";
import { typography } from "../../design-system/typography";
import { OrderStatusBadge } from "../Orders/OrderItemsList";
import {
  OrderLoadingState,
  OrderErrorState,
  OrderEmptyState,
} from "../Orders/OrderStateViews";
import { getOrderStatusMessage } from "../Orders/orderStatus";

const TrackOrder = () => {
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = orders?.find((item) => item._id === id);

  if (isLoading && !orders?.length) {
    return (
      <Container className="py-12">
        <OrderLoadingState label="Loading tracking information..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-12">
        <OrderErrorState
          message={error}
          onRetry={() => user?._id && dispatch(getAllOrdersOfUser(user._id))}
        />
      </Container>
    );
  }

  if (!data) {
    return (
      <Container className="py-12">
        <OrderEmptyState
          title="Order not found"
          message="We couldn't find this order in your account history."
          actionLabel="View orders"
          actionTo="/profile"
        />
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="w-full max-w-2xl mx-auto dashboard-section yebone-surface yebone-fade-up p-5 sm:p-8">
        <Badge variant="primary" className="mb-4">
          Order tracking
        </Badge>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-2">
          <h1 className={`${typography.heading} text-xl sm:text-2xl`}>
            Order #{data._id?.slice(0, 8)}
          </h1>
          <OrderStatusBadge status={data.status} />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {getOrderStatusMessage(data.status)}
        </p>

        <DashboardOrderTimeline status={data.status} className="mb-6" />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <div className="dashboard-section yebone-surface p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">Items</p>
            <p className="font-semibold dark:text-white">{data.cart?.length || 0}</p>
          </div>
          <div className="dashboard-section yebone-surface p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">Total</p>
            <p className="font-semibold text-yebone-primary">RWF {data.totalPrice}</p>
          </div>
          <div className="dashboard-section yebone-surface p-3">
            <p className="text-xs uppercase tracking-wide text-gray-500">Date</p>
            <p className="font-semibold dark:text-white">{data.createdAt?.slice(0, 10)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link to={`/user/order/${data._id}`} className="flex-1">
            <Button className="w-full yebone-btn-lift">View order details</Button>
          </Link>
          <Link to="/profile" className="flex-1">
            <Button variant="outline" className="w-full yebone-btn-lift">
              Order history
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
};

export default TrackOrder;
