import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  ControlCenterCard,
  ControlCenterShell,
  ControlCenterSkeleton,
  MetricCard,
  SimpleBarChart,
  StickySaveBar,
  ToggleSwitch,
} from "../shell/ControlCenterShell";
import { AI_PRODUCT_CATALOG, formatCurrency } from "../constants/platformCatalog";
import { fetchAiAdminProducts, updateAiAdminProducts } from "../../../services/platformConfigurationService";

const AIControlCenter = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState("");
  const [products, setProducts] = useState({});
  const [initialProducts, setInitialProducts] = useState({});
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchAiAdminProducts();
      const catalog = response?.data?.products || [];
      const mapped = {};
      catalog.forEach((item) => {
        mapped[item.id] = item;
      });
      AI_PRODUCT_CATALOG.forEach(({ id }) => {
        if (!mapped[id]) {
          mapped[id] = {
            id,
            enabled: true,
            monthlyPrice: 15000,
            promotionPrice: null,
            freeTrialDays: 7,
            creditsIncluded: 100,
            creditPrice: 150,
            maxUsagePerMonth: 1000,
            vendorEligibility: "all",
          };
        }
      });
      setProducts(mapped);
      setInitialProducts(JSON.parse(JSON.stringify(mapped)));
      setMetrics(response?.data?.metrics);
      setHealth(response?.data?.health);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to load AI control center");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dirty = useMemo(
    () => JSON.stringify(products) !== JSON.stringify(initialProducts),
    [products, initialProducts]
  );

  const updateProduct = (id, field, value) => {
    setProducts((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateAiAdminProducts(products, reason.trim());
      toast.success("AI product configuration saved");
      setReason("");
      await loadData();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to save AI settings");
    } finally {
      setSaving(false);
    }
  };

  const enabledCount = Object.values(products).filter((item) => item.enabled !== false).length;

  return (
    <ControlCenterShell
      title="AI Control Center"
      subtitle="AI Marketplace Admin — pricing, credits, eligibility, and vendor dashboard integration."
    >
      {loading ? (
        <ControlCenterSkeleton rows={4} />
      ) : (
        <>
          <div className="admin-cc-grid admin-cc-grid--4 mb-4">
            <MetricCard label="Active AI products" value={enabledCount} />
            <MetricCard label="Runtime" value={health?.healthy ? "Healthy" : "Degraded"} />
            <MetricCard label="Version" value={health?.version || "—"} />
            <MetricCard label="Provider" value={health?.primaryProvider || "mock"} />
          </div>

          <div className="admin-cc-ai-grid">
            {AI_PRODUCT_CATALOG.map(({ id, name }) => {
              const config = products[id] || {};
              return (
                <ControlCenterCard key={id} className="admin-cc-ai-card">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="admin-cc-ai-card__title dark:text-white">{name}</p>
                      <p className="text-xs text-gray-500 mt-1">Vendor dashboard: plan, credits, usage, upgrade</p>
                    </div>
                    <ToggleSwitch
                      enabled={config.enabled !== false}
                      onChange={(enabled) => updateProduct(id, "enabled", enabled)}
                      label={`Toggle ${name}`}
                    />
                  </div>
                  <div className="admin-cc-grid admin-cc-grid--2 gap-2">
                    <div className="admin-cc-field">
                      <label>Monthly price</label>
                      <input
                        type="number"
                        value={config.monthlyPrice ?? 0}
                        onChange={(e) => updateProduct(id, "monthlyPrice", Number(e.target.value))}
                      />
                    </div>
                    <div className="admin-cc-field">
                      <label>Promotion price</label>
                      <input
                        type="number"
                        value={config.promotionPrice ?? ""}
                        onChange={(e) =>
                          updateProduct(id, "promotionPrice", e.target.value === "" ? null : Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="admin-cc-field">
                      <label>Free trial (days)</label>
                      <input
                        type="number"
                        value={config.freeTrialDays ?? 0}
                        onChange={(e) => updateProduct(id, "freeTrialDays", Number(e.target.value))}
                      />
                    </div>
                    <div className="admin-cc-field">
                      <label>Credits included</label>
                      <input
                        type="number"
                        value={config.creditsIncluded ?? 0}
                        onChange={(e) => updateProduct(id, "creditsIncluded", Number(e.target.value))}
                      />
                    </div>
                    <div className="admin-cc-field">
                      <label>Credit price</label>
                      <input
                        type="number"
                        value={config.creditPrice ?? 0}
                        onChange={(e) => updateProduct(id, "creditPrice", Number(e.target.value))}
                      />
                    </div>
                    <div className="admin-cc-field">
                      <label>Max usage / month</label>
                      <input
                        type="number"
                        value={config.maxUsagePerMonth ?? 0}
                        onChange={(e) => updateProduct(id, "maxUsagePerMonth", Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div className="admin-cc-field">
                    <label>Vendor eligibility</label>
                    <select
                      value={config.vendorEligibility || "all"}
                      onChange={(e) => updateProduct(id, "vendorEligibility", e.target.value)}
                    >
                      <option value="all">All vendors</option>
                      <option value="verified">Verified vendors</option>
                      <option value="premium">Premium subscribers</option>
                    </select>
                  </div>
                  <p className="text-xs text-gray-500">
                    Preview: {formatCurrency(config.promotionPrice ?? config.monthlyPrice)}/mo ·{" "}
                    {config.creditsIncluded} credits
                  </p>
                </ControlCenterCard>
              );
            })}
          </div>

          {metrics ? (
            <ControlCenterCard className="mt-4">
              <h3 className="font-semibold mb-3 dark:text-white">Usage analytics</h3>
              <SimpleBarChart
                items={Object.entries(products)
                  .filter(([, cfg]) => cfg.enabled !== false)
                  .slice(0, 6)
                  .map(([id, cfg]) => ({
                    name: AI_PRODUCT_CATALOG.find((item) => item.id === id)?.name || id,
                    value: cfg.maxUsagePerMonth || cfg.creditsIncluded || 1,
                  }))}
              />
            </ControlCenterCard>
          ) : null}
        </>
      )}

      <StickySaveBar
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        onDiscard={() => setProducts(JSON.parse(JSON.stringify(initialProducts)))}
        reason={reason}
        onReasonChange={setReason}
      />
    </ControlCenterShell>
  );
};

export default AIControlCenter;
