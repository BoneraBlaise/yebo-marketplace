import React, { useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";
import AdminPageToolbar from "../Dashboard/admin/AdminPageToolbar";

const AllAdminOrders = () => {
  const dispatch = useDispatch();
  const [search, setSearch] = React.useState("");
  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
  }, [dispatch]);

  const getOrderType = (order) => {
    if (order.cart?.some((item) => item.isFlashSale)) return "Flash Sale";
    if (order.cart?.some((item) => item.isWonBid)) return "Auction Bid";
    return "Regular Order";
  };

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.7, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 0.7, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "total", headerName: "Total", minWidth: 130, flex: 0.8, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "createdAt", headerName: "Order Date", minWidth: 130, flex: 0.8, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    {
      field: "orderType",
      headerName: "Type",
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: (params) => {
        const type = params.value;
        let colorClass = "dark:text-white";
        if (type === "Flash Sale") colorClass += " text-red-500";
        if (type === "Auction Bid") colorClass += " text-blue-500";
        return colorClass;
      },
    },
  ];

  const row = [];
  adminOrders?.forEach((item) => {
    row.push({
      id: item._id,
      orderType: getOrderType(item),
      itemsQty: item.cart?.reduce((acc, item) => acc + (item.qty || 1), 0) || 0,
      total: item.totalPrice + " RWF",
      status: item.status,
      createdAt: item?.createdAt?.slice(0, 10),
    });
  });

  const filtered = search
    ? row.filter(
        (r) =>
          r.id?.toLowerCase().includes(search.toLowerCase()) ||
          r.status?.toLowerCase().includes(search.toLowerCase())
      )
    : row;

  if (adminOrderLoading) return <Loader />;

  return (
    <div className="yebone-fade-up space-y-4 p-1">
      <AdminPageToolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search orders…"
      />
      <VendorTableSection title="Order management" subtitle="Payment, shipping, and status overview">
        <DataGrid rows={filtered} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
      </VendorTableSection>
    </div>
  );
};

export default AllAdminOrders;
