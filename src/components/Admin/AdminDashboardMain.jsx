import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { AiOutlineArrowRight, AiOutlineDollarCircle } from "react-icons/ai";
import { MdPeople, MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import { getAllUsers } from "../../redux/actions/user";
import { FaShop } from "react-icons/fa6";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminDashboardMain = () => {
  const [trendData, setTrendData] = useState([]);
  const [loadingTrendData, setLoadingTrendData] = useState(true);
  const dispatch = useDispatch();

  const { adminOrders, adminOrderLoading } = useSelector(
    (state) => state.order
  );
  const { sellers } = useSelector((state) => state.seller);
  const { users } = useSelector((state) => state.user); // Fetching users from Redux state

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
    dispatch(getAllUsers()); // Fetch all users
  }, []);

  useEffect(() => {
    if (!adminOrders || adminOrders.length === 0) {
      setLoadingTrendData(false);
      return; // Exit early if there's no data
    }

    // Generate trend data for the last 7 days
    const dataForLast7Days = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);

      const earningsForTheDay = adminOrders
        .filter((order) => {
          const orderDate = new Date(order.createdAt);
          // Ensure comparison is based on the same date
          return orderDate.toDateString() === date.toDateString();
        })
        .reduce((acc, order) => acc + order.totalPrice * 0.04, 0);

      // Push the calculated earnings to the data array
      dataForLast7Days.push({
        date: date.toDateString(),
        balance: earningsForTheDay.toFixed(2),
      });
    }

    setTrendData(dataForLast7Days); // Update the state with calculated trend data
    setLoadingTrendData(false);
  }, [adminOrders]);

  const adminEarning =
    adminOrders &&
    adminOrders.reduce((acc, item) => acc + item.totalPrice * 0.04, 0);
  const adminBalance = adminEarning?.toFixed(2);

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
      field: "createdAt",
      headerName: "Order Date",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
  ];

  const row = [];
  adminOrders &&
    adminOrders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
        total: item?.totalPrice + " RWF",
        status: item?.status,
        createdAt: item?.createdAt.slice(0, 10),
      });
    });

  return (
    <>
      {adminOrderLoading ? (
        <Loader />
      ) : (
        <div className="w-full p-4">
          <h3 className="text-[22px] font-Poppins dark:text-white pb-2">
            Overview
          </h3>
          <div className="w-full block 800px:flex items-center justify-between gap-2">
            {/* Total Earning */}
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white dark:bg-[#1d0324] shadow-lg rounded-lg px-4 py-5">
              <div className="flex items-center">
                <div className="bg-green-500 text-white rounded-full p-3">
                  <AiOutlineDollarCircle size={30} />
                </div>
                <h3 className="dark:text-white ml-3 text-[18px] font-medium text-[#00000085]">
                  Total Earning
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-bold dark:text-green-500">
                RWF {adminBalance}
              </h5>
              <Link to="/admin-orders">
                <h5 className="pt-4 pl-2 text-[#077f9c]">4% of All Orders</h5>
              </Link>
            </div>

            {/* All Sellers */}
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white dark:bg-[#3d0707] shadow-lg rounded-lg px-4 py-5">
              <div className="flex items-center">
                <div className="bg-blue-600 text-white rounded-full p-3">
                  <FaShop size={30} />
                </div>
                <h3 className="dark:text-white ml-3 text-[18px] font-medium text-[#00000085]">
                  All Sellers
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-bold dark:text-white">
                {sellers && sellers.length}
              </h5>
              <Link to="/admin-sellers">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Sellers</h5>
              </Link>
            </div>

            {/* All Orders */}
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white dark:bg-[#102135] shadow-lg rounded-lg px-4 py-5">
              <div className="flex items-center">
                <div className="bg-orange-500 text-white rounded-full p-3">
                  <MdDashboard size={30} />
                </div>
                <h3 className="dark:text-white ml-3 text-[18px] font-medium text-[#00000085]">
                  All Orders
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-bold dark:text-white">
                {adminOrders && adminOrders.length}
              </h5>
              <Link to="/admin-orders">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
              </Link>
            </div>

            {/* All users */}
            <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white dark:bg-[#000] shadow-lg rounded-lg px-4 py-5">
              <div className="flex items-center">
                <div className="bg-[#fdc210] text-white rounded-full p-3">
                  <MdPeople size={30} />
                </div>
                <h3 className="dark:text-white ml-3 text-[18px] font-medium text-[#00000085]">
                  All Users
                </h3>
              </div>
              <h5 className="pt-2 pl-[36px] text-[22px] font-bold dark:text-white">
                {users && users.length}
              </h5>
              <Link to="/admin-users">
                <h5 className="pt-4 pl-2 text-[#077f9c]">View Users</h5>
              </Link>
            </div>
          </div>

          <br />
          <h3 className="text-[22px] font-Poppins dark:text-white pb-2">
            Latest Orders
          </h3>
          <div className="w-full min-h-[45vh] bg-white dark:bg-[#1f1f1f] rounded-lg">
            <DataGrid
              rows={row}
              columns={columns}
              pageSize={4}
              disableSelectionOnClick
              autoHeight
            />
          </div>

          {/* Balance Trend */}
          <h3 className="text-[22px] mt-5 font-Poppins dark:text-white pb-2">
            Balance Trend Over the Last 7 Days
          </h3>

          <div className="w-full mt-4 mb-4 min-h-[30vh] bg-white dark:bg-[#1f1f1f] shadow-lg rounded-lg px-4 py-5">
            {loadingTrendData ? (
              <div>Loading Balance Trend...</div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="balance"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdminDashboardMain;
