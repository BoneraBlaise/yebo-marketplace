export const simulateCommissionPreview = (orderAmount, categoryId, categoryCommissions, referralRate = 5) => {
  const config = categoryCommissions?.[categoryId] || { percentage: 10, minFee: 0, maxFee: null, fixedFee: 0 };
  let platformRevenue = Number(config.fixedFee || 0);
  if (Number(config.percentage) > 0) platformRevenue += orderAmount * (Number(config.percentage) / 100);
  if (config.minFee) platformRevenue = Math.max(platformRevenue, Number(config.minFee));
  if (config.maxFee != null) platformRevenue = Math.min(platformRevenue, Number(config.maxFee));
  platformRevenue = Math.round(platformRevenue);
  const vendorRevenue = Math.max(orderAmount - platformRevenue, 0);
  const referralRevenue = Math.round(vendorRevenue * (Number(referralRate) / 100));
  return {
    platformRevenue,
    vendorRevenue: Math.max(vendorRevenue - referralRevenue, 0),
    referralRevenue,
  };
};

export const simulateReferralPreview = (orderAmount, referralSettings, categoryId = "phones") => {
  const rate = Number(referralSettings?.categoryRates?.[categoryId] ?? 1);
  const commissionPayout = Math.min(
    Math.round(orderAmount * (rate / 100)),
    Number(referralSettings?.commissionCap || Infinity)
  );
  return {
    commissionPayout,
    vendorPayout: Math.round(orderAmount * 0.85),
    platformPayout: Math.round(orderAmount * 0.1),
  };
};

export const simulateAiPreview = (aiProducts, activeVendors = 120) => {
  const products = Object.values(aiProducts || {});
  const enabled = products.filter((item) => item?.enabled !== false);
  const monthly = enabled.reduce((sum, item) => sum + Number(item.monthlyPrice || 0), 0);
  const monthlyRevenue = monthly * activeVendors * 0.35;
  return {
    expectedMonthlyRevenue: Math.round(monthlyRevenue),
    expectedYearlyRevenue: Math.round(monthlyRevenue * 12),
    vendorAdoptionEstimate: Math.round(activeVendors * (enabled.length / Math.max(products.length, 1))),
  };
};

export const simulateDeliveryPreview = (settings, distanceKm = 5) => {
  const pricing = settings?.pricing || settings || {};
  const customerPays =
    Number(pricing.baseFee || 2000) +
    distanceKm * Number(pricing.perKm || 500) +
    Number(pricing.expressFee || 0) * 0.5;
  const platformFee = Math.round(customerPays * 0.15);
  return {
    customerPays: Math.round(customerPays),
    vendorReceives: Math.round(customerPays - platformFee),
    platformFee,
    etaEstimate: `${55 + distanceKm * 4} min`,
  };
};
