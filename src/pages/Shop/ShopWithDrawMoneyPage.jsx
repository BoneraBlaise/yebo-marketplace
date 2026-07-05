import React from "react";
import VendorDashboardLayout from "../../components/Dashboard/VendorDashboardLayout";
import WithdrawMoney from "../../components/Shop/WithdrawMoney";

const ShopWithDrawMoneyPage = () => (
  <VendorDashboardLayout active={7} bare>
    <WithdrawMoney />
  </VendorDashboardLayout>
);

export default ShopWithDrawMoneyPage;
