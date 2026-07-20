import React, { useCallback, useEffect, useState } from "react";
import {
  ResponsiveDataTable,
  SellerOperationsStatusBanner,
} from "./sellerOperationsUi";
import { resolveSellerOperationsErrorMessage } from "./sellerOperationsHelpers";
import {
  fetchAdminInventory,
  fetchAdminPurchaseOrders,
  fetchAdminReturns,
  fetchAdminSellerOperationsDashboard,
  fetchAdminSuppliers,
  fetchSellerOperationsAvailability,
} from "../../services/sellerOperationsService";

const AdminSellerOperationsPanel = () => {
  const [loading, setLoading] = useState(true);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [returns, setReturns] = useState([]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const availability = await fetchSellerOperationsAvailability();
      if (availability.disabled || !availability.available) {
        setFeatureDisabled(true);
        return;
      }
      setFeatureDisabled(false);

      const results = await Promise.allSettled([
        fetchAdminSellerOperationsDashboard(),
        fetchAdminInventory(),
        fetchAdminSuppliers(),
        fetchAdminPurchaseOrders(),
        fetchAdminReturns(),
      ]);

      if (results[0].status === "fulfilled") setDashboard(results[0].value?.data || null);
      if (results[1].status === "fulfilled") setInventory(results[1].value?.data || []);
      if (results[2].status === "fulfilled") setSuppliers(results[2].value?.data || []);
      if (results[3].status === "fulfilled") setPurchaseOrders(results[3].value?.data || []);
      if (results[4].status === "fulfilled") setReturns(results[4].value?.data || []);

      if (results.every((result) => result.status === "rejected")) {
        setLoadError("Unable to load seller operations admin data.");
      }
    } catch (error) {
      setLoadError(resolveSellerOperationsErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Seller Operations</h1>
        <p className="text-sm text-gray-500 mt-1">
          Global inventory health, suppliers, purchase orders, and returns.
        </p>
      </div>

      {featureDisabled ? (
        <SellerOperationsStatusBanner
          tone="warning"
          title="Feature unavailable"
          message="Seller Operations is disabled for this marketplace."
        />
      ) : null}

      {loadError ? <SellerOperationsStatusBanner tone="error" title="Load error" message={loadError} /> : null}

      {loading ? <p className="text-sm text-gray-500">Loading…</p> : null}

      {!loading && dashboard ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { label: "Tracked Products", value: dashboard.inventoryHealth?.trackedProducts || 0 },
            { label: "Suppliers", value: dashboard.suppliersCount || 0 },
            { label: "Purchase Orders", value: dashboard.purchaseOrdersCount || 0 },
            { label: "Pending Returns", value: dashboard.globalStockInsights?.pendingReturns || 0 },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900"
            >
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-2xl font-semibold mt-2">{metric.value}</p>
            </div>
          ))}
        </div>
      ) : null}

      {!loading ? (
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-medium mb-3">Inventory Health</h2>
            <ResponsiveDataTable
              columns={[
                { key: "vendorId", label: "Vendor" },
                { key: "productId", label: "Product" },
                { key: "lowStockThreshold", label: "Low Threshold" },
                { key: "criticalStockThreshold", label: "Critical Threshold" },
              ]}
              rows={inventory.map((item) => ({ ...item, id: `${item.vendorId}-${item.productId}` }))}
            />
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Suppliers</h2>
            <ResponsiveDataTable
              columns={[
                { key: "vendorId", label: "Vendor" },
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "status", label: "Status" },
              ]}
              rows={suppliers.map((item) => ({ ...item, id: item.supplierId }))}
            />
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Purchase Orders</h2>
            <ResponsiveDataTable
              columns={[
                { key: "purchaseOrderId", label: "PO" },
                { key: "vendorId", label: "Vendor" },
                { key: "status", label: "Status" },
              ]}
              rows={purchaseOrders.map((item) => ({ ...item, id: item.purchaseOrderId }))}
            />
          </section>

          <section>
            <h2 className="text-lg font-medium mb-3">Returns</h2>
            <ResponsiveDataTable
              columns={[
                { key: "returnId", label: "RMA" },
                { key: "vendorId", label: "Vendor" },
                { key: "orderId", label: "Order" },
                { key: "status", label: "Status" },
              ]}
              rows={returns.map((item) => ({ ...item, id: item.returnId }))}
            />
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default AdminSellerOperationsPanel;
