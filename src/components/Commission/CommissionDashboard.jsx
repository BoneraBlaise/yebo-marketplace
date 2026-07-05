import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCommissionDashboard, joinCommissionProgram } from "../../redux/actions/order";
import { FaMoneyBillWave, FaClock, FaShoppingCart, FaChartLine } from "react-icons/fa";
import { DataGrid } from "@material-ui/data-grid";
import { useTranslation } from "react-i18next";

const CommissionDashboard = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const { commissionStats, commissionLoading } = useSelector((state) => state.order);

  useEffect(() => {
    // Fetch commission data when component mounts and user is a commissioner
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
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "productName",
      headerName: t("product.title"),
      minWidth: 200,
      flex: 1,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    },
    {
      field: "amount",
      headerName: t("profile.saleAmount"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      renderCell: (params) => `RWF ${params.value.toLocaleString()}`
    },
    {
      field: "commission",
      headerName: t("profile.commission"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
      renderCell: (params) => `RWF ${params.value.toLocaleString()}`
    },
    {
      field: "status",
      headerName: t("common.status"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: (params) => {
        const status = params.value.toLowerCase();
        return `${
          status === 'paid' 
            ? 'text-green-600' 
            : status === 'pending' 
              ? 'text-yellow-600' 
              : 'text-red-600'
        } dark:text-white`;
      },
    },
    {
      field: "date",
      headerName: t("common.date"),
      minWidth: 130,
      flex: 0.7,
      headerClassName: 'dark:text-white',
      cellClassName: 'dark:text-white',
    }
  ];

  // Update the stats card values
  const statsCards = [
    {
      title: t("profile.totalEarnings"),
      value: `RWF ${commissionStats?.stats?.balance?.total?.toLocaleString() || 0}`,
      icon: <FaMoneyBillWave size={24} />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: t("profile.availableBalance"),
      value: `RWF ${commissionStats?.stats?.balance?.available?.toLocaleString() || 0}`,
      icon: <FaMoneyBillWave size={24} />,
      color: "bg-green-100 text-green-600"
    },
    {
      title: t("profile.pendingBalance"),
      value: `RWF ${commissionStats?.stats?.balance?.pending?.toLocaleString() || 0}`,
      icon: <FaClock size={24} />,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: t("profile.totalSales"),
      value: commissionStats?.stats?.performance?.totalSales || 0,
      icon: <FaShoppingCart size={24} />,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: t("profile.totalClicks"),
      value: commissionStats?.stats?.performance?.totalClicks || 0,
      icon: <FaChartLine size={24} />,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: t("profile.conversionRate"),
      value: `${commissionStats?.stats?.performance?.conversionRate || 0}%`,
      icon: <FaChartLine size={24} />,
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  // Update the rows mapping for the DataGrid
  const rows = commissionStats?.stats?.recentActivity?.sales?.map((sale) => ({
    id: sale.orderId,
    orderId: sale.orderId,
    productName: sale.productName,
    amount: sale.amount,
    commission: sale.commission,
    status: sale.status,
    date: new Date(sale.date).toLocaleDateString()
  })) || [];

  // Update the commission rates section
  const commissionRatesData = commissionStats?.stats?.commissionRates || {};

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white dark:bg-[#2b2b2b] p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
          <h3 className="text-2xl font-bold dark:text-white">{value}</h3>
        </div>
      </div>
    </div>
  );

  if (commissionLoading) {
    return (
      <div className="w-full flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#29625d]"></div>
      </div>
    );
  }

  if (!user?.isCommissioner) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">{t("profile.joinCommissionProgram")}</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("profile.commissionProgramDesc")}
          </p>
          <button
            onClick={() => dispatch(joinCommissionProgram())}
            className="bg-[#29625d] text-white py-2 px-6 rounded-md hover:bg-[#1f4e45]"
          >
            {t("common.joinNow")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold dark:text-white">{t("profile.commissionDashboard")}</h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t("profile.yourReferralCode")}: <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {commissionStats?.referralCode}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statsCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Commission Rates Performance */}
      <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-6 dark:text-white">{t("profile.commissionRatePerformance")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(commissionStats?.stats?.commissionRates || {}).map(([rate, data]) => (
            <div key={rate} className="p-4 border rounded-lg dark:border-gray-700">
              <h4 className="text-lg font-medium mb-2 dark:text-white">
                {rate.replace(/([A-Z])/g, ' $1').trim()}
              </h4>
              <p className="text-2xl font-bold mb-1 dark:text-white">
                RWF {data.earned?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {data.count || 0} {t("profile.sales")}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sales */}
      <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-6 mb-8">
        <h3 className="text-xl font-semibold mb-6 dark:text-white">{t("profile.recentSales")}</h3>
        <div style={{ height: 400, width: '100%' }}>
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

      {/* Shop Performance */}
      {commissionStats?.stats?.shopPerformance?.length > 0 && (
        <div className="bg-white dark:bg-[#2b2b2b] rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-6 dark:text-white">{t("profile.shopPerformance")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commissionStats.stats.shopPerformance.map((shop, index) => (
              <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                <h4 className="text-lg font-medium mb-2 dark:text-white">{shop.shopName}</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("profile.totalEarnings")}: RWF {shop.totalEarnings.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("common.pending")}: RWF {shop.pendingAmount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
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