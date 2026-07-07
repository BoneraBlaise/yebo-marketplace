import { logCommerceDiagnostics } from "./CommerceDiagnostics";

/** AI ROI Engine — Phase 8D */
export class ROIEngine {
  constructor() {
    this.previews = [];
    this.orders = [];
  }

  recordPreview({ vendorId, productId, ai_preview_type, metadata = {} } = {}) {
    const entry = {
      id: `roi-preview-${Date.now()}`,
      vendorId,
      productId,
      ai_preview_type,
      timestamp: new Date().toISOString(),
      metadata,
    };
    this.previews.push(entry);
    logCommerceDiagnostics("roi", { event: "preview", ai_preview_type });
    return entry;
  }

  recordOrder({ vendorId, productId, revenue = 0, afterPreview = false, previewId = null } = {}) {
    const entry = {
      id: `roi-order-${Date.now()}`,
      vendorId,
      productId,
      revenue: Number(revenue) || 0,
      afterPreview,
      previewId,
      timestamp: new Date().toISOString(),
    };
    this.orders.push(entry);
    logCommerceDiagnostics("roi", { event: "order", revenue: entry.revenue, afterPreview });
    return entry;
  }

  getMetrics(vendorId = null) {
    let previews = this.previews;
    let orders = this.orders;
    if (vendorId) {
      previews = previews.filter((p) => p.vendorId === vendorId);
      orders = orders.filter((o) => o.vendorId === vendorId);
    }

    const ordersAfterPreview = orders.filter((o) => o.afterPreview);
    const revenueAttributed = ordersAfterPreview.reduce((sum, o) => sum + o.revenue, 0);
    const totalRevenue = orders.reduce((sum, o) => sum + o.revenue, 0);
    const conversionRate = previews.length
      ? ordersAfterPreview.length / previews.length
      : 0;

    return {
      aiPreviews: previews.length,
      ordersAfterPreview: ordersAfterPreview.length,
      totalOrders: orders.length,
      revenueAttributedToAI: revenueAttributed,
      totalRevenue,
      conversionIncrease: conversionRate,
      roi: revenueAttributed > 0 ? revenueAttributed / Math.max(previews.length, 1) : 0,
    };
  }
}

export const createROIEngine = (options) => new ROIEngine(options);

export default ROIEngine;
