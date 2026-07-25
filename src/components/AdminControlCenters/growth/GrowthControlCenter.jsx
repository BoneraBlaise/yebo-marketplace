import React, { useState } from "react";
import { ControlCenterShell, ControlCenterTabs } from "../shell/ControlCenterShell";
import AdminGrowthCommercePanel from "../../GrowthCommerce/AdminGrowthCommercePanel";
import AdminGrowthSettings from "../../Dashboard/admin/AdminGrowthSettings";

const TABS = [
  { id: "commerce", label: "Marketing Modules" },
  { id: "features", label: "Growth Features" },
];

const GrowthControlCenter = () => {
  const [activeTab, setActiveTab] = useState("commerce");

  return (
    <ControlCenterShell
      title="Growth Center"
      subtitle="Marketing control center — featured products, promotions, search boost, flash sale, and homepage sections."
    >
      <ControlCenterTabs tabs={TABS} active={activeTab} onChange={setActiveTab} />
      {activeTab === "commerce" ? (
        <div className="-mx-1">
          <AdminGrowthCommercePanel />
        </div>
      ) : (
        <AdminGrowthSettings />
      )}
    </ControlCenterShell>
  );
};

export default GrowthControlCenter;
