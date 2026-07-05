import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { MdBorderClear, MdEvent, MdFlashAuto } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllBidsBySeller } from "../../redux/actions/bids";
import { getAllEventsShop } from "../../redux/actions/event";
import { getAllFlashSales } from "../../redux/actions/flashSale"; // Add action for flash sales
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import { FaEarlybirds, FaGift, FaMoneyBillWave } from "react-icons/fa";
import { MdAccountBalanceWallet } from "react-icons/md";
import { HiMiniShoppingCart } from "react-icons/hi2";
import { FaTags } from "react-icons/fa";
import axios from "axios";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { sellerBids, isLoading, error } = useSelector((state) => state.bids);
  const { events } = useSelector((state) => state.events); // Get events
  const { flashSales } = useSelector((state) => state.flashSales); // Get flash sales
  const [coupons, setCoupouns] = useState([]);
  

  useEffect(() => {
   
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
       
        setCoupouns(res.data.couponCodes);
      })
      .catch((error) => {
      });
  }, [dispatch]);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
    dispatch(getAllEventsShop(seller._id)); // Dispatch events action
    dispatch(getAllFlashSales(seller._id)); // Dispatch flash sales action
  }, [dispatch, seller._id]);

  useEffect(() => {
    if (seller._id) {
      console.log(`Fetching all bids for seller with ID: ${seller._id}`);
      dispatch(getAllBidsBySeller(seller._id)); // Fetch bids for the seller
    } else {
      console.warn("No seller ID found, skipping bid fetch.");
    }
  }, [dispatch, seller._id]);

  const availableBalance = seller?.availableBalance.toFixed(2);

  const commissionStats = {
    totalEarnings: orders?.reduce((total, order) => {
      if (order.referralCode) {
        const rate = order.commissionRate || 5;
        return total + ((order.totalPrice * rate) / 100);
      }
      return total;
    }, 0) || 0,
    totalCommissionOrders: orders?.filter(order => order.referralCode).length || 0,
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
          <Link to={`/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} className="dark:text-white"/>
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  orders && orders.forEach((item) => {
    row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "RWF " + item.totalPrice,
        status: item.status,
        headerClassName: 'dark:text-white',
        cellClassName: 'dark:text-white',
      });
  });

  return (
    <div className="w-full p-8">
      <h3 className="text-[22px] dark:text-white font-Poppins dark:text-white pb-2">Overview</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <MdAccountBalanceWallet
              size={40}
              className="mr-2 bg-green-500 p-2 rounded-full text-white shadow-md hover:bg-green-600 transition duration-300"
            />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              Balance{" "}
              <span className="text-[16px]">(4% commission)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">RWF {availableBalance}</h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c] ml-4">Withdraw Money</h5>
          </Link>
        </div>

        {/* All Orders Card */}
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <HiMiniShoppingCart size={40} className="mr-2 bg-blue-500 p-2 rounded-full text-white shadow-md hover:bg-blue-600 transition duration-300" />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">{orders && orders.length}</h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>

        {/* All Products Card */}
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <FaTags size={40} className="mr-2 bg-purple-500 p-2 rounded-full text-white shadow-md hover:bg-purple-600 transition duration-300" />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">{products && products.length}</h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>

        {/* Commission Earnings Card */}
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <FaMoneyBillWave size={40} className="mr-2 bg-yellow-500 p-2 rounded-full text-white shadow-md hover:bg-yellow-600 transition duration-300" />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              Commission Earnings
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">
            RWF {commissionStats.totalEarnings.toFixed(2)}
          </h5> 
          <p className="pt-2 pl-[36px] font-[500] text-gray-600 dark:text-gray-400 pl-[36px]">
            From {commissionStats.totalCommissionOrders} orders
          </p>
        </div>
      </div>

      {/* New Cards for Bids, Events, Coupons, Flash Sales */}
      <div className="w-full block 800px:flex items-center justify-between">
        
        {/* Bids Card */}
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <FaEarlybirds
              size={40}
              className="mr-2 bg-red-500 p-2 rounded-full text-white shadow-md hover:bg-green-600 transition duration-300"
            />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              Bids
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">{sellerBids && sellerBids.length}</h5>
          <Link to="/dashboard-bids">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Bids</h5>
          </Link>
        </div>

        {/* Events Card */}
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <MdEvent size={40} className="mr-2 bg-indigo-500 p-2 rounded-full text-white shadow-md hover:bg-blue-600 transition duration-300" />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              Events
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">{events && events.length}</h5>
          <Link to="/dashboard-events">
            <h5 className="pt-4 pl-2 text-[#077f9c]">My Events</h5>
          </Link>
        </div>

        {/* Coupons Card */}
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <FaGift size={40} className="mr-2 bg-teal-500 p-2 rounded-full text-white shadow-md hover:bg-purple-600 transition duration-300" />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              Coupons
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">{coupons && coupons.length}</h5>
          <Link to="/dashboard-coupons">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Coupons</h5>
          </Link>
        </div>

        {/* Flash Sales Card */}
        <div className="w-full mb-4 800px:w-[28%] m-1 min-h-[20vh] bg-white dark:bg-[#19383d] shadow rounded px-2 py-2">
          <div className="flex items-center">
            <MdFlashAuto size={40} className="mr-2 bg-cyan-500 p-2 rounded-full text-white shadow-md hover:bg-yellow-600 transition duration-300" />
            <h3 className={`${styles.productTitle} !text-[14px] leading-5 !font-[400] text-[#00000085] dark:text-gray-300`}>
              Flash Sales
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] dark:text-white font-[500]">{flashSales && flashSales.length}</h5>
          <Link to="/dashboard-flashsales">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Flash Sales</h5>
          </Link>
        </div>
      </div>

      {/* Orders Table */}
      <div className="w-full bg-white dark:bg-[#2b2b2b] shadow rounded px-2 py-2 mt-8">
        <div className="flex items-center mb-4">
          <h3 className="text-[22px] dark:text-white">Recent Orders</h3>
        </div>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={row} columns={columns} pageSize={5} />
        </div>
      </div>
    </div>
  );
};

export default DashboardHero;
