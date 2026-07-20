import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import VendorDashboardLayout from "../components/Dashboard/VendorDashboardLayout";
import {
  ResponsiveDataTable,
  SellerOperationsStatusBanner,
} from "../components/SellerOperations/sellerOperationsUi";
import {
  formatCurrency,
  formatStockStatus,
  resolveSellerOperationsErrorMessage,
} from "../components/SellerOperations/sellerOperationsHelpers";
import {
  adjustVendorInventory,
  createVendorPurchaseOrder,
  createVendorReturn,
  createVendorSupplier,
  exportVendorBulkCsv,
  fetchSellerOperationsAvailability,
  fetchVendorAlerts,
  fetchVendorInventory,
  fetchVendorPurchaseOrders,
  fetchVendorReturns,
  fetchVendorSellerDashboard,
  fetchVendorStockMovements,
  fetchVendorSuppliers,
  importVendorBulkCsv,
  receiveVendorPurchaseOrder,
  updateVendorReturnStatus,
} from "../services/sellerOperationsService";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "inventory", label: "Inventory" },
  { id: "suppliers", label: "Suppliers" },
  { id: "purchase-orders", label: "Purchase Orders" },
  { id: "returns", label: "Returns" },
  { id: "bulk", label: "Bulk Ops" },
  { id: "movements", label: "Movements" },
];

const inputClass =
  "h-11 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm dark:text-white w-full";

const VendorSellerOperationsPage = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [featureDisabled, setFeatureDisabled] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [dashboard, setDashboard] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [returns, setReturns] = useState([]);
  const [movements, setMovements] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [supplierForm, setSupplierForm] = useState({ name: "", email: "", phone: "" });
  const [poForm, setPoForm] = useState({ supplierId: "", productId: "", quantity: 10 });
  const [returnForm, setReturnForm] = useState({ orderId: "", productId: "", quantity: 1, reason: "" });
  const [bulkCsv, setBulkCsv] = useState("productId,stock\n");
  const [adjustForm, setAdjustForm] = useState({ productId: "", quantityDelta: 0, reasonCode: "adjustment" });

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
        fetchVendorSellerDashboard(),
        fetchVendorInventory(),
        fetchVendorSuppliers(),
        fetchVendorPurchaseOrders(),
        fetchVendorReturns(),
        fetchVendorStockMovements(),
        fetchVendorAlerts(),
      ]);

      if (results[0].status === "fulfilled") setDashboard(results[0].value?.data || null);
      if (results[1].status === "fulfilled") setInventory(results[1].value?.data || []);
      if (results[2].status === "fulfilled") setSuppliers(results[2].value?.data || []);
      if (results[3].status === "fulfilled") setPurchaseOrders(results[3].value?.data || []);
      if (results[4].status === "fulfilled") setReturns(results[4].value?.data || []);
      if (results[5].status === "fulfilled") setMovements(results[5].value?.data || []);
      if (results[6].status === "fulfilled") setAlerts(results[6].value?.data || []);

      if (results.every((result) => result.status === "rejected")) {
        setLoadError("Unable to load seller operations data.");
      }
    } catch (error) {
      setLoadError(resolveSellerOperationsErrorMessage(error, "Unable to load seller operations"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const inventoryRows = useMemo(
    () =>
      inventory.map((item) => ({
        id: item.productId,
        productId: item.productId,
        productName: item.productName || item.productId,
        currentStock: item.currentStock,
        availableStock: item.availableStock,
        reservedStock: item.reservedStock,
        incomingStock: item.incomingStock,
        damagedStock: item.damagedStock,
        stockStatus: item.stockStatus,
        sku: item.sku || "—",
        barcode: item.barcode || "—",
      })),
    [inventory]
  );

  const handleAdjust = async (event) => {
    event.preventDefault();
    if (!adjustForm.productId) {
      toast.error("Product ID is required.");
      return;
    }
    try {
      await adjustVendorInventory(adjustForm.productId, adjustForm);
      toast.success("Inventory adjusted.");
      loadData();
    } catch (error) {
      toast.error(resolveSellerOperationsErrorMessage(error, "Adjustment failed"));
    }
  };

  const handleCreateSupplier = async (event) => {
    event.preventDefault();
    if (!supplierForm.name.trim()) {
      toast.error("Supplier name is required.");
      return;
    }
    try {
      await createVendorSupplier(supplierForm);
      toast.success("Supplier created.");
      setSupplierForm({ name: "", email: "", phone: "" });
      loadData();
    } catch (error) {
      toast.error(resolveSellerOperationsErrorMessage(error, "Unable to create supplier"));
    }
  };

  const handleCreatePo = async (event) => {
    event.preventDefault();
    if (!poForm.supplierId || !poForm.productId) {
      toast.error("Supplier and product are required.");
      return;
    }
    try {
      await createVendorPurchaseOrder({
        supplierId: poForm.supplierId,
        lineItems: [{ productId: poForm.productId, quantity: Number(poForm.quantity) || 1 }],
        status: "ordered",
      });
      toast.success("Purchase order created.");
      loadData();
    } catch (error) {
      toast.error(resolveSellerOperationsErrorMessage(error, "Unable to create purchase order"));
    }
  };

  const handleReceivePo = async (purchaseOrderId, productId, quantity) => {
    try {
      await receiveVendorPurchaseOrder(purchaseOrderId, [{ productId, quantity }]);
      toast.success("Stock received.");
      loadData();
    } catch (error) {
      toast.error(resolveSellerOperationsErrorMessage(error, "Receive failed"));
    }
  };

  const handleCreateReturn = async (event) => {
    event.preventDefault();
    if (!returnForm.orderId || !returnForm.productId) {
      toast.error("Order ID and product ID are required.");
      return;
    }
    try {
      await createVendorReturn(returnForm);
      toast.success("Return requested.");
      setReturnForm({ orderId: "", productId: "", quantity: 1, reason: "" });
      loadData();
    } catch (error) {
      toast.error(resolveSellerOperationsErrorMessage(error, "Unable to create return"));
    }
  };

  const handleBulkImport = async (event) => {
    event.preventDefault();
    try {
      const result = await importVendorBulkCsv(bulkCsv, "stock");
      if (result?.success) {
        toast.success("Bulk import applied.");
        loadData();
      } else {
        toast.error("Import validation failed. Check your CSV.");
      }
    } catch (error) {
      toast.error(resolveSellerOperationsErrorMessage(error, "Bulk import failed"));
    }
  };

  const handleBulkExport = async () => {
    try {
      const result = await exportVendorBulkCsv("stock");
      const csv = result?.data?.csv || "";
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "inventory-export.csv";
      link.click();
      URL.revokeObjectURL(url);
      toast.success("Export ready.");
    } catch (error) {
      toast.error(resolveSellerOperationsErrorMessage(error, "Export failed"));
    }
  };

  return (
    <VendorDashboardLayout active={23} bare>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Seller Operations</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage inventory, suppliers, purchase orders, returns, and analytics.
          </p>
        </div>

        {featureDisabled ? (
          <SellerOperationsStatusBanner
            tone="warning"
            title="Feature unavailable"
            message="Seller Operations is disabled for this marketplace."
          />
        ) : null}

        {loadError ? (
          <SellerOperationsStatusBanner tone="error" title="Load error" message={loadError} />
        ) : null}

        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Seller operations sections">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              className={`min-h-[44px] px-4 rounded-xl text-sm font-medium ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? <p className="text-sm text-gray-500">Loading seller operations…</p> : null}

        {!loading && activeTab === "overview" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: "Inventory Value", value: formatCurrency(dashboard?.inventoryValue) },
              { label: "Low Stock Items", value: dashboard?.lowStock?.length || 0 },
              { label: "Out of Stock", value: dashboard?.outOfStock?.length || 0 },
              { label: "Stock Turnover", value: dashboard?.stockTurnover ?? 0 },
            ].map((metric) => (
              <div
                key={metric.label}
                className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900"
              >
                <p className="text-sm text-gray-500">{metric.label}</p>
                <p className="text-2xl font-semibold mt-2">{metric.value}</p>
              </div>
            ))}
            {alerts.length ? (
              <div className="sm:col-span-2 xl:col-span-4">
                <SellerOperationsStatusBanner
                  tone="warning"
                  title="Stock alerts"
                  message={`${alerts.length} active alert(s) require attention.`}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        {!loading && activeTab === "inventory" ? (
          <div className="space-y-4">
            <form onSubmit={handleAdjust} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label className="sr-only" htmlFor="adjust-product-id">
                Product ID
              </label>
              <input
                id="adjust-product-id"
                className={inputClass}
                placeholder="Product ID"
                value={adjustForm.productId}
                onChange={(e) => setAdjustForm((prev) => ({ ...prev, productId: e.target.value }))}
              />
              <label className="sr-only" htmlFor="adjust-delta">
                Quantity delta
              </label>
              <input
                id="adjust-delta"
                type="number"
                className={inputClass}
                placeholder="Quantity delta"
                value={adjustForm.quantityDelta}
                onChange={(e) => setAdjustForm((prev) => ({ ...prev, quantityDelta: Number(e.target.value) }))}
              />
              <label className="sr-only" htmlFor="adjust-reason">
                Reason code
              </label>
              <select
                id="adjust-reason"
                className={inputClass}
                value={adjustForm.reasonCode}
                onChange={(e) => setAdjustForm((prev) => ({ ...prev, reasonCode: e.target.value }))}
              >
                <option value="adjustment">Adjustment</option>
                <option value="damage">Damage</option>
                <option value="correction">Correction</option>
              </select>
              <button type="submit" className="h-11 rounded-xl bg-blue-600 text-white font-medium">
                Adjust Stock
              </button>
            </form>

            <ResponsiveDataTable
              columns={[
                { key: "productName", label: "Product" },
                { key: "currentStock", label: "Current" },
                { key: "availableStock", label: "Available" },
                { key: "reservedStock", label: "Reserved" },
                { key: "incomingStock", label: "Incoming" },
                { key: "damagedStock", label: "Damaged" },
                {
                  key: "stockStatus",
                  label: "Status",
                  render: (row) => formatStockStatus(row.stockStatus),
                },
              ]}
              rows={inventoryRows}
            />
          </div>
        ) : null}

        {!loading && activeTab === "suppliers" ? (
          <div className="space-y-4">
            <form onSubmit={handleCreateSupplier} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <label className="sr-only" htmlFor="supplier-name">
                Supplier name
              </label>
              <input
                id="supplier-name"
                className={inputClass}
                placeholder="Supplier name"
                value={supplierForm.name}
                onChange={(e) => setSupplierForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <label className="sr-only" htmlFor="supplier-email">
                Email
              </label>
              <input
                id="supplier-email"
                className={inputClass}
                placeholder="Email"
                value={supplierForm.email}
                onChange={(e) => setSupplierForm((prev) => ({ ...prev, email: e.target.value }))}
              />
              <label className="sr-only" htmlFor="supplier-phone">
                Phone
              </label>
              <input
                id="supplier-phone"
                className={inputClass}
                placeholder="Phone"
                value={supplierForm.phone}
                onChange={(e) => setSupplierForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
              <button type="submit" className="h-11 rounded-xl bg-blue-600 text-white font-medium">
                Add Supplier
              </button>
            </form>
            <ResponsiveDataTable
              columns={[
                { key: "name", label: "Name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "status", label: "Status" },
              ]}
              rows={suppliers.map((item) => ({ ...item, id: item.supplierId }))}
            />
          </div>
        ) : null}

        {!loading && activeTab === "purchase-orders" ? (
          <div className="space-y-4">
            <form onSubmit={handleCreatePo} className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <select
                className={inputClass}
                value={poForm.supplierId}
                onChange={(e) => setPoForm((prev) => ({ ...prev, supplierId: e.target.value }))}
                aria-label="Supplier"
              >
                <option value="">Select supplier</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.supplierId} value={supplier.supplierId}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              <input
                className={inputClass}
                placeholder="Product ID"
                value={poForm.productId}
                onChange={(e) => setPoForm((prev) => ({ ...prev, productId: e.target.value }))}
                aria-label="Product ID"
              />
              <input
                type="number"
                className={inputClass}
                placeholder="Quantity"
                value={poForm.quantity}
                onChange={(e) => setPoForm((prev) => ({ ...prev, quantity: e.target.value }))}
                aria-label="Quantity"
              />
              <button type="submit" className="h-11 rounded-xl bg-blue-600 text-white font-medium">
                Create PO
              </button>
            </form>
            <ResponsiveDataTable
              columns={[
                { key: "purchaseOrderId", label: "PO" },
                { key: "supplierId", label: "Supplier" },
                { key: "status", label: "Status" },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) =>
                    row.status !== "received" && row.status !== "cancelled" ? (
                      <button
                        type="button"
                        className="text-blue-600 text-sm font-medium min-h-[44px] px-2"
                        onClick={() =>
                          handleReceivePo(
                            row.purchaseOrderId,
                            row.lineItems?.[0]?.productId,
                            row.lineItems?.[0]?.quantity || 1
                          )
                        }
                      >
                        Receive
                      </button>
                    ) : (
                      "—"
                    ),
                },
              ]}
              rows={purchaseOrders.map((item) => ({ ...item, id: item.purchaseOrderId }))}
            />
          </div>
        ) : null}

        {!loading && activeTab === "returns" ? (
          <div className="space-y-4">
            <form onSubmit={handleCreateReturn} className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <input
                className={inputClass}
                placeholder="Order ID"
                value={returnForm.orderId}
                onChange={(e) => setReturnForm((prev) => ({ ...prev, orderId: e.target.value }))}
                aria-label="Order ID"
              />
              <input
                className={inputClass}
                placeholder="Product ID"
                value={returnForm.productId}
                onChange={(e) => setReturnForm((prev) => ({ ...prev, productId: e.target.value }))}
                aria-label="Product ID"
              />
              <input
                type="number"
                className={inputClass}
                placeholder="Qty"
                value={returnForm.quantity}
                onChange={(e) => setReturnForm((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                aria-label="Quantity"
              />
              <input
                className={inputClass}
                placeholder="Reason"
                value={returnForm.reason}
                onChange={(e) => setReturnForm((prev) => ({ ...prev, reason: e.target.value }))}
                aria-label="Reason"
              />
              <button type="submit" className="h-11 rounded-xl bg-blue-600 text-white font-medium">
                Request Return
              </button>
            </form>
            <ResponsiveDataTable
              columns={[
                { key: "returnId", label: "RMA" },
                { key: "orderId", label: "Order" },
                { key: "productId", label: "Product" },
                { key: "status", label: "Status" },
                {
                  key: "actions",
                  label: "Actions",
                  render: (row) =>
                    row.status === "requested" ? (
                      <button
                        type="button"
                        className="text-blue-600 text-sm font-medium min-h-[44px] px-2"
                        onClick={() => updateVendorReturnStatus(row.returnId, "approved").then(loadData)}
                      >
                        Approve
                      </button>
                    ) : (
                      row.status
                    ),
                },
              ]}
              rows={returns.map((item) => ({ ...item, id: item.returnId }))}
            />
          </div>
        ) : null}

        {!loading && activeTab === "bulk" ? (
          <div className="space-y-4">
            <form onSubmit={handleBulkImport} className="space-y-3">
              <label htmlFor="bulk-csv" className="text-sm font-medium">
                CSV Import (productId,stock)
              </label>
              <textarea
                id="bulk-csv"
                className="min-h-[160px] w-full rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-4 text-sm dark:bg-gray-900 dark:text-white"
                value={bulkCsv}
                onChange={(e) => setBulkCsv(e.target.value)}
              />
              <div className="flex flex-wrap gap-3">
                <button type="submit" className="h-11 px-5 rounded-xl bg-blue-600 text-white font-medium">
                  Validate & Import
                </button>
                <button
                  type="button"
                  className="h-11 px-5 rounded-xl border border-gray-300 dark:border-gray-600 font-medium"
                  onClick={handleBulkExport}
                >
                  Export CSV
                </button>
              </div>
            </form>
          </div>
        ) : null}

        {!loading && activeTab === "movements" ? (
          <ResponsiveDataTable
            columns={[
              { key: "movementId", label: "Movement" },
              { key: "productId", label: "Product" },
              { key: "type", label: "Type" },
              { key: "quantity", label: "Qty" },
              { key: "reasonCode", label: "Reason" },
              { key: "createdAt", label: "Date" },
            ]}
            rows={movements.map((item) => ({ ...item, id: item.movementId }))}
          />
        ) : null}
      </div>
    </VendorDashboardLayout>
  );
};

export default VendorSellerOperationsPage;
