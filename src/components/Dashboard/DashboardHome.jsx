import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  HiOutlineShoppingBag,
  HiOutlineHeart,
  HiOutlineLocationMarker,
  HiOutlineBell,
} from "react-icons/hi";
import { FaCreativeCommonsSamplingPlus } from "react-icons/fa";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { SectionTitle, Button } from "../ui";
import DashboardStatCard from "./DashboardStatCard";

const DashboardHome = ({ setActive }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);
  const { wishlist } = useSelector((state) => state.wishlist);

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const pending =
    orders?.filter((o) => !["Delivered", "Refund Success"].includes(o.status))?.length || 0;
  const completed = orders?.filter((o) => o.status === "Delivered")?.length || 0;

  return (
    <div className="yebone-fade-up space-y-8">
      <div>
        <SectionTitle
          title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
          subtitle="Your Yebone account at a glance"
          align="left"
          className="mb-0"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <DashboardStatCard
          title="Orders"
          value={orders?.length || 0}
          icon={HiOutlineShoppingBag}
          subtitle={`${pending} active`}
          onClick={() => setActive(2)}
        />
        <DashboardStatCard
          title="Wishlist"
          value={wishlist?.length || 0}
          icon={HiOutlineHeart}
          onClick={() => setActive(10)}
        />
        <DashboardStatCard
          title="Addresses"
          value={user?.addresses?.length || 0}
          icon={HiOutlineLocationMarker}
          onClick={() => setActive(7)}
        />
        <DashboardStatCard
          title="Commission"
          value={user?.isCommissioner ? "Active" : "Join"}
          icon={FaCreativeCommonsSamplingPlus}
          subtitle={user?.isCommissioner ? "Earning enabled" : "Start earning"}
          onClick={() => setActive(9)}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Order summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Pending</span>
              <span className="font-semibold text-yebone-primary">{pending}</span>
            </div>
            <div className="dashboard-chart-bar">
              <div
                className="dashboard-chart-bar-fill"
                style={{
                  width: `${orders?.length ? (pending / orders.length) * 100 : 0}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-500">Completed</span>
              <span className="font-semibold text-green-600">{completed}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-section yebone-surface">
          <h3 className="font-Poppins font-semibold mb-4 dark:text-white">Quick actions</h3>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => setActive(2)} className="yebone-btn-lift">
              View orders
            </Button>
            <Button size="sm" variant="outline" onClick={() => setActive(5)} className="yebone-btn-lift">
              Track order
            </Button>
            <Button size="sm" variant="outline" onClick={() => setActive(10)} className="yebone-btn-lift">
              Wishlist
            </Button>
            <Button size="sm" variant="outline" onClick={() => setActive(11)} className="yebone-btn-lift">
              Referrals
            </Button>
          </div>
        </div>
      </div>

      <div className="dashboard-section yebone-surface">
        <div className="flex items-center gap-2 mb-3">
          <HiOutlineBell className="text-yebone-primary" />
          <h3 className="font-Poppins font-semibold dark:text-white">Recent activity</h3>
        </div>
        {orders?.length ? (
          <ul className="space-y-3">
            {orders.slice(0, 4).map((order) => (
              <li
                key={order._id}
                className="flex items-center justify-between text-sm py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
              >
                <span className="dark:text-gray-200">
                  Order #{order._id?.slice(0, 8)} — {order.status}
                </span>
                <span className="text-gray-500">{order.createdAt?.slice(0, 10)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No recent orders yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
