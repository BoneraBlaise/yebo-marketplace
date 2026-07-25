import React from "react";
import { ControlCenterShell } from "../shell/ControlCenterShell";
import AdminPropertyMobilityPanel from "../../PropertyMobility/AdminPropertyMobilityPanel";

const PropertyMobilityControlCenter = () => (
  <ControlCenterShell
    title="Property & Mobility Center"
    subtitle="Verification, featured listings, sponsored listings, agency subscriptions, payments, and analytics."
  >
    <AdminPropertyMobilityPanel />
  </ControlCenterShell>
);

export default PropertyMobilityControlCenter;
