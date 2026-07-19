import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { HiOutlineTicket } from "react-icons/hi";
import { fetchCouponStatistics, fetchCouponUsage } from "../../../services/growthConfigurationService";

const AdminCouponMonitor = () => {
  const [stats, setStats] = useState(null);
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsResponse, usageResponse] = await Promise.all([
        fetchCouponStatistics(),
        fetchCouponUsage(25),
      ]);
      setStats(statsResponse?.data || null);
      setUsage(usageResponse?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load coupon statistics");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const summary = stats?.summary || {};

  return (
    <section id="admin-coupon-monitor" className="space-y-6 scroll-mt-24 yebone-fade-up">
      <div>
        <h2 className="font-Poppins text-xl font-semibold dark:text-white flex items-center gap-2">
          <HiOutlineTicket className="text-yebone-primary" size={22} />
          Coupon monitor
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          Read-only global coupon monitoring for Super Admin. Vendor coupon data is preserved.
        </p>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading coupon statistics...</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-4">
            {[
              ["Total", summary.total],
              ["Active", summary.active],
              ["Expired", summary.expired],
              ["Disabled", summary.disabled],
              ["Redemptions", summary.totalRedemptions],
            ].map(([label, value]) => (
              <div key={label} className="yebone-surface rounded-2xl p-4">
                <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
                <p className="text-2xl font-semibold dark:text-white">{value || 0}</p>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <CouponList title="Most used" items={stats?.mostUsed || []} />
            <CouponList title="Least used" items={stats?.leastUsed || []} />
            <CouponList title="Active coupons" items={stats?.activeCoupons || []} />
            <CouponList title="Expired coupons" items={stats?.expiredCoupons || []} />
          </div>

          <div className="yebone-surface rounded-2xl p-5">
            <h3 className="font-semibold dark:text-white mb-3">Recent usage</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="p-2">Code</th>
                    <th className="p-2">Shop</th>
                    <th className="p-2">Uses</th>
                    <th className="p-2">Limit</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {usage.map((item) => (
                    <tr key={item.id} className="border-t border-gray-100 dark:border-gray-800 dark:text-white">
                      <td className="p-2">{item.code}</td>
                      <td className="p-2">{item.shopId}</td>
                      <td className="p-2">{item.usageCount}</td>
                      <td className="p-2">{item.usageLimit ?? "∞"}</td>
                      <td className="p-2">{item.isActive ? "Active" : "Disabled"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

const CouponList = ({ title, items }) => (
  <div className="yebone-surface rounded-2xl p-5">
    <h3 className="font-semibold dark:text-white mb-3">{title}</h3>
    <div className="space-y-2">
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">No coupons found.</p>
      ) : (
        items.map((item) => (
          <div key={item.id} className="flex items-center justify-between text-sm dark:text-gray-300">
            <span>{item.code}</span>
            <span>{item.usageCount || 0} uses</span>
          </div>
        ))
      )}
    </div>
  </div>
);

export default AdminCouponMonitor;
