import React, { useMemo } from "react";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineArchive, HiOutlineExclamationCircle, HiOutlineBan } from "react-icons/hi";

const VendorInventorySummary = ({ products = [] }) => {
  const stats = useMemo(() => {
    const list = products || [];
    const lowStock = list.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= 10).length;
    const outOfStock = list.filter((p) => (p.stock || 0) <= 0).length;
    const inStock = list.filter((p) => (p.stock || 0) > 10).length;
    const totalStock = list.reduce((sum, p) => sum + (p.stock || 0), 0);
    const health =
      list.length === 0 ? 0 : Math.round(((list.length - outOfStock) / list.length) * 100);

    return { lowStock, outOfStock, inStock, totalStock, health, total: list.length };
  }, [products]);

  return (
    <section id="vendor-inventory" className="space-y-4 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Inventory</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Stock health across your catalog</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard title="Current stock" value={stats.totalStock} icon={HiOutlineArchive} subtitle={`${stats.total} products`} />
        <DashboardStatCard title="In stock" value={stats.inStock} icon={HiOutlineArchive} subtitle="Healthy levels" />
        <DashboardStatCard title="Low stock" value={stats.lowStock} icon={HiOutlineExclamationCircle} subtitle="Needs restock" />
        <DashboardStatCard title="Out of stock" value={stats.outOfStock} icon={HiOutlineBan} subtitle="Unavailable" />
      </div>

      <div className="dashboard-section yebone-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h3 className="font-Poppins font-semibold dark:text-white">Inventory health</h3>
          <span className="text-2xl font-semibold text-yebone-primary">{stats.health}%</span>
        </div>
        <div className="dashboard-chart-bar h-3">
          <div className="dashboard-chart-bar-fill" style={{ width: `${stats.health}%` }} />
        </div>
        {stats.lowStock > 0 && (
          <p className="text-sm text-amber-600 dark:text-amber-400 mt-3">
            {stats.lowStock} product{stats.lowStock !== 1 ? "s" : ""} need restocking soon.
          </p>
        )}
      </div>
    </section>
  );
};

export default VendorInventorySummary;
