import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { AiOutlineArrowRight } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfAdmin } from "../../redux/actions/order";
import Loader from "../Layout/Loader";
import { getAllSellers } from "../../redux/actions/sellers";
import { getAllUsers } from "../../redux/actions/user";
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
import {
  HiOutlineCash,
  HiOutlineShoppingBag,
  HiOutlineUserGroup,
  HiOutlineChartBar,
} from "react-icons/hi";
import { GrWorkshop } from "react-icons/gr";
import { SectionTitle } from "../ui";
import DashboardStatCard from "../Dashboard/DashboardStatCard";
import AdminQuickActions from "../Dashboard/admin/AdminQuickActions";
import AdminReports from "../Dashboard/admin/AdminReports";
import AdminPaymentCenter from "../Dashboard/admin/AdminPaymentCenter";
import AdminCommissionPanel from "../Dashboard/admin/AdminCommissionPanel";
import AdminReferralPanel from "../Dashboard/admin/AdminReferralPanel";
import AdminAICenter from "../Dashboard/admin/AdminAICenter";
import AdminSystemSettings from "../Dashboard/admin/AdminSystemSettings";
import AdminDeliverySettings from "../Dashboard/admin/AdminDeliverySettings";
import AdminGrowthSettings from "../Dashboard/admin/AdminGrowthSettings";
import AdminCommissionRules from "../Dashboard/admin/AdminCommissionRules";
import AdminCouponMonitor from "../Dashboard/admin/AdminCouponMonitor";
import AdminSupportCenter from "../Dashboard/admin/AdminSupportCenter";
import AdminCategoriesPanel from "../Dashboard/admin/AdminCategoriesPanel";
import VendorTableSection from "../Dashboard/vendor/VendorTableSection";
import { resolveAdminTier } from "../Dashboard/admin/adminRoleConfig";

const AdminDashboardMain = () => {
  const [trendData, setTrendData] = useState([]);
  const [loadingTrendData, setLoadingTrendData] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { adminOrders, adminOrderLoading } = useSelector((state) => state.order);
  const { sellers } = useSelector((state) => state.seller);
  const { users } = useSelector((state) => state.user);
  const tier = resolveAdminTier(user);

  useEffect(() => {
    dispatch(getAllOrdersOfAdmin());
    dispatch(getAllSellers());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (!adminOrders || adminOrders.length === 0) {
      setLoadingTrendData(false);
      return;
    }

    const dataForLast7Days = [];
    const currentDate = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(date.getDate() - i);
      const earningsForTheDay = adminOrders
        .filter((order) => new Date(order.createdAt).toDateString() === date.toDateString())
        .reduce((acc, order) => acc + order.totalPrice * 0.04, 0);

      dataForLast7Days.push({
        date: date.toDateString(),
        balance: earningsForTheDay.toFixed(2),
      });
    }

    setTrendData(dataForLast7Days);
    setLoadingTrendData(false);
  }, [adminOrders]);

  const adminEarning = adminOrders?.reduce((acc, item) => acc + item.totalPrice * 0.04, 0) || 0;
  const adminBalance = adminEarning.toFixed(2);

  const now = new Date();
  const todayRevenue =
    adminOrders?.filter((o) => new Date(o.createdAt).toDateString() === now.toDateString())
      .reduce((s, o) => s + (o.totalPrice || 0), 0) || 0;
  const monthlyRevenue =
    adminOrders?.reduce((s, o) => {
      const d = new Date(o.createdAt);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        ? s + (o.totalPrice || 0)
        : s;
    }, 0) || 0;
  const pendingWithdrawals = 0;

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "status", headerName: "Status", minWidth: 130, flex: 0.7, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "itemsQty", headerName: "Items Qty", type: "number", minWidth: 130, flex: 0.7, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "total", headerName: "Total", type: "number", minWidth: 130, flex: 0.8, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    { field: "createdAt", headerName: "Order Date", minWidth: 130, flex: 0.8, headerClassName: "dark:text-white", cellClassName: "dark:text-white" },
    {
      field: " ",
      flex: 0.5,
      minWidth: 80,
      headerName: "",
      sortable: false,
      renderCell: (params) => (
        <Link to={`/order/${params.id}`}>
          <Button><AiOutlineArrowRight size={20} className="dark:text-white" /></Button>
        </Link>
      ),
    },
  ];

  const row = [];
  adminOrders?.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item?.cart?.reduce((acc, item) => acc + item.qty, 0),
      total: item?.totalPrice + " RWF",
      status: item?.status,
      createdAt: item?.createdAt?.slice(0, 10),
    });
  });

  return adminOrderLoading ? (
    <Loader />
  ) : (
    <div className="yebone-fade-up space-y-8 p-1">
      <SectionTitle
        title={`${tier === "super" ? "Super Admin" : "Assistant Admin"} overview`}
        subtitle="Yebone platform at a glance"
        align="left"
        className="mb-0"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard title="Total revenue" value={`RWF ${adminBalance}`} icon={HiOutlineCash} subtitle="4% platform fees" />
        <DashboardStatCard title="Today's revenue" value={`RWF ${todayRevenue.toLocaleString()}`} icon={HiOutlineCash} />
        <DashboardStatCard title="Monthly revenue" value={`RWF ${monthlyRevenue.toLocaleString()}`} icon={HiOutlineChartBar} />
        <DashboardStatCard title="Orders" value={adminOrders?.length || 0} icon={HiOutlineShoppingBag} subtitle={<Link to="/admin-orders" className="text-yebone-primary hover:underline">Manage</Link>} />
        <DashboardStatCard title="Products" value="—" icon={HiOutlineChartBar} subtitle={<Link to="/admin-products" className="text-yebone-primary hover:underline">Catalog</Link>} />
        <DashboardStatCard title="Customers" value={users?.length || 0} icon={HiOutlineUserGroup} subtitle={<Link to="/admin-users" className="text-yebone-primary hover:underline">View</Link>} />
        <DashboardStatCard title="Vendors" value={sellers?.length || 0} icon={GrWorkshop} subtitle={<Link to="/admin-sellers" className="text-yebone-primary hover:underline">View</Link>} />
        <DashboardStatCard title="Pending withdrawals" value={pendingWithdrawals} icon={HiOutlineCash} subtitle={<Link to="/admin-withdraw-request" className="text-yebone-primary hover:underline">Review</Link>} />
        <DashboardStatCard title="Platform growth" value={`+${sellers?.length || 0}`} icon={HiOutlineChartBar} subtitle="Active vendors" />
        <DashboardStatCard title="Conversion rate" value="—" icon={HiOutlineChartBar} subtitle="Analytics coming soon" />
        <DashboardStatCard title="AI usage" value="—" icon={HiOutlineChartBar} subtitle="Placeholder" />
      </div>

      <AdminQuickActions />

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-2 dark:text-white">Platform health</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Orders processing</span><span className="font-semibold">{adminOrders?.filter((o) => o.status === "Processing").length || 0}</span></div>
            <div className="dashboard-chart-bar"><div className="dashboard-chart-bar-fill" style={{ width: "72%" }} /></div>
            <div className="flex justify-between text-sm pt-2"><span className="text-gray-500">System status</span><span className="text-green-600 font-semibold">Operational</span></div>
          </div>
        </div>
        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-2 dark:text-white">Recent activity</h3>
          <ul className="space-y-2 text-sm">
            {(adminOrders || []).slice(0, 4).map((o) => (
              <li key={o._id} className="flex justify-between dark:text-white">
                <span>Order #{o._id?.slice(-6)}</span>
                <span className="text-gray-400">{o.status}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <VendorTableSection title="Latest orders" subtitle="Recent platform activity">
        <DataGrid rows={row} columns={columns} pageSize={4} disableSelectionOnClick autoHeight />
      </VendorTableSection>

      <div className="dashboard-section yebone-surface">
        <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Balance trend (7 days)</h3>
        {loadingTrendData ? (
          <div className="admin-skeleton h-[300px] rounded-xl" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="balance" stroke="#29625d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <AdminReports orders={adminOrders} users={users} sellers={sellers} />
      <AdminCategoriesPanel />
      <AdminPaymentCenter orders={adminOrders} />
      <AdminCommissionPanel orders={adminOrders} />
      <AdminReferralPanel orders={adminOrders} />
      <AdminAICenter />
      <AdminDeliverySettings />
      <AdminGrowthSettings />
      <AdminCommissionRules />
      <AdminCouponMonitor />
      <AdminSystemSettings />
      <AdminSupportCenter />
    </div>
  );
};

export default AdminDashboardMain;
