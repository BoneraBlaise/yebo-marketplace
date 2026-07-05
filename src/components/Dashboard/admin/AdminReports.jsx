import React, { useMemo } from "react";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineChartBar, HiOutlineShoppingBag, HiOutlineUserGroup } from "react-icons/hi";
import { GrWorkshop } from "react-icons/gr";

const AdminReports = ({ orders = [], users = [], sellers = [] }) => {
  const stats = useMemo(() => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    let monthlyRevenue = 0;
    const weekBuckets = Array(4).fill(0);
    const monthBuckets = Array(6).fill(0);

    orders?.forEach((order) => {
      const total = order.totalPrice || 0;
      const created = new Date(order.createdAt);
      if (created.getMonth() === month && created.getFullYear() === year) {
        monthlyRevenue += total;
      }
      const weeksAgo = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 7));
      if (weeksAgo >= 0 && weeksAgo < 4) weekBuckets[3 - weeksAgo] += total;
      const monthsAgo = Math.floor((now - created) / (1000 * 60 * 60 * 24 * 30));
      if (monthsAgo >= 0 && monthsAgo < 6) monthBuckets[5 - monthsAgo] += total;
    });

    const maxMonth = Math.max(...monthBuckets, 1);
    return { monthlyRevenue, weekBuckets, monthBuckets, maxMonth };
  }, [orders]);

  return (
    <section id="admin-reports" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Executive reports</h2>
        <p className="text-sm text-gray-500 mt-1">Platform performance overview</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard title="Revenue" value={`RWF ${stats.monthlyRevenue.toLocaleString()}`} icon={HiOutlineChartBar} subtitle="This month" />
        <DashboardStatCard title="Orders" value={orders?.length || 0} icon={HiOutlineShoppingBag} />
        <DashboardStatCard title="Users" value={users?.length || 0} icon={HiOutlineUserGroup} />
        <DashboardStatCard title="Vendors" value={sellers?.length || 0} icon={GrWorkshop} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Monthly revenue</h3>
          <div className="flex items-end gap-2 h-28">
            {stats.monthBuckets.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="vendor-chart-column w-full rounded-t-lg bg-gradient-to-t from-yebone-primary to-yebone-accent/80"
                  style={{ height: `${Math.max(8, (val / stats.maxMonth) * 100)}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Weekly revenue</h3>
          <div className="flex items-end gap-2 h-28">
            {stats.weekBuckets.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="vendor-chart-column w-full rounded-t-lg bg-gradient-to-t from-yebone-primary/80 to-yebone-accent/60"
                  style={{ height: `${Math.max(8, (val / Math.max(...stats.weekBuckets, 1)) * 100)}%` }}
                />
                <span className="text-[10px] text-gray-400">W{i + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminReports;
