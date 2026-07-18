import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";
import { HiOutlineShoppingBag } from "react-icons/hi";
import VendorCustomersSummary from "../Dashboard/vendor/VendorCustomersSummary";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";
import OrderSellerCardList from "../Orders/OrderSellerCardList";
import { OrderEmptyState, OrderErrorState } from "../Orders/OrderStateViews";

const AllOrders = () => {
  const { orders, isLoading, error } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    if (seller?._id) {
      dispatch(getAllOrdersOfShop(seller._id));
    }
  }, [dispatch, seller?._id]);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, [orders]);

  const getOrderType = (order) => {
    if (order.cart?.some((item) => item.isFlashSale)) return "Flash Sale";
    if (order.cart?.some((item) => item.isWonBid)) return "Auction Bid";
    return "Regular Order";
  };

  const getItemsQty = (order) =>
    (order.cart || []).reduce((total, item) => total + (item.qty || 1), 0);

  const getOrderTotal = (order) => Number(order.totalPrice || 0);

  const calculateCommission = (order) => {
    const rate = order.commissionRate || 5;
    return ((order.totalPrice * rate) / 100).toFixed(2);
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "orderType",
      headerName: "Type",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "commission",
      headerName: "Commission",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      sortable: false,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button>
            <AiOutlineArrowRight size={20} className="dark:text-white" />
          </Button>
        </Link>
      ),
    },
  ];

  const row =
    orders?.map((item) => ({
      id: item._id,
      orderType: getOrderType(item),
      itemsQty: getItemsQty(item),
      total: `RWF ${getOrderTotal(item).toLocaleString()}`,
      status: item.status,
      commission: item.referralCode ? `RWF ${calculateCommission(item)}` : "N/A",
    })) || [];

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <OrderErrorState
        message={error}
        onRetry={() => seller?._id && dispatch(getAllOrdersOfShop(seller._id))}
      />
    );
  }

  return (
    <div className="yebone-fade-up space-y-6 lg:space-y-8 p-1">
      <VendorCustomersSummary orders={orders} />

      {row.length === 0 ? (
        <OrderEmptyState
          title="No orders found"
          message="You haven't received any orders yet."
          actionLabel="Go to dashboard"
          actionTo="/dashboard"
        />
      ) : (
        <>
          <OrderSellerCardList orders={orders} />
          <div className="hidden lg:block">
            <VendorTableSection
              title="Order management"
              subtitle="Track fulfillment, payments, and status"
            >
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={10}
                disableSelectionOnClick
                autoHeight
                className="dark:bg-[#1f1f1f]"
              />
            </VendorTableSection>
          </div>
        </>
      )}
    </div>
  );
};

export default AllOrders;
