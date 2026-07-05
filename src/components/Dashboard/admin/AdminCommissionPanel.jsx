import React, { useMemo } from "react";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineChartBar, HiOutlineUserGroup } from "react-icons/hi";

const AdminCommissionPanel = ({ orders = [] }) => {
  const stats = useMemo(() => {
    let total = 0;
    let pending = 0;
    let paid = 0;
    const referrers = {};

    orders?.forEach((o) => {
      if (o.referralCode) {
        const rate = o.commissionRate || 5;
        const amt = (o.totalPrice * rate) / 100;
        total += amt;
        if (o.status === "Delivered") paid += amt;
        else pending += amt;
        referrers[o.referralCode] = (referrers[o.referralCode] || 0) + amt;
      }
    });

    const top = Object.entries(referrers).sort((a, b) => b[1] - a[1]).slice(0, 5);
    return { total, pending, paid, top };
  }, [orders]);

  return (
    <section id="admin-commission" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Commission management</h2>
        <p className="text-sm text-gray-500 mt-1">Referral commission overview</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard title="Total commission" value={`RWF ${stats.total.toFixed(2)}`} icon={HiOutlineChartBar} />
        <DashboardStatCard title="Pending" value={`RWF ${stats.pending.toFixed(2)}`} icon={HiOutlineChartBar} />
        <DashboardStatCard title="Paid" value={`RWF ${stats.paid.toFixed(2)}`} icon={HiOutlineChartBar} />
        <DashboardStatCard title="Default rate" value="5%" icon={HiOutlineUserGroup} subtitle="Platform default" />
      </div>
      <div className="dashboard-section yebone-surface">
        <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Top referrers</h3>
        {stats.top.length === 0 ? (
          <p className="text-sm text-gray-500">No commission activity yet.</p>
        ) : (
          <ul className="space-y-3">
            {stats.top.map(([code, amt]) => (
              <li key={code}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="dark:text-white">{code}</span>
                  <span className="font-semibold text-yebone-primary">RWF {amt.toFixed(2)}</span>
                </div>
                <div className="dashboard-chart-bar">
                  <div className="dashboard-chart-bar-fill" style={{ width: `${(amt / stats.top[0][1]) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
};

export default AdminCommissionPanel;
