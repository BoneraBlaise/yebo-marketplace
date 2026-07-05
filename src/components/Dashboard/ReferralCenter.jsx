import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  HiOutlineLink,
  HiOutlineQrcode,
  HiOutlineUserGroup,
  HiOutlineShare,
} from "react-icons/hi";
import { getCommissionDashboard } from "../../redux/actions/order";
import { Button, SectionTitle } from "../ui";
import DashboardStatCard from "./DashboardStatCard";

const ReferralCenter = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { commissionStats } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.isCommissioner) {
      dispatch(getCommissionDashboard());
    }
  }, [dispatch, user?.isCommissioner]);

  const referralCode =
    commissionStats?.referralCode ||
    user?.referralCode ||
    `YEBONE-${user?._id?.slice(-6)?.toUpperCase() || "GUEST"}`;

  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  const copyLink = () => {
    navigator.clipboard?.writeText(referralLink);
    toast.success("Referral link copied!");
  };

  const stats = commissionStats?.stats?.performance || {};
  const placeholders = {
    totalReferrals: stats.totalClicks || 0,
    activeReferrals: stats.totalSales || 0,
    purchases: stats.totalSales || 0,
    conversion: stats.conversionRate || 0,
    commissionPerReferral: commissionStats?.stats?.balance?.total
      ? Math.round(commissionStats.stats.balance.total / Math.max(stats.totalSales, 1))
      : 0,
  };

  return (
    <div className="space-y-8 yebone-fade-up">
      <SectionTitle
        title="Referral Center"
        subtitle="Invite friends and earn on Yebone — presentation preview"
        align="left"
        className="mb-0"
      />

      <div className="dashboard-referral-box">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-yebone-primary mb-1">
              Your referral link
            </p>
            <p className="font-mono text-sm break-all dark:text-gray-200">{referralLink}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={copyLink} className="yebone-btn-lift">
              <HiOutlineLink className="mr-1" />
              Copy link
            </Button>
            <Button variant="outline" className="yebone-btn-lift" onClick={() => toast.info("Share coming soon")}>
              <HiOutlineShare className="mr-1" />
              Share
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <DashboardStatCard title="Total referrals" value={placeholders.totalReferrals} icon={HiOutlineUserGroup} />
        <DashboardStatCard title="Active referrals" value={placeholders.activeReferrals} />
        <DashboardStatCard title="Successful purchases" value={placeholders.purchases} />
        <DashboardStatCard title="Conversion rate" value={`${placeholders.conversion}%`} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="dashboard-section yebone-surface flex flex-col items-center justify-center min-h-[180px]">
          <HiOutlineQrcode size={64} className="text-yebone-primary opacity-40 mb-3" />
          <p className="text-sm text-gray-500 text-center">QR code placeholder</p>
          <p className="text-xs text-gray-400 mt-1 font-mono">{referralCode}</p>
        </div>
        <div className="dashboard-section yebone-surface">
          <h3 className="font-semibold mb-3 dark:text-white">Rewards</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Share your link. When friends shop through it, you earn commission on qualifying
            purchases. Commission per referral (est.):{" "}
            <strong className="text-yebone-primary">
              RWF {placeholders.commissionPerReferral.toLocaleString()}
            </strong>
          </p>
          <Button className="mt-4 yebone-btn-lift" onClick={copyLink}>
            Invite friends
          </Button>
        </div>
      </div>

      <div className="dashboard-section yebone-surface">
        <h3 className="font-semibold mb-4 dark:text-white">Leaderboard</h3>
        <p className="text-sm text-gray-500">
          Top referrers placeholder — full leaderboard coming soon.
        </p>
      </div>
    </div>
  );
};

export default ReferralCenter;
