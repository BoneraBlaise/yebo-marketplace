import React, { useEffect } from "react";
import AdminHeader from "../components/Layout/AdminHeader";
import AdminSideBar from "../components/Admin/Layout/AdminSideBar";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../redux/actions/order";
import BottomNav from "../components/Layout/BottomNav";

const AdminDashboardOrders = () => {
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, []);

  const getOrderType = (order) => {
    if (order.cart?.some(item => item.isFlashSale)) return "Flash Sale";
    if (order.cart?.some(item => item.isWonBid)) return "Auction Bid";
    return "Regular Order";
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7, headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white', },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
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
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
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
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        orderType: getOrderType(item),
        itemsQty: item.cart?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0,
        total: item.totalPrice + " RWF",
        status: item.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });
  const isSmallScreen = () => {
    return window.innerWidth <= 768; // Adjust this width as per your requirement
  }
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={2} />
          </div>

          <div className="w-full min-h-[45vh] pt-5 rounded flex justify-center">
            <div className="w-[97%] flex justify-center">
              <DataGrid
                rows={row}
                columns={columns}
                pageSize={4}
                disableSelectionOnClick
                autoHeight
              />
            </div>
          </div>
        </div>
      </div>
      {/* Conditionally render BottomNav only on smaller screens */}
      {isSmallScreen() && <BottomNav />}
    </div>
  );
};

export default AdminDashboardOrders;
