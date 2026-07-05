import React, { useMemo } from "react";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineUserGroup, HiOutlineShoppingBag } from "react-icons/hi";

const VendorCustomersSummary = ({ orders = [] }) => {
  const customers = useMemo(() => {
    const map = new Map();

    orders?.forEach((order) => {
      const id = order.user?._id || order.user?.name || order.user || "guest";
      const name = order.user?.name || "Customer";
      const existing = map.get(id) || {
        name,
        orders: 0,
        spent: 0,
        lastPurchase: order.createdAt,
        status: order.status,
      };
      existing.orders += 1;
      existing.spent += order.totalPrice || 0;
      if (new Date(order.createdAt) > new Date(existing.lastPurchase)) {
        existing.lastPurchase = order.createdAt;
        existing.status = order.status;
      }
      map.set(id, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.spent - a.spent);
  }, [orders]);

  return (
    <section id="vendor-customers" className="space-y-4 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Customers</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Buyers from your order history</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <DashboardStatCard title="Total customers" value={customers.length} icon={HiOutlineUserGroup} />
        <DashboardStatCard
          title="Repeat buyers"
          value={customers.filter((c) => c.orders > 1).length}
          icon={HiOutlineShoppingBag}
        />
        <DashboardStatCard
          title="Total spent"
          value={`RWF ${customers.reduce((s, c) => s + c.spent, 0).toLocaleString()}`}
          icon={HiOutlineUserGroup}
          className="col-span-2 lg:col-span-1"
        />
      </div>

      {customers.length === 0 ? (
        <div className="dashboard-section yebone-surface text-center py-8">
          <p className="text-sm text-gray-500">No customer data yet.</p>
        </div>
      ) : (
        <div className="dashboard-section yebone-surface overflow-x-auto">
          <table className="vendor-table w-full text-sm">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Status</th>
                <th>Last purchase</th>
              </tr>
            </thead>
            <tbody>
              {customers.slice(0, 10).map((c, i) => (
                <tr key={i} className="vendor-table-row">
                  <td className="font-medium dark:text-white">{c.name}</td>
                  <td>{c.orders}</td>
                  <td>RWF {c.spent.toLocaleString()}</td>
                  <td>
                    <span className="vendor-status-pill">{c.status}</span>
                  </td>
                  <td className="text-gray-500">
                    {c.lastPurchase ? new Date(c.lastPurchase).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default VendorCustomersSummary;
