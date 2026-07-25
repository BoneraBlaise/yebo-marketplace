import React from "react";
import AdminDashboardLayout from "../components/Dashboard/AdminDashboardLayout";
import CommissionCenter from "../components/AdminControlCenters/commission/CommissionCenter";
import ReferralCenter from "../components/AdminControlCenters/referral/ReferralCenter";
import AIControlCenter from "../components/AdminControlCenters/ai/AIControlCenter";
import DeliveryControlCenter from "../components/AdminControlCenters/delivery/DeliveryControlCenter";
import GrowthControlCenter from "../components/AdminControlCenters/growth/GrowthControlCenter";
import CommissionRulesCenter from "../components/AdminControlCenters/commissionRules/CommissionRulesCenter";
import CouponCenter from "../components/AdminControlCenters/coupon/CouponCenter";
import BannerManagementCenter from "../components/AdminControlCenters/banners/BannerManagementCenter";
import PlatformConfigurationCenter from "../components/AdminControlCenters/platform/PlatformConfigurationCenter";
import PropertyMobilityControlCenter from "../components/AdminControlCenters/propertyMobility/PropertyMobilityControlCenter";
import ConfigurationHistoryCenter from "../components/AdminControlCenters/history/ConfigurationHistoryCenter";
import FeatureFlagsCenter from "../components/AdminControlCenters/featureFlags/FeatureFlagsCenter";

export const AdminCommissionCenterPage = () => (
  <AdminDashboardLayout active={21} bare fullWidth>
    <CommissionCenter />
  </AdminDashboardLayout>
);

export const AdminReferralCenterPage = () => (
  <AdminDashboardLayout active={22} bare fullWidth>
    <ReferralCenter />
  </AdminDashboardLayout>
);

export const AdminAIControlCenterPage = () => (
  <AdminDashboardLayout active={23} bare fullWidth>
    <AIControlCenter />
  </AdminDashboardLayout>
);

export const AdminDeliveryControlCenterPage = () => (
  <AdminDashboardLayout active={27} bare fullWidth>
    <DeliveryControlCenter />
  </AdminDashboardLayout>
);

export const AdminGrowthControlCenterPage = () => (
  <AdminDashboardLayout active={28} bare fullWidth>
    <GrowthControlCenter />
  </AdminDashboardLayout>
);

export const AdminCommissionRulesPage = () => (
  <AdminDashboardLayout active={29} bare fullWidth>
    <CommissionRulesCenter />
  </AdminDashboardLayout>
);

export const AdminCouponCenterPage = () => (
  <AdminDashboardLayout active={30} bare fullWidth>
    <CouponCenter />
  </AdminDashboardLayout>
);

export const AdminBannerManagementPage = () => (
  <AdminDashboardLayout active={35} bare fullWidth>
    <BannerManagementCenter />
  </AdminDashboardLayout>
);

export const AdminPlatformConfigurationPage = () => (
  <AdminDashboardLayout active={36} bare fullWidth>
    <PlatformConfigurationCenter />
  </AdminDashboardLayout>
);

export const AdminPropertyMobilityControlCenterPage = () => (
  <AdminDashboardLayout active={33} bare fullWidth>
    <PropertyMobilityControlCenter />
  </AdminDashboardLayout>
);

export const AdminConfigurationHistoryPage = () => (
  <AdminDashboardLayout active={37} bare fullWidth>
    <ConfigurationHistoryCenter />
  </AdminDashboardLayout>
);

export const AdminFeatureFlagsPage = () => (
  <AdminDashboardLayout active={38} bare fullWidth>
    <FeatureFlagsCenter />
  </AdminDashboardLayout>
);
