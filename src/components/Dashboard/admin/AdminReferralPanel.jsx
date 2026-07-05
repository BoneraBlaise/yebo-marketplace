import React, { useMemo } from "react";
import DashboardStatCard from "../DashboardStatCard";
import { HiOutlineUserGroup, HiOutlineChartBar } from "react-icons/hi";

const AdminReferralPanel = ({ orders = [] }) => {
  const stats = useMemo(() => {
    const codes = {};
    orders?.forEach((o) => {
      if (o.referralCode) {
        codes[o.referralCode] = (codes[o.referralCode] || 0) + 1;
      }
    });
    const leaderboard = Object.entries(codes).sort((a, b) => b[1] - a[1]).slice(0, 8);
    const withReferral = orders?.filter((o) => o.referralCode).length || 0;
    const rate = orders?.length ? ((withReferral / orders.length) * 100).toFixed(1) : "0";
    return { leaderboard, withReferral, rate };
  }, [orders]);

  return (
    <section id="admin-referrals" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white">Referral management</h2>
        <p className="text-sm text-gray-500 mt-1">Campaign performance and leaderboard</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
        <DashboardStatCard title="Referral orders" value={stats.withReferral} icon={HiOutlineUserGroup} />
        <DashboardStatCard title="Conversion rate" value={`${stats.rate}%`} icon={HiOutlineChartBar} />
        <DashboardStatCard title="Active campaigns" value={stats.leaderboard.length} icon={HiOutlineChartBar} />
      </div>
      <div className="dashboard-section yebone-surface">
        <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Leaderboard</h3>
        {stats.leaderboard.length === 0 ? (
          <p className="text-sm text-gray-500">No referral data yet.</p>
        ) : (
          <ol className="space-y-2">
            {stats.leaderboard.map(([code, count], i) => (
              <li key={code} className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                <span className="w-6 h-6 rounded-full bg-yebone-primary/10 text-yebone-primary text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="flex-1 dark:text-white">{code}</span>
                <span className="font-semibold text-yebone-primary">{count} orders</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
};

export default AdminReferralPanel;
