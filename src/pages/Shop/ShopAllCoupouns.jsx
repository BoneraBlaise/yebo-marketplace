import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import AllCoupons from "../../components/Shop/AllCoupons";

const ShopAllCoupouns = () => (
  <VendorDashboardLayout active={9} bare>
    <AllCoupons />
  </VendorDashboardLayout>
);

export default ShopAllCoupouns;
