import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineCurrencyDollar, HiOutlineCash, HiOutlineChartBar } from "react-icons/hi";

const VendorEarningsSummary = ({ orders = [] }) => {
  const { seller } = useSelector((state) => state.seller);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    let totalRevenue = 0;
    let monthlyRevenue = 0;
    let weeklyRevenue = 0;

    orders?.forEach((order) => {
      const total = order.totalPrice || 0;
      totalRevenue += total;
      const created = new Date(order.createdAt);
      if (created.getMonth() === thisMonth && created.getFullYear() === thisYear) {
        monthlyRevenue += total;
      }
      if (created >= weekAgo) {
        weeklyRevenue += total;
      }
    });

    const available = seller?.availableBalance || 0;
    const withdrawn = totalRevenue - available;

    return { totalRevenue, monthlyRevenue, weeklyRevenue, available, withdrawn };
  }, [orders, seller?.availableBalance]);

  return (
    <section id="vendor-earnings" className="space-y-4 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Earnings overview</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Revenue and balance summary</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <DashboardStatCard
          title="Available balance"
          value={`RWF ${Number(stats.available).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={HiOutlineCash}
        />
        <DashboardStatCard
          title="Pending balance"
          value="RWF 0.00"
          icon={HiOutlineCurrencyDollar}
          subtitle="Processing payouts"
        />
        <DashboardStatCard
          title="Total revenue"
          value={`RWF ${stats.totalRevenue.toLocaleString()}`}
          icon={HiOutlineChartBar}
        />
        <DashboardStatCard
          title="Withdrawn"
          value={`RWF ${Math.max(0, stats.withdrawn).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={HiOutlineCash}
        />
        <DashboardStatCard
          title="Monthly revenue"
          value={`RWF ${stats.monthlyRevenue.toLocaleString()}`}
          icon={HiOutlineChartBar}
        />
        <DashboardStatCard
          title="Weekly revenue"
          value={`RWF ${stats.weeklyRevenue.toLocaleString()}`}
          icon={HiOutlineChartBar}
        />
      </div>

      <div className="dashboard-section yebone-surface">
        <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Recent transactions</h3>
        {orders?.length === 0 ? (
          <p className="text-sm text-gray-500">No transactions yet.</p>
        ) : (
          <ul className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <li
                key={order._id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="text-sm dark:text-white">Order #{order._id?.slice(-6)}</span>
                <span className="text-sm font-semibold text-yebone-primary">
                  +RWF {(order.totalPrice || 0).toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 w-full sm:w-auto">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default VendorEarningsSummary;
