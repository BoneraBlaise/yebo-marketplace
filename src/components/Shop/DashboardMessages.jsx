import React from "react";
import MessagingCenter from "../Communication/MessagingCenter";

const DashboardMessages = () => (
  <div className="dashboard-page py-4 sm:py-6">
    <MessagingCenter mode="seller" title="Shop messages" />
  </div>
);

export default DashboardMessages;
