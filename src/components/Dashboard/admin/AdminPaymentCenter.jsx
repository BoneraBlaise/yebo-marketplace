import React, { useMemo } from "react";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineCurrencyDollar, HiOutlineReceiptRefund, HiOutlineCash } from "react-icons/hi";

const AdminPaymentCenter = ({ orders = [] }) => {
  const stats = useMemo(() => {
    let total = 0;
    let pending = 0;
    let completed = 0;
    let refunds = 0;
    orders?.forEach((o) => {
      total += o.totalPrice || 0;
      if (["Delivered"].includes(o.status)) completed += o.totalPrice || 0;
      else if (o.status?.includes("Refund")) refunds += o.totalPrice || 0;
      else pending += o.totalPrice || 0;
    });
    const fees = total * 0.04;
    return { total, pending, completed, refunds, fees };
  }, [orders]);

  return (
    <section id="admin-payments" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Payment center</h2>
        <p className="text-sm text-gray-500 mt-1">Platform revenue and transaction overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <DashboardStatCard title="Platform revenue" value={`RWF ${stats.total.toLocaleString()}`} icon={HiOutlineCurrencyDollar} />
        <DashboardStatCard title="Pending payments" value={`RWF ${stats.pending.toLocaleString()}`} icon={HiOutlineCash} />
        <DashboardStatCard title="Completed" value={`RWF ${stats.completed.toLocaleString()}`} icon={HiOutlineCash} />
        <DashboardStatCard title="Refunds" value={`RWF ${stats.refunds.toLocaleString()}`} icon={HiOutlineReceiptRefund} />
        <DashboardStatCard title="Platform fees (4%)" value={`RWF ${stats.fees.toLocaleString()}`} icon={HiOutlineCurrencyDollar} />
      </div>
      <div className="dashboard-section yebone-surface">
        <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Recent transactions</h3>
        <ul className="space-y-2">
          {(orders || []).slice(0, 5).map((o) => (
            <li key={o._id} className="flex justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
              <span className="dark:text-white">#{o._id?.slice(-6)}</span>
              <span className="font-semibold text-yebone-primary">RWF {(o.totalPrice || 0).toLocaleString()}</span>
              <span className="vendor-status-pill">{o.status}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AdminPaymentCenter;
