import { useMemo } from "react";
import { createCommerceEngine } from "../../ai/commerce";
import { createExperienceOrchestrator } from "../../ai/experience";

/** Vendor experience hook — Experience Services + Commerce — Phase 8H.3 */
export const useVendorExperience = (vendorId = "demo-vendor") => {
  const orchestrator = useMemo(() => {
    const commerce = createCommerceEngine({ vendorId });
    const exp = createExperienceOrchestrator({ commerceEngine: commerce });
    exp.initialize({ vendorId });
    return exp;
  }, [vendorId]);

  const getDashboard = () => orchestrator.vendor.getDashboard(vendorId);
  const getCredits = () => orchestrator.vendor.getCredits(vendorId);
  const getSubscription = () => orchestrator.vendor.getSubscription(vendorId);
  const getAnalytics = () => orchestrator.vendor.getAnalytics(vendorId);
  const getROI = () => orchestrator.vendor.getROI(vendorId);
  const getRecommendations = () => orchestrator.vendor.getRecommendations(vendorId);
  const getUsage = () => orchestrator.vendor.getUsage(vendorId);
  const getBillingSummary = () => orchestrator.vendor.getBillingSummary(vendorId);

  return {
    orchestrator,
    vendorId,
    getDashboard,
    getCredits,
    getSubscription,
    getAnalytics,
    getROI,
    getRecommendations,
    getUsage,
    getBillingSummary,
  };
};

export default useVendorExperience;
