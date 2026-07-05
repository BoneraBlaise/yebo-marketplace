import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Loader from "../Layout/Loader";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { AiOutlineArrowRight } from "react-icons/ai";

const AllOrders = () => {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const getOrderType = (order) => {
    if (order.cart?.some(item => item.isFlashSale)) return "Flash Sale";
    if (order.cart?.some(item => item.isWonBid)) return "Auction Bid";
    return "Regular Order";
  };

  const getItemsQty = (order) => {
    if (!order.cart) return 0;
    return order.cart.reduce((total, item) => total + (item.qty || 1), 0);
  };

  const getOrderTotal = (order) => {
    if (!order.cart) return 0;
    return order.cart.reduce((total, item) => {
      const itemPrice = item.isWonBid ? item.highestBid : item.discountPrice || item.price;
      return total + (itemPrice * (item.qty || 1));
    }, 0);
  };

  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 150,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "orderType",
      headerName: "Type",
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: (params) => {
        const type = params.value;
        let colorClass = 'dark:text-white';
        if (type === 'Flash Sale') colorClass += ' text-red-500';
        if (type === 'Auction Bid') colorClass += ' text-blue-500';
        return colorClass;
      },
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: (params) => {
        const status = params.value;
        let colorClass = 'dark:text-white';
        if (status === 'Processing') colorClass += ' text-yellow-500';
        if (status === 'Delivered') colorClass += ' text-green-500';
        if (status === 'Pending') colorClass += ' text-orange-500';
        return colorClass;
      },
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "commission",
      headerName: "Commission",
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      renderCell: (params) => {
        const hasCommission = params.value !== "N/A";
        return (
          <div className={`${hasCommission ? 'text-green-600' : 'text-gray-500'}`}>
            {params.value}
          </div>
        );
      }
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} className="dark:text-white"/>
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];

  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        orderType: getOrderType(item),
        itemsQty: getItemsQty(item),
        total: "RWF " + getOrderTotal(item).toLocaleString(),
        status: item.status,
        commission: item.referralCode ? `RWF ${calculateCommission(item)}` : "N/A",
      });
    });

  const calculateCommission = (order) => {
    const rate = order.commissionRate || 5;
    return ((order.totalPrice * rate) / 100).toFixed(2);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white dark:bg-[#1f1f1f]">
          {row.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[400px]">
              <p className="text-xl font-medium text-gray-600 dark:text-gray-300">
                No orders found
              </p>
              <p className="text-gray-500 dark:text-gray-400 mt-2">
                You haven't received any orders yet
              </p>
            </div>
          ) : (
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              autoHeight
              className="dark:bg-[#1f1f1f]"
            />
          )}
        </div>
      )}
    </>
  );
};

export default AllOrders;
