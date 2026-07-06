import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight } from "react-icons/ai";
import { Link } from "react-router-dom";
import { server } from "../../server";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllBidsBySeller } from "../../redux/actions/bids";
import { getAllEventsShop } from "../../redux/actions/event";
import { getAllFlashSales } from "../../redux/actions/flashSale";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import {
  HiOutlineShoppingBag,
  HiOutlineCube,
  HiOutlineCash,
  HiOutlineStar,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { FaEarlybirds, FaGift, FaMoneyBillWave } from "react-icons/fa";
import { MdEvent, MdFlashAuto } from "react-icons/md";
import axios from "axios";
import { SectionTitle } from "../ui";
import DashboardStatCard from "../Dashboard/DashboardStatCard";
import VendorQuickActions from "../Dashboard/vendor/VendorQuickActions";
import VendorAnalytics from "../Dashboard/vendor/VendorAnalytics";
import VendorReviewsPanel from "../Dashboard/vendor/VendorReviewsPanel";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";
import { YEBOVendorShoppingInsights, YEBOVendorMemoryDashboard } from "../ai";

const DashboardHero = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const { products } = useSelector((state) => state.products);
  const { sellerBids } = useSelector((state) => state.bids);
  const { events } = useSelector((state) => state.events);
  const { flashSales } = useSelector((state) => state.flashSales);
  const [coupons, setCoupouns] = useState([]);

  useEffect(() => {
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setCoupouns(res.data.couponCodes);
      })
      .catch(() => {});
  }, [dispatch, seller._id]);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
    dispatch(getAllEventsShop(seller._id));
    dispatch(getAllFlashSales(seller._id));
  }, [dispatch, seller._id]);

  useEffect(() => {
    if (seller._id) {
      dispatch(getAllBidsBySeller(seller._id));
    }
  }, [dispatch, seller._id]);

  useEffect(() => {
    if (window.location.hash) {
      const el = document.querySelector(window.location.hash);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const availableBalance = seller?.availableBalance?.toFixed(2) || "0.00";

  const commissionStats = {
    totalEarnings:
      orders?.reduce((total, order) => {
        if (order.referralCode) {
          const rate = order.commissionRate || 5;
          return total + (order.totalPrice * rate) / 100;
        }
        return total;
      }, 0) || 0,
    totalCommissionOrders: orders?.filter((order) => order.referralCode).length || 0,
  };

  const now = new Date();
  const todayOrders =
    orders?.filter((o) => {
      const d = new Date(o.createdAt);
      return d.toDateString() === now.toDateString();
    }) || [];
  const todaySales = todayOrders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const monthlyRevenue =
    orders?.reduce((s, o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        ? s + (o.totalPrice || 0)
        : s;
    }, 0) || 0;
  const pendingOrders = orders?.filter((o) => !["Delivered", "Refund Success"].includes(o.status))?.length || 0;
  const completedOrders = orders?.filter((o) => o.status === "Delivered")?.length || 0;

  const allReviews = products?.flatMap((p) => p.reviews || []) || [];
  const avgRating =
    allReviews.length > 0
      ? (allReviews.reduce((s, r) => s + (r.rating || 0), 0) / allReviews.length).toFixed(1)
      : "—";

  const uniqueCustomers = new Set(
    orders?.map((o) => o.user?._id || o.user?.name || o.user).filter(Boolean)
  ).size;

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
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
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

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
        total: "RWF " + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="yebone-fade-up space-y-8 p-1">
      <SectionTitle
        title={`Welcome, ${seller?.name || "Seller"}`}
        subtitle="Your seller workspace at a glance"
        align="left"
        className="mb-0"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard
          title="Today's sales"
          value={`RWF ${todaySales.toLocaleString()}`}
          icon={HiOutlineCash}
          subtitle={`${todayOrders.length} orders`}
        />
        <DashboardStatCard
          title="Monthly revenue"
          value={`RWF ${monthlyRevenue.toLocaleString()}`}
          icon={HiOutlineCash}
        />
        <DashboardStatCard
          title="Pending orders"
          value={pendingOrders}
          icon={HiOutlineShoppingBag}
        />
        <DashboardStatCard
          title="Completed orders"
          value={completedOrders}
          icon={HiOutlineShoppingBag}
        />
        <DashboardStatCard
          title="Products"
          value={products?.length || 0}
          icon={HiOutlineCube}
          subtitle={
            <Link to="/dashboard-products" className="text-yebone-primary hover:underline">
              View catalog
            </Link>
          }
        />
        <DashboardStatCard title="Customers" value={uniqueCustomers} icon={HiOutlineUserGroup} />
        <DashboardStatCard title="Average rating" value={avgRating} icon={HiOutlineStar} />
        <DashboardStatCard
          title="Available balance"
          value={`RWF ${availableBalance}`}
          icon={HiOutlineCash}
          subtitle={
            <Link to="/dashboard-withdraw-money" className="text-yebone-primary hover:underline">
              Withdraw
            </Link>
          }
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard
          title="All orders"
          value={orders?.length || 0}
          icon={HiOutlineShoppingBag}
          subtitle={
            <Link to="/dashboard-orders" className="text-yebone-primary hover:underline">
              Manage orders
            </Link>
          }
        />
        <DashboardStatCard
          title="Commission"
          value={`RWF ${commissionStats.totalEarnings.toFixed(2)}`}
          icon={FaMoneyBillWave}
          subtitle={`From ${commissionStats.totalCommissionOrders} orders`}
        />
        <DashboardStatCard
          title="Bids"
          value={sellerBids?.length || 0}
          icon={FaEarlybirds}
          subtitle={
            <Link to="/dashboard-bids" className="text-yebone-primary hover:underline">
              View bids
            </Link>
          }
        />
        <DashboardStatCard
          title="Events"
          value={events?.length || 0}
          icon={MdEvent}
          subtitle={
            <Link to="/dashboard-events" className="text-yebone-primary hover:underline">
              My events
            </Link>
          }
        />
        <DashboardStatCard
          title="Coupons"
          value={coupons?.length || 0}
          icon={FaGift}
          subtitle={
            <Link to="/dashboard-coupouns" className="text-yebone-primary hover:underline">
              View coupons
            </Link>
          }
        />
        <DashboardStatCard
          title="Flash sales"
          value={flashSales?.length || 0}
          icon={MdFlashAuto}
          subtitle={
            <Link to="/dashboard-flashsales" className="text-yebone-primary hover:underline">
              Flash sales
            </Link>
          }
        />
      </div>

      <VendorQuickActions />

      <YEBOVendorShoppingInsights />
      <YEBOVendorMemoryDashboard />

      <VendorTableSection title="Recent orders" subtitle="Latest activity from your store">
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid rows={row} columns={columns} pageSize={5} />
        </div>
      </VendorTableSection>

      <VendorAnalytics orders={orders} products={products} />
      <VendorReviewsPanel products={products} />
    </div>
  );
};

export default DashboardHero;
