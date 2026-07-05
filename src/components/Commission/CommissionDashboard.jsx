import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommissionDashboard, joinCommissionProgram } from "../../redux/actions/order";
import { FaMoneyBillWave, FaClock, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { DataGrid } from "@material-ui/data-grid";
import { useTranslation } from "react-i18next";
import { Button, SectionTitle } from "../ui";
import DashboardStatCard from "../Dashboard/DashboardStatCard";
import DashboardEmptyState from "../Dashboard/DashboardEmptyState";

const CommissionDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { commissionStats, commissionLoading } = useSelector((state) => state.order);

  useEffect(() => {
    if (user?.isCommissioner) {
      dispatch(getCommissionDashboard());
    }
  }, [dispatch, user?.isCommissioner]);

  const columns = [
    {
      field: "orderId",
      headerName: t("profile.orderID"),
      minWidth: 150,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "productName",
      headerName: t("product.title"),
      minWidth: 200,
      flex: 1,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
    {
      field: "amount",
      headerName: t("profile.saleAmount"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
      renderCell: (params) => `RWF ${params.value.toLocaleString()}`,
    },
    {
      field: "commission",
      headerName: t("profile.commission"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
      renderCell: (params) => `RWF ${params.value.toLocaleString()}`,
    },
    {
      field: "status",
      headerName: t("common.status"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: (params) => {
        const status = params.value.toLowerCase();
        return `${
          status === "paid"
            ? "text-green-600"
            : status === "pending"
            ? "text-yellow-600"
            : "text-red-600"
        } dark:text-white`;
      },
    },
    {
      field: "date",
      headerName: t("common.date"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: "dark:text-white",
      cellClassName: "dark:text-white",
    },
  ];

  const statsCards = [
    {
      title: t("profile.totalEarnings"),
      value: `RWF ${commissionStats?.stats?.balance?.total?.toLocaleString() || 0}`,
      icon: FaMoneyBillWave,
    },
    {
      title: t("profile.availableBalance"),
      value: `RWF ${commissionStats?.stats?.balance?.available?.toLocaleString() || 0}`,
      icon: FaMoneyBillWave,
    },
    {
      title: t("profile.pendingBalance"),
      value: `RWF ${commissionStats?.stats?.balance?.pending?.toLocaleString() || 0}`,
      icon: FaClock,
    },
    {
      title: "Paid commission",
      value: `RWF ${Math.max(
        0,
        (commissionStats?.stats?.balance?.total || 0) -
          (commissionStats?.stats?.balance?.pending || 0)
      ).toLocaleString()}`,
      icon: FaMoneyBillWave,
    },
    {
      title: t("profile.totalSales"),
      value: commissionStats?.stats?.performance?.totalSales || 0,
      icon: FaShoppingCart,
    },
    {
      title: t("profile.conversionRate"),
      value: `${commissionStats?.stats?.performance?.conversionRate || 0}%`,
      icon: FaChartLine,
    },
  ];

  const rows =
    commissionStats?.stats?.recentActivity?.sales?.map((sale) => ({
      id: sale.orderId,
      orderId: sale.orderId,
      productName: sale.productName,
      amount: sale.amount,
      commission: sale.commission,
      status: sale.status,
      date: new Date(sale.date).toLocaleDateString(),
    })) || [];

  if (commissionLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="dashboard-stat-card yebone-skeleton h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!user?.isCommissioner) {
    return (
      <DashboardEmptyState
        title={t("profile.joinCommissionProgram")}
        message={t("profile.commissionProgramDesc")}
        actionLabel={t("common.joinNow")}
        onAction={() => dispatch(joinCommissionProgram())}
      />
    );
  }

  return (
    <div className="space-y-8 yebone-fade-up">
      <SectionTitle
        title={t("profile.commissionDashboard")}
        subtitle={`${t("profile.yourReferralCode")}: ${commissionStats?.referralCode || "—"}`}
        align="left"
        className="mb-0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((card, index) => (
          <DashboardStatCard key={index} {...card} />
        ))}
      </div>

      <div className="dashboard-section yebone-surface">
        <h3 className="font-semibold mb-4 dark:text-white">Withdrawals</h3>
        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <DashboardStatCard
            title="Available balance"
            value={`RWF ${commissionStats?.stats?.balance?.available?.toLocaleString() || 0}`}
            icon={FaMoneyBillWave}
          />
          <DashboardStatCard
            title="Pending withdrawals"
            value={`RWF ${commissionStats?.stats?.balance?.pending?.toLocaleString() || 0}`}
            icon={FaClock}
          />
          <DashboardStatCard
            title="Lifetime earnings"
            value={`RWF ${commissionStats?.stats?.balance?.total?.toLocaleString() || 0}`}
            icon={FaChartLine}
          />
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Bank / wallet payout — presentation placeholder. Use existing seller withdrawal flow where applicable.
        </p>
        <Button variant="outline" size="sm" className="yebone-btn-lift" disabled>
          Request withdrawal
        </Button>
      </div>

      <div className="dashboard-section yebone-surface">
        <h3 className="font-semibold mb-4 dark:text-white">{t("profile.commissionRatePerformance")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(commissionStats?.stats?.commissionRates || {}).map(([rate, data]) => (
            <div key={rate} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-medium mb-2 dark:text-white capitalize">
                {rate.replace(/([A-Z])/g, " $1").trim()}
              </h4>
              <p className="text-xl font-bold text-yebone-primary mb-1">
                RWF {data.earned?.toLocaleString() || 0}
              </p>
              <div className="dashboard-chart-bar mt-2">
                <div
                  className="dashboard-chart-bar-fill"
                  style={{ width: `${Math.min(100, (data.count || 0) * 10)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                {data.count || 0} {t("profile.sales")}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-section yebone-surface">
        <h3 className="font-semibold mb-4 dark:text-white">{t("profile.recentSales")}</h3>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            className="dark:bg-[#1f1f1f] dark:text-white"
          />
        </div>
      </div>

      {commissionStats?.stats?.shopPerformance?.length > 0 && (
        <div className="dashboard-section yebone-surface">
          <h3 className="font-semibold mb-4 dark:text-white">{t("profile.shopPerformance")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commissionStats.stats.shopPerformance.map((shop, index) => (
              <div key={index} className="p-4 rounded-xl border border-gray-100 dark:border-gray-800 yebone-card-lift">
                <h4 className="font-medium mb-2 dark:text-white">{shop.shopName}</h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <p>
                    {t("profile.totalEarnings")}: RWF {shop.totalEarnings.toLocaleString()}
                  </p>
                  <p>
                    {t("common.pending")}: RWF {shop.pendingAmount.toLocaleString()}
                  </p>
                  <p>
                    {t("profile.completedSales")}: {shop.completedSales}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommissionDashboard;
