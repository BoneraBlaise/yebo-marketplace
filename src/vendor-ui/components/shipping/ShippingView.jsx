import React from "react";
import { Card, Button, DataTable, Badge, Tabs } from "../../../design-system/components";
import { mockShipping } from "../../data/mockVendorData";
import { logVendorUIDiagnostics } from "../../diagnostics/VendorUIDiagnostics";

export const ShippingView = ({ shipping = mockShipping }) => {
  const [tab, setTab] = React.useState("partners");
  logVendorUIDiagnostics("component", { name: "ShippingView", tab });

  return (
    <div aria-label="Shipping management">
      <Tabs tabs={[
        { id: "partners", label: "Partners" },
        { id: "rates", label: "Rates" },
        { id: "zones", label: "Zones" },
        { id: "tracking", label: "Tracking" },
      ]} active={tab} onChange={setTab} />

      <div className="mt-4 space-y-4">
        {tab === "partners" && (
          <Card>
            <h3 className="font-semibold mb-3">Shipping Partners</h3>
            {shipping.partners.map((p) => (
              <div key={p.id} className="flex justify-between py-2 border-b last:border-0">
                <span>{p.name}</span>
                <Badge variant={p.active ? "success" : "default"}>{p.active ? "Active" : "Inactive"}</Badge>
              </div>
            ))}
            <Button size="sm" className="mt-3" variant="secondary">Add Partner</Button>
          </Card>
        )}
        {tab === "rates" && (
          <DataTable columns={[{ key: "zone", label: "Zone" }, { key: "rate", label: "Rate" }]} rows={shipping.rates.map((r) => ({ ...r, rate: `$${r.rate}` }))} />
        )}
        {tab === "zones" && (
          <Card>
            {shipping.zones.map((z) => <div key={z.id} className="py-2 border-b last:border-0">{z.name}</div>)}
            <Button size="sm" className="mt-3" variant="secondary">Add Zone</Button>
          </Card>
        )}
        {tab === "tracking" && (
          <Card aria-label="Tracking">
            <h3 className="font-semibold mb-2">Tracking</h3>
            <p className="text-sm text-gray-500 mb-3">Track shipments across partners.</p>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center text-gray-400">Tracking integration placeholder</div>
          </Card>
        )}
      </div>

      <Card className="mt-4" aria-label="Shipping labels placeholder">
        <h3 className="font-semibold mb-2">Shipping Labels</h3>
        <p className="text-sm text-gray-500 mb-3">Label generation placeholder.</p>
        <Button size="sm" variant="secondary">Generate Label</Button>
      </Card>
    </div>
  );
};

export default ShippingView;
