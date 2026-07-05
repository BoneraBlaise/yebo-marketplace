import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineShoppingBag, HiOutlineChartBar } from "react-icons/hi";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const VendorAnalytics = ({ orders = [], products = [] }) => {
  const { seller } = useSelector((state) => state.seller);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let monthlyRevenue = 0;
    let weeklyRevenue = 0;
    let prevMonthRevenue = 0;
    const categoryMap = {};
    const productSales = {};
    const monthBuckets = Array(6).fill(0);
    const orderBuckets = Array(6).fill(0);

    const weekAgo = new Date(now);
    weekAgo.setDate(weekAgo.getDate() - 7);

    orders?.forEach((order) => {
      const total = order.totalPrice || 0;
      const created = new Date(order.createdAt);
      const month = created.getMonth();
      const year = created.getFullYear();

      if (month === thisMonth && year === thisYear) {
        monthlyRevenue += total;
      }
      if (created >= weekAgo) {
        weeklyRevenue += total;
      }
      if (month === (thisMonth === 0 ? 11 : thisMonth - 1) && year === (thisMonth === 0 ? thisYear - 1 : thisYear)) {
        prevMonthRevenue += total;
      }

      const bucketIndex = Math.min(5, Math.floor((now - created) / (1000 * 60 * 60 * 24 * 30)));
      if (bucketIndex >= 0 && bucketIndex < 6) {
        monthBuckets[5 - bucketIndex] += total;
        orderBuckets[5 - bucketIndex] += 1;
      }

      order.cart?.forEach((item) => {
        const cat = item.category || "General";
        categoryMap[cat] = (categoryMap[cat] || 0) + (item.qty || 1);
        const name = item.name || "Product";
        productSales[name] = (productSales[name] || 0) + (item.qty || 1);
      });
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const salesByCategory = Object.entries(categoryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const maxRevenue = Math.max(...monthBuckets, 1);
    const maxOrders = Math.max(...orderBuckets, 1);
    const monthChange =
      prevMonthRevenue > 0
        ? (((monthlyRevenue - prevMonthRevenue) / prevMonthRevenue) * 100).toFixed(1)
        : monthlyRevenue > 0
          ? "100"
          : "0";

    return {
      monthlyRevenue,
      weeklyRevenue,
      monthChange,
      monthBuckets,
      orderBuckets,
      maxRevenue,
      maxOrders,
      topProducts,
      salesByCategory,
      totalOrders: orders?.length || 0,
      totalProducts: products?.length || 0,
    };
  }, [orders, products]);

  return (
    <section id="vendor-analytics" className="space-y-6 scroll-mt-24">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Analytics</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Performance insights for {seller?.name || "your store"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard
          title="Monthly revenue"
          value={`RWF ${stats.monthlyRevenue.toLocaleString()}`}
          icon={HiOutlineChartBar}
          subtitle={`${stats.monthChange}% vs last month`}
        />
        <DashboardStatCard
          title="Weekly revenue"
          value={`RWF ${stats.weeklyRevenue.toLocaleString()}`}
          icon={HiOutlineChartBar}
        />
        <DashboardStatCard
          title="Total orders"
          value={stats.totalOrders}
          icon={HiOutlineShoppingBag}
        />
        <DashboardStatCard
          title="Products listed"
          value={stats.totalProducts}
          icon={HiOutlineChartBar}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Revenue trend</h3>
          <div className="flex items-end gap-2 h-32">
            {stats.monthBuckets.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="vendor-chart-column w-full rounded-t-lg bg-gradient-to-t from-yebone-primary to-yebone-accent/80"
                  style={{ height: `${Math.max(8, (val / stats.maxRevenue) * 100)}%` }}
                  title={`RWF ${val.toLocaleString()}`}
                />
                <span className="text-[10px] text-gray-400">{MONTHS[(new Date().getMonth() - (5 - i) + 12) % 12]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Orders trend</h3>
          <div className="flex items-end gap-2 h-32">
            {stats.orderBuckets.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="vendor-chart-column w-full rounded-t-lg bg-gradient-to-t from-yebone-primary/80 to-yebone-accent/60"
                  style={{ height: `${Math.max(8, (val / stats.maxOrders) * 100)}%` }}
                  title={`${val} orders`}
                />
                <span className="text-[10px] text-gray-400">{MONTHS[(new Date().getMonth() - (5 - i) + 12) % 12]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Top products</h3>
          {stats.topProducts.length === 0 ? (
            <p className="text-sm text-gray-500">No sales data yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.topProducts.map(([name, qty]) => (
                <li key={name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="truncate dark:text-white">{name}</span>
                    <span className="font-semibold text-yebone-primary">{qty} sold</span>
                  </div>
                  <div className="dashboard-chart-bar">
                    <div
                      className="dashboard-chart-bar-fill"
                      style={{
                        width: `${(qty / stats.topProducts[0][1]) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Sales by category</h3>
          {stats.salesByCategory.length === 0 ? (
            <p className="text-sm text-gray-500">No category data yet.</p>
          ) : (
            <ul className="space-y-3">
              {stats.salesByCategory.map(([cat, qty]) => (
                <li key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="dark:text-white">{cat}</span>
                    <span className="font-semibold text-yebone-primary">{qty}</span>
                  </div>
                  <div className="dashboard-chart-bar">
                    <div
                      className="dashboard-chart-bar-fill"
                      style={{
                        width: `${(qty / stats.salesByCategory[0][1]) * 100}%`,
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface border border-dashed border-yebone-primary/20">
          <h3 className="font-Poppins font-semibold mb-2 dark:text-white">Visitors</h3>
          <p className="text-3xl font-semibold text-yebone-primary">—</p>
          <p className="text-xs text-gray-500 mt-2">Analytics integration coming soon</p>
        </div>
        <div className="dashboard-section yebone-surface border border-dashed border-yebone-primary/20">
          <h3 className="font-Poppins font-semibold mb-2 dark:text-white">Conversion rate</h3>
          <p className="text-3xl font-semibold text-yebone-primary">—</p>
          <p className="text-xs text-gray-500 mt-2">Analytics integration coming soon</p>
        </div>
      </div>
    </section>
  );
};

export default VendorAnalytics;
